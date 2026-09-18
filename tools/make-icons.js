'use strict';

/**
 * Writes the app icons as authored pixel art in the built world's own palette:
 * a grass-topped dirt block with the interface's 3px bevel, upscaled
 * nearest-neighbour so every pixel stays square. Run with `node tools/make-icons.js`.
 */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const DIRT = { base: [0x51, 0x37, 0x23], dark: [0x3e, 0x2a, 0x1b], light: [0x60, 0x43, 0x27], deep: [0x2f, 0x20, 0x12] };
const GRASS = { base: [0x5a, 0x8c, 0x3a], light: [0x6e, 0xa6, 0x46], dark: [0x47, 0x70, 0x2c], deep: [0x3a, 0x5c, 0x24] };
const GRASS_ROWS = 5;

/** Mulberry32: the speckle pattern has to be identical on every run. */
function rng(seed) {
  let t = seed;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function tile16() {
  const next = rng(7);
  const cells = [];
  for (let y = 0; y < 16; y += 1) {
    for (let x = 0; x < 16; x += 1) {
      const p = y < GRASS_ROWS ? GRASS : DIRT;
      const r = next();
      let c = p.base;
      if (r < 0.18) c = p.dark;
      else if (r < 0.36) c = p.light;
      else if (r < 0.44) c = p.deep;
      cells.push(c);
    }
  }
  // the grass crown and the soil line, so the block reads as ground
  for (let x = 0; x < 16; x += 1) {
    if (next() < 0.5) cells[x] = GRASS.light;
    if (next() < 0.4) cells[(GRASS_ROWS - 1) * 16 + x] = GRASS.deep;
  }
  return cells;
}

function render(size, cells) {
  const px = new Uint8Array(size * size * 3);
  const bevel = Math.max(2, Math.round(size * 0.045));
  const put = (x, y, rgb, mix, amount) => {
    const i = (y * size + x) * 3;
    for (let k = 0; k < 3; k += 1) {
      px[i + k] = mix === undefined ? rgb[k] : Math.round(rgb[k] + (mix - rgb[k]) * amount);
    }
  };

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const c = cells[Math.floor((y * 16) / size) * 16 + Math.floor((x * 16) / size)];
      const lit = x < bevel || y < bevel;
      const shade = x >= size - bevel || y >= size - bevel;
      if (lit && !shade) put(x, y, c, 255, 0.3);
      else if (shade) put(x, y, c, 0, 0.4);
      else put(x, y, c);
    }
  }
  return px;
}

function png(size, px) {
  const chunk = (type, data) => {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(body) >>> 0);
    return Buffer.concat([len, body, crc]);
  };

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // truecolour
  const scanlines = Buffer.alloc(size * (size * 3 + 1));
  for (let y = 0; y < size; y += 1) {
    scanlines[y * (size * 3 + 1)] = 0; // no filter
    Buffer.from(px.buffer, y * size * 3, size * 3).copy(scanlines, y * (size * 3 + 1) + 1);
  }

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(scanlines, { level: 9 })),
    chunk('IEND', Buffer.alloc(0))
  ]);
}

const CRC_TABLE = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i += 1) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return c ^ -1;
}

const cells = tile16();
const out = path.join(__dirname, '..', 'icons');
fs.mkdirSync(out, { recursive: true });
for (const [name, size] of [['icon-512.png', 512], ['icon-192.png', 192], ['apple-touch-icon.png', 180]]) {
  fs.writeFileSync(path.join(out, name), png(size, render(size, cells)));
  console.log(`${name} ${size}x${size}`);
}
