'use strict';

/* =============================================================================
   Daily Intentionality Scheduler — scheduler.js
   Core scheduling logic (data model, buffered start/end calculation, the
   Ripple Shift algorithm), local persistence, .ics export, and the render
   layer for the hotbar world. app.js is the thin bootstrap that wires this
   up to the DOM and the Service Worker.

   Everything here is attached to the global scope on purpose — no bundler,
   no modules, so the whole app stays a handful of <script> tags that work
   from a Cache-First Service Worker with zero build step.
   ============================================================================= */

/* -----------------------------------------------------------------------------
   1. Data model
   -------------------------------------------------------------------------- */
const BIOME = Object.freeze({
  MORNING: 'morning',
  AFTERNOON: 'afternoon',
  EVENING: 'evening'
});

const BIOME_LABEL = Object.freeze({
  [BIOME.MORNING]: 'Morning',
  [BIOME.AFTERNOON]: 'Midday',
  [BIOME.EVENING]: 'Evening'
});

const DEFAULT_ANCHOR = '08:00';
const HOTBAR_SLOTS = 9;

class Task {
  /**
   * @param {Object} opts
   * @param {string} opts.title
   * @param {string} opts.item       - key into ITEM_ICONS
   * @param {number} opts.duration   - minutes, must be > 0
   * @param {string} [opts.id]
   * @param {string} [opts.startTime] - 'HH:MM', computed by ScheduleEngine.assemble
   * @param {string} [opts.endTime]   - 'HH:MM', computed by ScheduleEngine.assemble
   * @param {string} [opts.biome]     - derived from startTime by assemble
   */
  constructor({ title, item, duration, id, startTime, endTime, biome }) {
    this.id = id || Task.makeId();
    this.title = title;
    this.item = item;
    this.duration = duration;
    this.startTime = startTime || null;
    this.endTime = endTime || null;
    this.biome = biome || BIOME.MORNING;
  }

