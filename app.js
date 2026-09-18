'use strict';

/* =============================================================================
   Daily Intentionality Scheduler — app.js
   Bootstrap: Service Worker, DOM wiring, controllers.
   ============================================================================= */

function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('./sw.js')
      .catch(() => {
        showToast('Offline cache could not start. The planner still works.');
      });
  });
}

const store = new TaskStore();

const state = {
  tasks: /** @type {Task[]} */ ([]),
  anchorTime: DEFAULT_ANCHOR,
  heldIndex: 0,
  renderedHeldIndex: -1,
  lastShift: { shiftedTaskId: null, downstreamIds: [], fromIndex: 0 },
  inventoryOpen: false,
  undo: null,
  wrapsMidnight: false
};

const el = {};

function cloneTasks(tasks) {
  return tasks.map((t) => new Task({ ...t }));
}

function snapshotSchedule() {
  return {
    tasks: cloneTasks(state.tasks),
    anchorTime: state.anchorTime,
    heldIndex: state.heldIndex
  };
}

function clampHeld() {
  if (state.tasks.length === 0) {
    state.heldIndex = 0;
    return;
  }
  state.heldIndex = Math.min(Math.max(state.heldIndex, 0), state.tasks.length - 1);
}

function renderAll() {
  const assembled = ScheduleEngine.assemble(state.tasks, state.anchorTime);
  state.wrapsMidnight = Boolean(assembled.wrapsMidnight);
  clampHeld();

  Renderer.renderHeld(el.held, state.tasks[state.heldIndex], {
    index: state.heldIndex,
    total: state.tasks.length,
    onRipple: handleRippleShift,
    onRemove: handleRemoveTask,
    swapped: state.heldIndex !== state.renderedHeldIndex
  });
  Renderer.renderHotbar(el.hotbar, state.tasks, state.heldIndex, {
    onSelect: handleSelectSlot,
    shiftedIds: state.lastShift.downstreamIds,
    shiftedFrom: state.lastShift.fromIndex
  });
  Renderer.renderBuffer(el.xpFill, el.xpBuffer, el.xpLabel, state.tasks, state.heldIndex);
  Renderer.renderTally(el.tally, state.tasks);

  el.exportButton.disabled = state.tasks.length === 0;
  el.wrapBanner.hidden = !state.wrapsMidnight;
  el.dayStamp.textContent = TimeUtil.todayLabel();
  state.renderedHeldIndex = state.heldIndex;
  state.lastShift = { shiftedTaskId: null, downstreamIds: [], fromIndex: 0 };
}

async function persist() {
  try {
    const ok = await store.save({
      tasks: state.tasks,
      anchorTime: state.anchorTime,
      localDate: TimeUtil.todayStamp()
    });
    if (ok === false) showToast('Could not save this day. Try again.');
  } catch (err) {
    showToast('Could not save this day. Try again.');
  }
}

let toastTimer = 0;

function showToast(message, { undo = false } = {}) {
  el.toastMessage.textContent = message;
  el.toastUndo.hidden = !undo;
  el.toast.hidden = false;
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(hideToast, 6000);
}

function hideToast() {
  el.toast.hidden = true;
  el.toastUndo.hidden = true;
}

/* -----------------------------------------------------------------------------
   Inventory
   -------------------------------------------------------------------------- */
function openInventory({ announceFull = true } = {}) {
  if (state.tasks.length >= HOTBAR_SLOTS) {
    if (announceFull) showToast(`The hotbar holds ${HOTBAR_SLOTS} blocks. Drop one to make room.`);
    return;
  }
  state.inventoryOpen = true;
  el.inventory.hidden = false;
  el.scrim.hidden = false;
  el.world.inert = true;
  el.inventoryToggle.setAttribute('aria-expanded', 'true');
  const first = el.presetGrid.querySelector('.item');
  if (first) first.focus();
}

function closeInventory({ restoreFocus = true } = {}) {
  state.inventoryOpen = false;
  el.inventory.hidden = true;
  el.scrim.hidden = true;
  el.world.inert = false;
  el.inventoryToggle.setAttribute('aria-expanded', 'false');
  if (restoreFocus) el.inventoryToggle.focus();
}

