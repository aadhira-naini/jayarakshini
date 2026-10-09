/**
 * Flood-fill based background removal using HTML Canvas.
 *
 * Algorithm:
 *  1. Average the background colour from corner + border pixels.
 *  2. BFS from every border pixel.
 *  3. If the pixel colour is within `threshold` of the averaged border colour,
 *     set its alpha to 0 (transparent) and continue the fill inward.
 *  4. Second pass: slightly higher tolerance catches residual grey halos.
 *  5. Edge pixels near bg are softened (partial transparency).
 *
 * Works well for sticker-style images with uniform light/grey/white borders.
 *
 * @param {string} src        – image URL (must be same-origin)
 * @param {object} [opts]
 * @param {number} [opts.threshold=68]  – colour-distance tolerance (0–255 range)
 * @returns {Promise<string>} data-URL of the processed PNG (transparent where bg was)
 */
export function removeBackground(src, { threshold = 68 } = {}) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const w = img.naturalWidth;
      const h = img.naturalHeight;

      const canvas = document.createElement('canvas');
      canvas.width  = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      const imgData = ctx.getImageData(0, 0, w, h);
      const d = imgData.data;

      /* ── 1. Sample bg colour from corners + borders ───────────── */
      let bgR = 0, bgG = 0, bgB = 0, n = 0;
      const samplePx = (x, y) => {
        const i = (y * w + x) * 4;
        bgR += d[i]; bgG += d[i + 1]; bgB += d[i + 2];
        n++;
      };
      // Sample all 4 borders
      for (let x = 0; x < w; x++) { samplePx(x, 0); samplePx(x, h - 1); }
      for (let y = 1; y < h - 1; y++) { samplePx(0, y); samplePx(w - 1, y); }
      bgR /= n; bgG /= n; bgB /= n;

      const dist = (i) => {
        const dr = d[i] - bgR, dg = d[i + 1] - bgG, db = d[i + 2] - bgB;
        return Math.sqrt(dr * dr + dg * dg + db * db);
      };

      /* ── 2. BFS flood fill from every border pixel ────────────── */
      const runFlood = (thresh, visited) => {
        const queue = new Int32Array(w * h);
        let qi = 0, qEnd = 0;

        const enqueue = (pos) => {
          if (!visited[pos]) { visited[pos] = 1; queue[qEnd++] = pos; }
        };

        for (let x = 0; x < w; x++) {
          enqueue(x);
          enqueue((h - 1) * w + x);
        }
        for (let y = 1; y < h - 1; y++) {
          enqueue(y * w);
          enqueue(y * w + (w - 1));
        }

        while (qi < qEnd) {
          const pos = queue[qi++];
          const idx = pos * 4;

          if (dist(idx) < thresh) {
            d[idx + 3] = 0;

            const x = pos % w;
            const y = Math.floor(pos / w);
            if (x > 0)     enqueue(pos - 1);
            if (x < w - 1) enqueue(pos + 1);
            if (y > 0)     enqueue(pos - w);
            if (y < h - 1) enqueue(pos + w);
          }
        }
      };

      /* ── 3. Pass 1: main removal ──────────────────────────────── */
      const visited1 = new Uint8Array(w * h);
      runFlood(threshold, visited1);

      /* ── 4. Pass 2: second pass with +18 tolerance for halos ──── */
      const visited2 = new Uint8Array(w * h);
      runFlood(threshold + 18, visited2);

      /* ── 5. Soften semi-transparent edge pixels ───────────────── */
      // Any pixel adjacent to a transparent pixel that is close-ish to bg gets dimmed
      const edgeSoftThresh = threshold + 32;
      for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
          const pos = y * w + x;
          const idx = pos * 4;
          if (d[idx + 3] === 0) continue; // already transparent
          // Check if any 4-neighbour is transparent
          const hasTransNeighbour =
            d[((y - 1) * w + x) * 4 + 3] === 0 ||
            d[((y + 1) * w + x) * 4 + 3] === 0 ||
            d[(y * w + x - 1) * 4 + 3] === 0 ||
            d[(y * w + x + 1) * 4 + 3] === 0;
          if (hasTransNeighbour && dist(idx) < edgeSoftThresh) {
            // Fade based on how close to bg color
            const ratio = dist(idx) / edgeSoftThresh;
            d[idx + 3] = Math.round(ratio * 220);
          }
        }
      }

      ctx.putImageData(imgData, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };

    img.onerror = () => resolve(src); // fallback: original src
    img.src = src;
  });
}

/**
 * Process an array of image sources in parallel.
 * Returns an array of processed data-URLs in the same order.
 */
export function removeBackgrounds(srcs, opts) {
  return Promise.all(srcs.map((src) => removeBackground(src, opts)));
}