  static makeId() {
    return `task_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
  }
}

/* -----------------------------------------------------------------------------
   2. Items — authored 16x16 pixel art, one per preset block
   -------------------------------------------------------------------------- */
const R = (x, y, w, h, fill) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"/>`;
const ICON = (body) => `<svg viewBox="0 0 16 16" shape-rendering="crispEdges" aria-hidden="true" focusable="false">${body}</svg>`;

const ITEM_ICONS = Object.freeze({
  // Cut gem: the block you protect the most.
  diamond: ICON(
    [
      R(6, 3, 4, 1, '#4AE0D0'), R(5, 4, 6, 1, '#4AE0D0'), R(4, 5, 8, 1, '#4AE0D0'),
      R(3, 6, 10, 3, '#4AE0D0'), R(4, 9, 8, 1, '#4AE0D0'), R(5, 10, 6, 1, '#4AE0D0'),
      R(6, 11, 4, 1, '#4AE0D0'), R(7, 12, 2, 1, '#4AE0D0'),
      R(6, 3, 2, 1, '#B9F7F0'), R(5, 4, 2, 1, '#B9F7F0'), R(4, 5, 2, 1, '#B9F7F0'),
      R(3, 6, 2, 1, '#B9F7F0'),
      R(11, 7, 2, 2, '#2A9E93'), R(10, 9, 2, 1, '#2A9E93'), R(9, 10, 2, 1, '#2A9E93'),
      R(8, 11, 2, 1, '#2A9E93'), R(7, 12, 2, 1, '#2A9E93')
    ].join('')
  ),
  // Marked paper: the block where you take something in.
  map: ICON(
    [
      R(2, 2, 12, 12, '#A8965E'),
      R(3, 3, 10, 10, '#E8DCB8'),
      R(4, 5, 8, 1, '#5A4A2A'), R(4, 7, 6, 1, '#5A4A2A'), R(4, 9, 8, 1, '#5A4A2A'),
      R(4, 11, 4, 1, '#5A4A2A'),
      R(3, 3, 10, 1, '#F5EDD4'), R(3, 3, 1, 10, '#F5EDD4')
    ].join('')
  ),
  // Iron: the block that costs the body something.
  iron: ICON(
    [
      R(4, 7, 8, 2, '#A8A8A8'),
      R(2, 5, 3, 6, '#A8A8A8'), R(11, 5, 3, 6, '#A8A8A8'),
      R(2, 5, 3, 1, '#DCDCDC'), R(11, 5, 3, 1, '#DCDCDC'), R(4, 7, 8, 1, '#DCDCDC'),
      R(2, 10, 3, 1, '#6E6E6E'), R(11, 10, 3, 1, '#6E6E6E'), R(4, 8, 8, 1, '#6E6E6E')
    ].join('')
  ),
  // Chest: the block where small obligations go.
  chest: ICON(
    [
      R(2, 3, 12, 11, '#8B5A2B'),
      R(2, 3, 12, 3, '#A06A33'),
      R(2, 3, 12, 1, '#B67C3E'),
      R(2, 6, 12, 1, '#5E3C1C'),
      R(2, 13, 12, 1, '#5E3C1C'),
      R(7, 5, 2, 4, '#C0C0C0'),
      R(7, 6, 2, 1, '#6E6E6E')
    ].join('')
  ),
  // Book: the block that is pure input.
  book: ICON(
    [
      R(3, 2, 10, 12, '#A32B22'),
      R(3, 2, 2, 12, '#7A1E17'),
      R(5, 3, 8, 10, '#E8E4DC'),
      R(6, 5, 6, 1, '#B8B2A4'), R(6, 7, 6, 1, '#B8B2A4'), R(6, 9, 4, 1, '#B8B2A4'),
      R(12, 7, 1, 2, '#C4A44A')
    ].join('')
  ),
  // Apple: the block that gives time back.
  apple: ICON(
    [
      R(8, 2, 1, 3, '#5A3D22'),
      R(9, 2, 3, 2, '#5A8C3A'), R(10, 3, 2, 1, '#47702C'),
      R(6, 4, 4, 1, '#C0392B'), R(4, 5, 8, 1, '#C0392B'), R(3, 6, 10, 5, '#C0392B'),
      R(4, 11, 8, 1, '#C0392B'), R(5, 12, 6, 1, '#C0392B'), R(6, 13, 4, 1, '#C0392B'),
      R(5, 5, 2, 1, '#E8574A'), R(4, 6, 2, 2, '#E8574A'),
      R(11, 9, 2, 2, '#8E241A'), R(9, 12, 2, 1, '#8E241A'), R(6, 13, 4, 1, '#8E241A')
    ].join('')
  )
});

// The inventory. Fixed blocks for now; custom names are not in scope yet.
const PRESETS = [
  { title: 'Deep Work', item: 'diamond', duration: 50 },
  { title: 'Study', item: 'map', duration: 45 },
  { title: 'Gym', item: 'iron', duration: 60 },
  { title: 'Admin', item: 'chest', duration: 20 },
  { title: 'Reading', item: 'book', duration: 30 },
  { title: 'Break', item: 'apple', duration: 15 }
];

/* -----------------------------------------------------------------------------
   3. Time utilities — 'HH:MM' <-> minutes-from-midnight
   -------------------------------------------------------------------------- */
const TimeUtil = {
  toMinutes(hhmm) {
    const [h, m] = hhmm.split(':').map(Number);
    return h * 60 + m;
  },
  toHHMM(totalMinutes) {
    const wrapped = ((totalMinutes % 1440) + 1440) % 1440; // clamp into a 24h day
    const h = Math.floor(wrapped / 60);
    const m = wrapped % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  },
  toDisplay(hhmm) {
    if (!hhmm) return '--:--';
    const [h, m] = hhmm.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 === 0 ? 12 : h % 12;
    return `${h12}:${String(m).padStart(2, '0')} ${period}`;
  },
  /** Short form for a hotbar slot, where the column order already implies AM/PM. */
  toShort(hhmm) {
    if (!hhmm) return '--:--';
    const [h, m] = hhmm.split(':').map(Number);
    const h12 = h % 12 === 0 ? 12 : h % 12;
    return `${h12}:${String(m).padStart(2, '0')}`;
  },
  /** A block's clock range, carrying the meridiem once when both ends share it. */
  toRange(startTime, endTime) {
    if (!startTime || !endTime) return '--:-- – --:--';
    const sameHalf = (Number(startTime.split(':')[0]) < 12) === (Number(endTime.split(':')[0]) < 12);
    const start = sameHalf ? TimeUtil.toShort(startTime) : TimeUtil.toDisplay(startTime);
    return `${start} – ${TimeUtil.toDisplay(endTime)}`;
  },
  /** The biome a clock time actually falls in — read off the clock, never asked. */
  biomeAt(hhmm) {
    if (!hhmm) return BIOME.MORNING;
    const h = Number(hhmm.split(':')[0]);
    if (h < 12) return BIOME.MORNING;
    if (h < 17) return BIOME.AFTERNOON;
    return BIOME.EVENING;
  },
  todayStamp(date = new Date()) {
    const pad = (n) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  },
  todayLabel(date = new Date()) {
    return date.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
  }
};

/* -----------------------------------------------------------------------------
   4. Schedule Engine — buffered start/end calculation + Ripple Shift
   -------------------------------------------------------------------------- */
const ScheduleEngine = {
  BUFFER_MINUTES: 15,

  /**
   * Treats `tasks` as a linked list of durations anchored to `anchorTime`
   * ('HH:MM'). Walks the list once, computing each task's startTime and
   * endTime and inserting the fixed T+15m buffer before the next task
   * starts. Each task's biome is derived from the clock time it landed on,
   * so the label can never contradict the schedule.
   */
  assemble(tasks, anchorTime) {
    let cursor = TimeUtil.toMinutes(anchorTime);
    let wrapsMidnight = false;
    for (const task of tasks) {
      const start = cursor;
      const end = start + task.duration;
      if (start >= 1440 || end > 1440) wrapsMidnight = true;
      task.startTime = TimeUtil.toHHMM(start);
      task.endTime = TimeUtil.toHHMM(end);
      task.biome = TimeUtil.biomeAt(task.startTime);
      cursor = end + ScheduleEngine.BUFFER_MINUTES;
    }
    return { tasks, wrapsMidnight };
  },

  /** Minutes from the day's start to the end of the last block, buffers included. */
  span(tasks) {
    if (tasks.length === 0) return 0;
    return tasks.reduce(
      (total, task, i) => total + task.duration + (i > 0 ? ScheduleEngine.BUFFER_MINUTES : 0),
      0
    );
  },

  /** Minutes from the day's start to the end of block `index`, buffers included. */
  elapsedThrough(tasks, index) {
    return tasks
      .slice(0, index + 1)
      .reduce((total, task, i) => total + task.duration + (i > 0 ? ScheduleEngine.BUFFER_MINUTES : 0), 0);
  },

  /**
   * Ripple Shift: the +15 interaction. The held block has run over, so a
   * single tap grows its footprint. Its own startTime stays put — it has
   * already begun — but re-assembling pushes every later block forward.
   *
   * @returns {{tasks: Task[], shiftedTaskId: string, downstreamIds: string[]}}
   */
  rippleShift(tasks, taskId, deltaMinutes, anchorTime) {
    const index = tasks.findIndex((t) => t.id === taskId);
    if (index === -1) return { tasks, shiftedTaskId: null, downstreamIds: [] };

    tasks[index].duration += deltaMinutes;
    ScheduleEngine.assemble(tasks, anchorTime);
    const downstreamIds = tasks.slice(index + 1).map((t) => t.id);
    return { tasks, shiftedTaskId: taskId, downstreamIds };
  }
};

/* -----------------------------------------------------------------------------
   5. Persistence — native IndexedDB, with an automatic localStorage fallback
   -------------------------------------------------------------------------- */
/**
 * iPadOS Safari can refuse IndexedDB in some private-browsing / low-storage
 * situations, so every write and read is wrapped so the app degrades instead
 * of losing data silently. Callers never need to know which backend is in use.
 */
class TaskStore {
  constructor() {
    this.dbName = 'dis-db';
    this.dbVersion = 1;
    this.storeName = 'appState';
    this.recordId = 'schedule'; // single-record: {tasks, anchorTime, localDate}
    this.localStorageKey = 'dis-schedule-v1';
    this._db = null;
    // Flip to false the first time IndexedDB proves unavailable/unusable,
    // so we stop retrying it on every save/load for the rest of the session.
    this._indexedDBAvailable = typeof indexedDB !== 'undefined';
  }

  /* ---- IndexedDB path ---------------------------------------------------- */
  _openIDB() {
    if (this._db) return Promise.resolve(this._db);
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(this.dbName, this.dbVersion);

      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'id' });
        }
      };

      req.onsuccess = () => {
        this._db = req.result;
        resolve(this._db);
      };

      req.onerror = () => reject(req.error);
    });
  }

  async _saveIDB(record) {
    const db = await this._openIDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.storeName, 'readwrite');
      tx.objectStore(this.storeName).put(record);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  }

  async _loadIDB() {
    const db = await this._openIDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.storeName, 'readonly');
      const req = tx.objectStore(this.storeName).get(this.recordId);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  }

  /* ---- localStorage fallback ---------------------------------------------- */
  _saveLocalStorage(record) {
    try {
      localStorage.setItem(this.localStorageKey, JSON.stringify(record));
      return true;
    } catch (err) {
      console.error('[TaskStore] localStorage save failed:', err);
      return false;
    }
  }

  _loadLocalStorage() {
    try {
      const raw = localStorage.getItem(this.localStorageKey);
      return raw ? JSON.parse(raw) : null;
    } catch (err) {
      console.error('[TaskStore] localStorage load failed:', err);
      return null;
    }
  }

  /* ---- Public API: callers never see which backend served the request ---- */
  async save({ tasks, anchorTime, localDate }) {
    const record = {
      id: this.recordId,
      tasks: tasks.map((t) => ({ ...t })),
      anchorTime,
      localDate: localDate || TimeUtil.todayStamp(),
      updatedAt: new Date().toISOString()
    };

    if (this._indexedDBAvailable) {
      try {
        return await this._saveIDB(record);
      } catch (err) {
        console.warn('[TaskStore] IndexedDB save failed, switching to localStorage:', err);
        this._indexedDBAvailable = false;
      }
    }
    return this._saveLocalStorage(record);
  }

  async load() {
    if (this._indexedDBAvailable) {
      try {
        const record = await this._loadIDB();
        if (record) return record;
        // No IDB record yet — still check localStorage in case the app
        // previously ran in fallback mode (e.g. a prior private session).
      } catch (err) {
        console.warn('[TaskStore] IndexedDB load failed, switching to localStorage:', err);
        this._indexedDBAvailable = false;
      }
    }
    return this._loadLocalStorage();
  }
}