/** Keeps Tab inside the open chest; `inert` alone does not wrap the cycle. */
function trapTab(event) {
  const focusable = el.inventory.querySelectorAll('button:not(:disabled)');
  if (focusable.length === 0) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

function toggleInventory() {
  if (state.inventoryOpen) closeInventory();
  else openInventory();
}

/* -----------------------------------------------------------------------------
   Controllers
   -------------------------------------------------------------------------- */
function takeFromInventory(presetIndex) {
  if (state.tasks.length >= HOTBAR_SLOTS) {
    showToast(`The hotbar holds ${HOTBAR_SLOTS} blocks. Drop one to make room.`);
    return;
  }
  const preset = PRESETS[presetIndex];
  state.tasks.push(new Task({
    title: preset.title,
    item: preset.item,
    duration: preset.duration
  }));
  state.heldIndex = state.tasks.length - 1;
  if (state.tasks.length >= HOTBAR_SLOTS) closeInventory();
  renderAll();
  persist();
}

function handleSelectSlot(index) {
  if (!state.tasks[index]) return;
  state.heldIndex = index;
  renderAll();
}

function handleRippleShift(taskId) {
  state.undo = snapshotSchedule();
  const { shiftedTaskId, downstreamIds } = ScheduleEngine.rippleShift(
    state.tasks,
    taskId,
    ScheduleEngine.BUFFER_MINUTES,
    state.anchorTime
  );
  state.lastShift = {
    shiftedTaskId,
    downstreamIds,
    fromIndex: state.tasks.findIndex((t) => t.id === taskId)
  };
  renderAll();
  persist();
  showToast('Grew this block by 15 minutes. Everything after it slid down.', { undo: true });
}

function handleRemoveTask(taskId) {
  state.undo = snapshotSchedule();
  const index = state.tasks.findIndex((t) => t.id === taskId);
  state.tasks = state.tasks.filter((t) => t.id !== taskId);
  if (index > -1 && index <= state.heldIndex) state.heldIndex = Math.max(0, state.heldIndex - 1);
  renderAll();
  persist();
  showToast('Block dropped.', { undo: true });
}

function handleUndo() {
  if (!state.undo) return;
  state.tasks = cloneTasks(state.undo.tasks);
  state.anchorTime = state.undo.anchorTime;
  state.heldIndex = state.undo.heldIndex;
  el.anchorInput.value = state.anchorTime;
  state.undo = null;
  hideToast();
  renderAll();
  persist();
}

function handleAnchorChange(value) {
  if (!value) return;
  state.anchorTime = value;
  renderAll();
  persist();
}

function handleExportCalendar() {
  if (state.tasks.length === 0) return;
  ICSExporter.exportAndDownload(state.tasks, state.anchorTime);
  showToast('Calendar file saved. Open it to add the day.');
}

function handleKeydown(event) {
  if (event.metaKey || event.ctrlKey || event.altKey) return;
  const typing = event.target.matches('input, textarea, select');

  if (state.inventoryOpen) {
    if (event.key === 'Escape') {
      closeInventory();
      return;
    }
    if (event.key === 'Tab') {
      trapTab(event);
      return;
    }
  }
  if (typing) return;

  if (event.key === 'e' || event.key === 'E') {
    event.preventDefault();
    toggleInventory();
    return;
  }
  if (/^[1-9]$/.test(event.key)) {
    const index = Number(event.key) - 1;
    if (state.tasks[index]) {
      event.preventDefault();
      handleSelectSlot(index);
    }
  }
}

/* -----------------------------------------------------------------------------
   Boot
   -------------------------------------------------------------------------- */
async function hydrateFromStore() {
  const saved = await store.load();
  if (!saved) return false;
  const today = TimeUtil.todayStamp();
  state.anchorTime = saved.anchorTime || state.anchorTime;
  if (saved.localDate && saved.localDate !== today) {
    state.tasks = [];
    return true; // stale day discarded — caller should persist
  }
  state.tasks = (saved.tasks || []).map((t) => new Task(t));
  return false;
}

async function init() {
  el.world = document.getElementById('world');
  el.dayStamp = document.getElementById('dayStamp');
  el.anchorInput = document.getElementById('anchorTime');
  el.tally = document.getElementById('tally');
  el.held = document.getElementById('held');
  el.wrapBanner = document.getElementById('wrapBanner');
  el.xpFill = document.getElementById('xpFill');
  el.xpBuffer = document.getElementById('xpBuffer');
  el.xpLabel = document.getElementById('xpLabel');
  el.hotbar = document.getElementById('hotbar');
  el.inventory = document.getElementById('inventory');
  el.inventoryToggle = document.getElementById('inventoryToggle');
  el.inventoryClose = document.getElementById('inventoryClose');
  el.presetGrid = document.getElementById('presetGrid');
  el.scrim = document.getElementById('scrim');
  el.exportButton = document.getElementById('exportButton');
  el.toast = document.getElementById('toast');
  el.toastMessage = document.getElementById('toastMessage');
  el.toastUndo = document.getElementById('toastUndo');

  el.anchorInput.addEventListener('change', (e) => handleAnchorChange(e.target.value));
  el.exportButton.addEventListener('click', handleExportCalendar);
  el.inventoryToggle.addEventListener('click', () => toggleInventory());
  el.inventoryClose.addEventListener('click', () => closeInventory());
  el.scrim.addEventListener('click', () => closeInventory());
  el.toastUndo.addEventListener('click', handleUndo);
  document.addEventListener('keydown', handleKeydown);

  Renderer.renderInventory(el.presetGrid, PRESETS, takeFromInventory);

  const discardedStaleDay = await hydrateFromStore();
  el.anchorInput.value = state.anchorTime;
  renderAll();
  if (discardedStaleDay) persist();

  // An empty day opens the chest: the first block is one tap away.
  if (state.tasks.length === 0) openInventory({ announceFull: false });
}

registerServiceWorker();
document.addEventListener('DOMContentLoaded', init);