/**
 * Green-screen (chroma-key) background removal.
 *
 * Targets pixels where green channel dominates (G >> R and G >> B).
 * BFS flood-fills from all border pixels so only background green
 * is removed — green tints inside the subject that are enclosed
 * by non-green pixels are preserved.
 *
 * Perfect for lamp.png which has a vivid lime-green background but a
 * white/cream/pink lamp that has no dominant-green pixels.
 *
 * @param {string} src
 * @param {object} [opts]
 * @param {number} [opts.greenDominance=60]  – how much G must exceed R and B
 * @param {number} [opts.minGreen=100]       – minimum G value to be "green"
 * @returns {Promise<string>} transparent PNG data-URL
 */
export function removeGreenScreen(src, { greenDominance = 60, minGreen = 100 } = {}) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const w = img.naturalWidth;
      const h = img.naturalHeight;

      const canvas = document.createElement('canvas');
      canvas.width  = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      const imgData = ctx.getImageData(0, 0, w, h);
      const d = imgData.data;

      /* ── Is this pixel "green screen" green? ──────────────────── */
      const isGreen = (idx) => {
        const r = d[idx], g = d[idx + 1], b = d[idx + 2];
        return g > minGreen && (g - r) > greenDominance && (g - b) > greenDominance;
      };

      /* ── BFS flood fill from every border pixel ───────────────── */
      const visited = new Uint8Array(w * h);
      const queue   = new Int32Array(w * h);
      let qi = 0, qEnd = 0;

      const enqueue = (pos) => {
        if (!visited[pos]) { visited[pos] = 1; queue[qEnd++] = pos; }
      };

      for (let x = 0; x < w; x++) {
        enqueue(x);
        enqueue((h - 1) * w + x);
      }
      for (let y = 1; y < h - 1; y++) {
        enqueue(y * w);
        enqueue(y * w + (w - 1));
      }

      while (qi < qEnd) {
        const pos = queue[qi++];
        const idx = pos * 4;

        if (isGreen(idx)) {
          d[idx + 3] = 0; // fully transparent

          const x = pos % w;
          const y = Math.floor(pos / w);
          if (x > 0)     enqueue(pos - 1);
          if (x < w - 1) enqueue(pos + 1);
          if (y > 0)     enqueue(pos - w);
          if (y < h - 1) enqueue(pos + w);
        }
      }

      /* ── Second pass: lower threshold for stubborn border fringe ── */
      // Re-flood from border with half the dominance threshold to catch
      // mixed green/shadow pixels at the lamp base bottom-left corner.
      const visited2 = new Uint8Array(w * h);
      const queue2   = new Int32Array(w * h);
      let qi2 = 0, qEnd2 = 0;
      const looseDom = Math.floor(greenDominance / 2);

      const isLooseGreen = (idx) => {
        const r = d[idx], g = d[idx + 1], b = d[idx + 2];
        return g > minGreen && (g - r) > looseDom && (g - b) > looseDom;
      };

      const enqueue2 = (pos) => {
        if (!visited2[pos]) { visited2[pos] = 1; queue2[qEnd2++] = pos; }
      };

      for (let x = 0; x < w; x++) {
        enqueue2(x);
        enqueue2((h - 1) * w + x);
      }
      for (let y = 1; y < h - 1; y++) {
        enqueue2(y * w);
        enqueue2(y * w + (w - 1));
      }

      while (qi2 < qEnd2) {
        const pos = queue2[qi2++];
        const idx = pos * 4;
        // Only remove if already transparent (border-reachable) OR still loose-green
        if (d[idx + 3] === 0 || isLooseGreen(idx)) {
          d[idx + 3] = 0;
          const x = pos % w;
          const y = Math.floor(pos / w);
          if (x > 0)     enqueue2(pos - 1);
          if (x < w - 1) enqueue2(pos + 1);
          if (y > 0)     enqueue2(pos - w);
          if (y < h - 1) enqueue2(pos + w);
        }
      }

      /* ── Soften green-fringe edge pixels ─────────────────────── */
      // Pixels next to transparent that have any greenish cast get faded
      for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
          const pos = y * w + x;
          const idx = pos * 4;
          if (d[idx + 3] === 0) continue;
          const hasTransNeighbour =
            d[((y - 1) * w + x) * 4 + 3] === 0 ||
            d[((y + 1) * w + x) * 4 + 3] === 0 ||
            d[(y * w + x - 1) * 4 + 3]   === 0 ||
            d[(y * w + x + 1) * 4 + 3]   === 0;
          if (hasTransNeighbour) {
            const r = d[idx], g = d[idx + 1], b = d[idx + 2];
            // Partial transparency proportional to how "green" the pixel is
            const greenness = Math.max(0, Math.min(1, ((g - r) + (g - b)) / (greenDominance * 2)));
            if (greenness > 0.1) {
              d[idx + 3] = Math.round((1 - greenness) * 255);
            }
          }
        }
      }

      ctx.putImageData(imgData, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };

    img.onerror = () => resolve(src);
    img.src = src;
  });
}