/* -----------------------------------------------------------------------------
   6. iCal export — one-tap .ics generation for the iPadOS System Calendar
   -------------------------------------------------------------------------- */
/**
 * Builds a standards-compliant (RFC 5545) .ics file from the day's blocks and
 * triggers a download. Each block becomes a VEVENT with a 15-minute-before
 * VALARM, so importing into the iPadOS Calendar reproduces the same alert.
 */
const ICSExporter = {
  /** Escapes text per RFC 5545 §3.3.11 (backslash, semicolon, comma, newline). */
  _escapeText(str) {
    return String(str)
      .replace(/\\/g, '\\\\')
      .replace(/;/g, '\\;')
      .replace(/,/g, '\\,')
      .replace(/\n/g, '\\n');
  },

  /** Formats a Date as a floating local timestamp: YYYYMMDDTHHMMSS (no Z). */
  _formatLocal(date) {
    const pad = (n) => String(n).padStart(2, '0');
    return (
      `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}` +
      `T${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`
    );
  },

  /** Formats a Date as a UTC timestamp: YYYYMMDDTHHMMSSZ, for DTSTAMP. */
  _formatUTC(date) {
    const pad = (n) => String(n).padStart(2, '0');
    return (
      `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}` +
      `T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`
    );
  },

  /**
   * Builds the .ics file contents for a day's block list.
   * @param {Task[]} tasks        - in schedule order (as assembled)
   * @param {string} anchorTime   - 'HH:MM' start of day, used to anchor block 1
   * @param {Date}   [baseDate]   - defaults to today; lets callers export any day
   * @returns {string} CRLF-joined .ics file content
   */
  buildICS(tasks, anchorTime, baseDate = new Date()) {
    const [anchorH, anchorM] = anchorTime.split(':').map(Number);
    let cursor = new Date(baseDate);
    cursor.setHours(anchorH, anchorM, 0, 0);

    const now = new Date();
    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Daily Intentionality Scheduler//iPadOS//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH'
    ];

    tasks.forEach((task) => {
      const dtStart = new Date(cursor);
      const dtEnd = new Date(dtStart.getTime() + task.duration * 60000);

      lines.push(
        'BEGIN:VEVENT',
        `UID:${task.id}@daily-intentionality-scheduler`,
        `DTSTAMP:${ICSExporter._formatUTC(now)}`,
        `DTSTART:${ICSExporter._formatLocal(dtStart)}`,
        `DTEND:${ICSExporter._formatLocal(dtEnd)}`,
        `SUMMARY:${ICSExporter._escapeText(task.title)}`,
        `DESCRIPTION:${ICSExporter._escapeText(`Planned with Daily Intentionality Scheduler — ${task.duration} min block.`)}`,
        'BEGIN:VALARM',
        'ACTION:DISPLAY',
        `DESCRIPTION:${ICSExporter._escapeText(`${task.title} starts in 15 minutes`)}`,
        'TRIGGER:-PT15M',
        'END:VALARM',
        'END:VEVENT'
      );

      // The next block's clock starts after this one's duration + the buffer.
      cursor = new Date(dtEnd.getTime() + ScheduleEngine.BUFFER_MINUTES * 60000);
    });

    lines.push('END:VCALENDAR');
    return lines.join('\r\n');
  },

  /**
   * Triggers a one-tap download of the given .ics content. iPadOS Safari
   * opens downloaded .ics files with an "Add to Calendar" prompt, which is
   * the hand-off point into the native System Calendar.
   */
  download(icsContent, filename = 'daily-schedule.ics') {
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // Revoke on a delay so Safari has time to actually start the download.
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  },

  /** Convenience: build + download in one call. */
  exportAndDownload(tasks, anchorTime, baseDate = new Date()) {
    const filename = `daily-schedule-${baseDate.toISOString().slice(0, 10)}.ics`;
    const ics = ICSExporter.buildICS(tasks, anchorTime, baseDate);
    ICSExporter.download(ics, filename);
  }
};

/* -----------------------------------------------------------------------------
   7. Render layer — the hotbar, the block in hand, the inventory
   -------------------------------------------------------------------------- */
const escapeHTML = (str) =>
  String(str).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[c]);

const Renderer = {
  /** The inventory grid. `onTake(presetIndex)` fires on tap. */
  renderInventory(container, presets, onTake) {
    container.innerHTML = '';
    presets.forEach((preset, index) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'item';
      btn.innerHTML = `
        <span class="item__icon">${ITEM_ICONS[preset.item]}</span>
        <span>
          <span class="item__name">${escapeHTML(preset.title)}</span>
          <span class="item__mins">${preset.duration} min</span>
        </span>
      `;
      btn.addEventListener('click', () => onTake(index));
      container.appendChild(btn);
    });
  },

  /**
   * The hotbar: nine slots, filled left to right in schedule order. The held
   * slot wears the white frame.
   */
  renderHotbar(container, tasks, heldIndex, { onSelect, shiftedIds = [], shiftedFrom = 0 }) {
    container.innerHTML = '';
    for (let i = 0; i < HOTBAR_SLOTS; i += 1) {
      const task = tasks[i];
      const li = document.createElement('li');

      if (!task) {
        const empty = document.createElement('span');
        empty.className = 'slot slot--empty';
        empty.setAttribute('aria-hidden', 'true');
        li.appendChild(empty);
        container.appendChild(li);
        continue;
      }

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'slot';
      btn.dataset.biome = task.biome;
      if (i === heldIndex) {
        btn.classList.add('is-held');
        btn.setAttribute('aria-current', 'true');
      }
      if (shiftedIds.includes(task.id)) {
        btn.classList.add('is-shifted');
        // the wave starts at the block you grew, not at the left edge of the bar
        btn.style.setProperty('--i', String(Math.max(0, i - shiftedFrom - 1)));
      }
      btn.setAttribute(
        'aria-label',
        `Slot ${i + 1}: ${task.title}, ${TimeUtil.toDisplay(task.startTime)} to ${TimeUtil.toDisplay(task.endTime)}`
      );
      btn.innerHTML = `
        <span class="slot__num" aria-hidden="true">${i + 1}</span>
        <span class="slot__icon">${ITEM_ICONS[task.item] || ITEM_ICONS.chest}</span>
        <span class="slot__clock" aria-hidden="true">${TimeUtil.toShort(task.startTime)}</span>
      `;
      btn.addEventListener('click', () => onSelect(i));
      li.appendChild(btn);
      container.appendChild(li);
    }
  },

  /** The block in hand, at the scale it has in life. */
  renderHeld(container, task, { index, total, onRipple, onRemove, swapped = false }) {
    container.innerHTML = '';

    if (!task) {
      const hollow = document.createElement('div');
      hollow.className = 'hollow';
      hollow.innerHTML = `
        <p class="hollow__title">Nothing in hand</p>
        <p class="hollow__note">Open the inventory and take a block. It stacks onto the end of the day and picks up a real clock time.</p>
      `;
      container.appendChild(hollow);
      return;
    }

    const block = document.createElement('div');
    block.className = swapped ? 'block is-swapped' : 'block';
    block.innerHTML = `
      <div class="block__grass" aria-hidden="true"></div>
      <div class="block__face">
        <span class="block__item">${ITEM_ICONS[task.item] || ITEM_ICONS.chest}</span>
        <h2 class="block__title">${escapeHTML(task.title)}</h2>
        <p class="block__clock">${TimeUtil.toRange(task.startTime, task.endTime)}</p>
        <p class="block__meta">${task.duration} min · ${BIOME_LABEL[task.biome]} · slot ${index + 1} of ${total}</p>
        <div class="block__acts">
          <button type="button" class="btn btn--gold" data-action="ripple">+15 min</button>
          <button type="button" class="btn btn--stone" data-action="remove">Drop block</button>
        </div>
      </div>
    `;
    block.querySelector('[data-action="ripple"]').addEventListener('click', () => onRipple(task.id));
    block.querySelector('[data-action="remove"]').addEventListener('click', () => onRemove(task.id));
    container.appendChild(block);
  },

  /** The top rail's one-line account of the whole day. */
  renderTally(labelEl, tasks) {
    if (tasks.length === 0) {
      labelEl.textContent = 'Nothing stacked yet.';
      return;
    }
    const total = ScheduleEngine.span(tasks);
    const hours = Math.floor(total / 60);
    const mins = total % 60;
    const length = hours > 0 ? `${hours}h${mins > 0 ? ` ${mins}m` : ''}` : `${mins}m`;
    const last = tasks[tasks.length - 1];
    labelEl.textContent =
      `${tasks.length} block${tasks.length === 1 ? '' : 's'} · ` +
      `${TimeUtil.toRange(tasks[0].startTime, last.endTime)} · ${length}`;
  },

  /**
   * The bar under the block in hand: green is the day up to the end of the
   * held block, gold is the 15-minute buffer that follows it.
   */
  renderBuffer(fillEl, bufferEl, labelEl, tasks, heldIndex) {
    const task = tasks[heldIndex];
    if (!task) {
      fillEl.style.setProperty('--fill', '0');
      bufferEl.style.setProperty('--fill', '0');
      bufferEl.style.setProperty('--buffer', '0');
      labelEl.innerHTML = 'The day is empty. Nothing is on the calendar yet.';
      return;
    }

    const span = ScheduleEngine.span(tasks);
    const elapsed = ScheduleEngine.elapsedThrough(tasks, heldIndex);
    const next = tasks[heldIndex + 1];
    const fill = elapsed / span;

    fillEl.style.setProperty('--fill', String(fill));
    bufferEl.style.setProperty('--fill', String(fill));
    bufferEl.style.setProperty('--buffer', next ? String(ScheduleEngine.BUFFER_MINUTES / span) : '0');
    labelEl.innerHTML = next
      ? `Ends <b>${TimeUtil.toDisplay(task.endTime)}</b> · 15 min buffer · then ${escapeHTML(next.title)}`
      : `Ends <b>${TimeUtil.toDisplay(task.endTime)}</b> · last block of the day`;
  }
};
