---
name: Daily Intentionality Scheduler
description: The day is the hotbar you are holding — a dirt field, nine slots, one block in hand.
colors:
  ground: "#513723"
  ground-deep: "#241A10"
  ground-speckle: "#3E2A1B"
  ground-speckle-lt: "#604327"
  stone: "#8B8B8B"
  stone-lt: "#ADADAD"
  stone-mid: "#6E6E6E"
  stone-dk: "#5A5A5A"
  stone-bevel-dk: "#3C3C3C"
  deepslate: "#3F3F3F"
  deepslate-lt: "#585858"
  deepslate-dk: "#232323"
  well-dk: "#141414"
  grass: "#5A8C3A"
  grass-dk: "#3A5C24"
  grass-lit: "#6EA646"
  grass-lit-hi: "#7FB855"
  grass-lit-speckle: "#639440"
  grass-lit-bevel: "#8FC96A"
  gold: "#C4A44A"
  gold-lt: "#E0C264"
  gold-dk: "#8A7128"
  redstone: "#A32B22"
  redstone-lt: "#C4443A"
  redstone-dk: "#6E1A14"
  xp: "#7EDB2E"
  xp-lt: "#A6F05C"
  text: "#F4F1E8"
  text-dim: "#CFC4AC"
  text-disabled: "#D5CCBA"
  text-ink: "#1E1710"
  biome-morning: "#5F6E4A"
  biome-afternoon: "#6E6045"
  biome-evening: "#4A4E6E"
  inert: "#4A4A4A"
typography:
  display:
    fontFamily: "Pixelify Sans, Courier New, monospace"
    fontSize: "40px"
    fontWeight: 700
    lineHeight: "48px"
    letterSpacing: "0"
  title:
    fontFamily: "Pixelify Sans, Courier New, monospace"
    fontSize: "40px"
    fontWeight: 500
    lineHeight: "48px"
    letterSpacing: "0"
  headline:
    fontFamily: "Pixelify Sans, Courier New, monospace"
    fontSize: "20px"
    fontWeight: 700
    lineHeight: "28px"
    letterSpacing: "0"
  label:
    fontFamily: "Pixelify Sans, Courier New, monospace"
    fontSize: "20px"
    fontWeight: 500
    lineHeight: "28px"
    letterSpacing: "0"
  body:
    fontFamily: "Pixelify Sans, Courier New, monospace"
    fontSize: "20px"
    fontWeight: 400
    lineHeight: "28px"
    letterSpacing: "0"
rounded:
  none: "0px"
spacing:
  bevel: "3px"
  xs: "4px"
  sm: "8px"
  md: "12px"
  pad: "16px"
  lg: "20px"
  xl: "24px"
  xxl: "32px"
  tap: "52px"
  tile: "64px"
  slot: "76px"
components:
  button-stone:
    backgroundColor: "{colors.stone-dk}"
    textColor: "{colors.text}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "12px 20px"
    height: "{spacing.tap}"
  button-stone-hover:
    backgroundColor: "{colors.stone-mid}"
    textColor: "{colors.text}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "12px 20px"
    height: "{spacing.tap}"
  button-stone-active:
    backgroundColor: "{colors.stone-dk}"
    textColor: "{colors.text}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "12px 20px"
    height: "{spacing.tap}"
  button-stone-disabled:
    backgroundColor: "{colors.inert}"
    textColor: "{colors.text-disabled}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "12px 20px"
    height: "{spacing.tap}"
  button-gold:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.text-ink}"
    typography: "{typography.headline}"
    rounded: "{rounded.none}"
    padding: "12px 20px"
    height: "{spacing.tap}"
  button-gold-hover:
    backgroundColor: "{colors.gold-lt}"
    textColor: "{colors.text-ink}"
    typography: "{typography.headline}"
    rounded: "{rounded.none}"
    padding: "12px 20px"
    height: "{spacing.tap}"
  button-grass:
    backgroundColor: "{colors.grass-lit}"
    textColor: "{colors.text-ink}"
    typography: "{typography.headline}"
    rounded: "{rounded.none}"
    padding: "12px 20px"
    height: "{spacing.tap}"
  button-grass-hover:
    backgroundColor: "{colors.grass-lit-hi}"
    textColor: "{colors.text-ink}"
    typography: "{typography.headline}"
    rounded: "{rounded.none}"
    padding: "12px 20px"
    height: "{spacing.tap}"
  hotbar:
    backgroundColor: "{colors.deepslate-dk}"
    rounded: "{rounded.none}"
    padding: "{spacing.xs}"
  slot:
    backgroundColor: "{colors.stone-dk}"
    textColor: "{colors.text}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "{spacing.xs}"
    size: "{spacing.slot}"
  slot-held:
    backgroundColor: "{colors.stone-dk}"
    textColor: "{colors.text}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "{spacing.xs}"
    size: "{spacing.slot}"
  slot-empty:
    backgroundColor: "{colors.inert}"
    rounded: "{rounded.none}"
    padding: "{spacing.xs}"
    size: "{spacing.slot}"
  slot-morning:
    backgroundColor: "{colors.biome-morning}"
    textColor: "{colors.text}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "{spacing.xs}"
    size: "{spacing.slot}"
  slot-afternoon:
    backgroundColor: "{colors.biome-afternoon}"
    textColor: "{colors.text}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "{spacing.xs}"
    size: "{spacing.slot}"
  slot-evening:
    backgroundColor: "{colors.biome-evening}"
    textColor: "{colors.text}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "{spacing.xs}"
    size: "{spacing.slot}"
  held-block:
    backgroundColor: "{colors.deepslate}"
    textColor: "{colors.text}"
    typography: "{typography.display}"
    rounded: "{rounded.none}"
    padding: "{spacing.xxl}"
    width: "760px"
  held-block-cap:
    backgroundColor: "{colors.grass}"
    rounded: "{rounded.none}"
    height: "{spacing.xl}"
  held-block-well:
    backgroundColor: "{colors.deepslate-dk}"
    rounded: "{rounded.none}"
    size: "128px"
  hollow:
    backgroundColor: "{colors.deepslate}"
    textColor: "{colors.text-dim}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "40px 24px"
  xp-track:
    backgroundColor: "{colors.deepslate-dk}"
    rounded: "{rounded.none}"
    height: "{spacing.lg}"
    width: "760px"
  xp-fill:
    backgroundColor: "{colors.xp}"
    rounded: "{rounded.none}"
  xp-buffer:
    backgroundColor: "{colors.gold}"
    rounded: "{rounded.none}"
  input-time:
    backgroundColor: "{colors.deepslate-dk}"
    textColor: "{colors.text}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "4px 8px"
  chest-panel:
    backgroundColor: "{colors.stone-dk}"
    textColor: "{colors.text}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "{spacing.xl}"
    width: "720px"
  chest-item:
    backgroundColor: "{colors.deepslate}"
    textColor: "{colors.text}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "{spacing.md}"
    height: "{spacing.slot}"
  chest-item-hover:
    backgroundColor: "{colors.deepslate-lt}"
    textColor: "{colors.text}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "{spacing.md}"
    height: "{spacing.slot}"
  toast:
    backgroundColor: "{colors.deepslate}"
    textColor: "{colors.text}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "12px 16px"
  overrun-banner:
    backgroundColor: "{colors.redstone}"
    textColor: "{colors.text}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "12px 16px"
---

# Design System: Daily Intentionality Scheduler

## Overview

**Creative North Star: "The Hotbar Day"**

The day is a world you are standing in, not a document you are filling out. A dirt field tiles edge to edge at 64px and never stops at a card boundary. Nine numbered slots sit along the bottom like an inventory hotbar; one block is held, raised out of the row by a white pixel frame, and shown large in the middle of the screen at the scale it has in life. The green-and-gold bar under it reads the 15-minute buffer as experience, not as a form field.

Every surface in this world is cut, not floated. Panels are stone or deepslate, and each one is held by a 3px hard inset bevel — light on the top-left, dark on the bottom-right — which is how a voxel block catches light. There is no radius, no blur, no gradient, no drop shadow under anything. Depth comes from the bevel direction and from stacking a darker well inside a lighter panel. Pressing a control inverts its bevel and drops it 2px, so the button physically goes in.

Pixelify Sans is the only face, set at exactly two sizes. Hierarchy is carried by weight, colour, and position instead of a type ramp — the date and the held block's name are the same 40px as its clock, and they separate because one is 700 white and the other is 500 gold. Every painted surface is an authored 16×16 tile scaled up with `image-rendering: pixelated`, never a photograph or a generated texture. The cream-and-glass dashboard and the printed period timetable are both rejected; this world refuses both outright.

**Key Characteristics:**
- Dirt field (`#513723`) tiled at 64px over a `#241A10` deep ground, edge to edge behind everything
- Every box is a 3px hard inset bevel, light top-left and dark bottom-right; zero radius everywhere
- Pixelify Sans only, at 40px and 20px (32px and 16px below 620px); hierarchy by weight and colour
- Nine hotbar slots, tinted by the biome derived from each block's computed start time
- Green `#7EDB2E` progress and gold `#C4A44A` buffer in one XP-style bar
- Authored 16×16 pixel tiles and 16×16 pixel item icons; no photography, no glyph icon font

## Colors

Earth under stone: a warm dirt ground carries cool grey chrome, and the only bright values in the world are the three materials that mean something — grass for commit, gold for the buffer and the grow, redstone for a day that has run past midnight.

### Primary
- **Dirt Field** (`ground`): The page itself. The body background colour under the tiled `dirt.svg`, the PWA `theme-color`, and the manifest background. It is the one surface that is never contained.
- **Deep Ground** (`ground-deep`): The `html` backing behind the field, the scrollbar track's neighbour value, and the hard pixel text-shadow behind the daystamp and tally.
- **Dirt Speckle / Dirt Speckle Light** (`ground-speckle`, `ground-speckle-lt`): The two speckle values authored into the dirt tile, plus the tile's own light seam. They are what make the field read as stacked blocks rather than wallpaper.

### Secondary
- **Grass** and **Grass Deep** (`grass`, `grass-dk`): The held block's grass cap and the `grass-top.svg` tile. These surfaces carry no text.
- **Lit Grass**, **Lit Grass Highlight**, **Lit Grass Speckle**, **Lit Grass Bevel** (`grass-lit`, `grass-lit-hi`, `grass-lit-speckle`, `grass-lit-bevel`): The Save & Quit button's `grass-side.svg` tile and its bevel. This set exists only because that button carries dark ink text. See The Two Grasses Rule.
- **Gold**, **Gold Light**, **Gold Deep** (`gold`, `gold-lt`, `gold-dk`): The `+15 min` button and its tile, the buffer segment of the XP bar, the held block's clock range, the caret, the selection highlight, and the focus ring (`gold-lt`).
- **Experience Green** / **Experience Light** (`xp`, `xp-lt`): The filled portion of the buffer bar. Reserved for that bar; it is not a general success colour.

### Tertiary
- **Redstone**, **Redstone Light**, **Redstone Deep** (`redstone`, `redstone-lt`, `redstone-dk`): The past-midnight overrun banner and its bevel. The only alarm material in the world, and it appears at most once per day.
- **Morning / Afternoon / Evening Biome** (`biome-morning`, `biome-afternoon`, `biome-evening`): Slot background tints. Each is a muted wash, never a saturated badge; the tint is derived from the block's computed start time (before noon, before 5pm, after) and can never contradict the clock printed in the slot.

### Neutral
- **Stone family** (`stone`, `stone-lt`, `stone-mid`, `stone-dk`, `stone-bevel-dk`): The world's neutral chrome. Stone is every ordinary button, the slot body, the inventory chest panel, and the scrollbar thumb. `stone-lt` is its bevel light, `stone-bevel-dk` its bevel dark, `stone-mid` its hover.
- **Deepslate family** (`deepslate`, `deepslate-lt`, `deepslate-dk`): The darker panel material — the held block's face, the toast, the anchor bar, and inventory item cards.
- **Well Dark** (`well-dk`): The bevel-light value for recessed wells. Any container that should read as cut *into* a panel (the hotbar tray, the XP track, the item well, the time input, the chest grid) uses `well-dk` top-left and `deepslate-lt` bottom-right — the bevel inverted.
- **Inert** (`inert`): Empty slots and disabled buttons. It is flat, untiled, and unbevelled on purpose: nothing is there.
- **Paper**, **Paper Dim**, **Paper Disabled** (`text`, `text-dim`, `text-disabled`): Warm off-white type on dark materials, with the dim value for metadata and the disabled value for unarmed controls.
- **Ink** (`text-ink`): Near-black type, used only on gold and lit-grass surfaces.

### Named Rules
**The Two Grasses Rule.** There are two grass sets and the split is load-bearing. The *lit* set (`grass-lit` ground, `grass-lit-hi` highlight, `grass-lit-speckle` speckle) belongs to Save & Quit, because that button carries ink text and every pixel of its tile — highlight pixels included — has to clear 4.5:1 against `text-ink`. The *darker* set (`grass`, `grass-dk`) belongs to the held block's grass cap and any grass surface that carries no text. Do not "correct" the button's grass back down to `grass`; that lowers contrast under live text. Do not raise the cap to the lit set; it has no text to justify the brightness.

**The Field Value Rule.** The field ships at `#513723`, two values lighter than the `#3A2A1A` originally named in the direction contract. At 64px tile scale the darker value swallowed the tile speckles and the block seams, and the seams are what make the ground read as stacked blocks. `#513723` is also the value carried by `theme-color` and the manifest. Keep the three in sync.

**The Stone Is Neutral Rule.** Stone is the chrome of every ordinary action. Colour is reserved for meaning: gold grows the day, grass commits it to Calendar, redstone warns that it has run past midnight. A second coloured button on the same screen dilutes all three.

## Typography

**Display Font:** Pixelify Sans (self-hosted in `./fonts`, weights 400 / 500 / 700, `Courier New` and `monospace` as fallback)
**Body Font:** Pixelify Sans (same stack)
**Label/Mono Font:** Pixelify Sans with `font-variant-numeric: tabular-nums` on every clock, counter, and duration

**Character:** One chunky pixel face at two sizes, nothing else. It is legible at the small size and blocky enough at the large size to belong to the tiles beside it. Dark-on-light text is set without a shadow; light-on-dark headings carry a hard 2–3px offset pixel shadow in `ground-deep` or `deepslate-dk` — never a blur, and never an offset larger than 3px.

### Hierarchy
- **Display** (700, 40px / 48px): The daystamp, the held block's name, the "Nothing in hand" title, the inventory chest title. The loudest thing on the screen is the block you are holding.
- **Title** (500, 40px / 48px, tabular): The held block's clock range, in gold. Same size as the block name; it separates by weight and colour, not scale.
- **Headline** (700, 20px / 28px): The two committing buttons — `+15 min` and Save & Quit — both set in ink on a bright tile.
- **Label** (500, 20px / 28px): Stone button labels, inventory item names, the bolded value inside the XP bar's caption.
- **Body** (400, 20px / 28px): Everything else — the tally, block metadata, slot clocks and numbers, hints, toast copy, the overrun banner. The hollow state's note caps at 44ch.

### Named Rules
**The One Face, Two Sizes Rule.** Pixelify Sans is the only face in the world, at exactly two sizes: 40px and 20px, dropping to 32px and 16px below 620px. Do not add a third size, a second family, or a system display face to solve a hierarchy problem.

**The Weight-Carries-Rank Rule.** Rank is carried by weight (400 / 500 / 700), colour (`text` / `text-dim` / `gold-lt`), and position — never by a new type step. If two things at the same size need to separate, change the weight or the colour.

**The Tabular Clock Rule.** Every clock, counter, and duration sets `font-variant-numeric: tabular-nums`, so a slot's time does not jitter when the day ripples.

## Layout

The world is one full-height grid — head, field, hotbar — capped at 1280px and centred, with `--pad` (16px, 12px below 620px) of gutter plus `env(safe-area-inset-*)` on all four sides, because this ships as a standalone iPad PWA.

The head is a wrapping flex row: daystamp left, and right a rail stacking the "Day starts" anchor bar over the day's tally. The field is a centred column holding the held block, the optional overrun banner, and the XP bar, each capped at 760px. The footer is a three-column grid — Inventory, hotbar, Save & Quit — with the hotbar dead centre; the save label is allowed to wrap rather than pull the hotbar off its own centre line.

The held block is a two-column face: a fixed 128px item well beside a title / clock / meta stack, with the action row spanning both, 32px of padding and a 24px column gap. The hotbar is nine 76px squares with a 4px gap inside a 4px tray.

**Spacing rhythm.** 4 / 8 / 12 / 16 / 20 / 24 / 32, with 3px reserved for the bevel and 64px for the tile.

**Responsive.** At 900px the footer restacks to hotbar over a two-up Inventory / Save row, both stretched, and the hotbar slots become fluid. At 620px the type drops to 16 / 32, the held block's item well shrinks to 64px, and the hotbar becomes a centred wrap of five-per-row slots so the short last row stays centred rather than ragged. Slot clocks are the only thing allowed to be dropped; the nine slots always survive.

### Named Rules
**The Nine Slots Rule.** The hotbar is always nine slots, filled or empty, at every width. It may wrap and its slots may shrink, but it is never truncated, scrolled, or paged.

**The Field Has No Edge Rule.** The dirt field runs to the viewport edge behind every panel. Do not put the world inside a card, a max-width sheet with visible margins, or a two-panel split.

## Elevation & Depth

Nothing floats. There is no ambient shadow, no blur, and no gradient anywhere in the system. Depth is carried entirely by a 3px hard inset bevel: a light value inset from the top-left and a dark value inset from the bottom-right, which is how a lit voxel face reads. Panels that sit *on* the world use light-top-left; wells cut *into* a panel invert it, using `well-dk` top-left and `deepslate-lt` bottom-right. Pressing a button swaps its two bevel values and translates it down 2px.

The one exception to "no shadow" is type: light-on-dark headings carry a hard, zero-blur 2–3px offset pixel shadow, which is the source world's own text treatment and the only reason the daystamp survives on the tiled field.

### Shadow Vocabulary
- **Raised panel** (`box-shadow: inset 3px 3px 0 <light>, inset -3px -3px 0 <dark>`): Any surface that sits on top of the world — stone buttons, deepslate cards, the chest, the toast.
- **Cut well** (`box-shadow: inset 3px 3px 0 var(--well-dk), inset -3px -3px 0 var(--deepslate-lt)`): Any container that should read as recessed — the hotbar tray, the XP track, the item well, the time field, the chest grid.
- **Pressed** (the raised pair reversed, plus `transform: translateY(2px)`): The `:active` state of every button.
- **Held slot** (`outline: 3px solid var(--text)` plus `translateY(-6px)`): The selected hotbar slot, framed in white and lifted out of the row. It is an outline, not a glow.
- **Pixel text shadow** (`text-shadow: 2px 2px 0` / `3px 3px 0`, zero blur): Light type on the field or on a dark tile.

### Named Rules
**The Three-Pixel Bevel Rule.** Every box in this world is a 3px hard inset bevel, light top-left and dark bottom-right. Not 1px, not 4px, not a border. If a surface needs to read as recessed, invert the pair rather than changing the width.

**The No Blur Rule.** No `box-shadow` with a blur radius, no `filter: blur`, no `backdrop-filter`, no gradient, no glass. A surface is either a flat colour, an authored tile, or a bevel over one of those.

## Shapes

Everything is a rectangle with zero radius, at every scale, including the focus ring and the held-slot frame. The recurring silhouette is the block: a square well holding a pixel item, a bevelled panel, a row of nine squares. The held block adds the one silhouette that isn't a plain rectangle — a 24px grass cap tiled across its top edge, which is what makes a deepslate panel read as a dirt block seen from the side.

Painted surfaces are authored 16×16 tiles (`dirt`, `stone`, `grass-top`, `grass-side`, `gold`) scaled to 64px (96px for the chest panel, 64×24 for the grass cap) with `image-rendering: pixelated` so the pixel grid stays hard. Item icons are authored 16×16 pixel-rect art rendered inline as SVG with `shape-rendering: crispEdges`, drawn at 88px in hand, 48px in the inventory, and 36px in a slot.

### Named Rules
**The Zero Radius Rule.** `border-radius` is `0` everywhere, with no exceptions for avatars, pills, or focus rings. A rounded corner does not exist in a voxel world.

**The Authored Tile Rule.** Every texture in this system is a hand-authored 16×16 SVG committed to `assets/`, scaled with `image-rendering: pixelated`. No photography, no CSS gradient standing in for a material, no generated or stock texture.

## Components

Everything is cut from a material: stone for ordinary actions, deepslate for panels that carry reading, gold and grass for the two moves that change the day.

### Buttons
- **Shape:** Square (0 radius), minimum height 52px, 12px / 20px padding. All three variants share the 3px bevel and invert it on `:active` with a 2px drop.
- **Stone (default):** `stone.svg` over `stone-dk`, paper text with a 2px pixel shadow, `stone-lt` / `stone-bevel-dk` bevel. Hover lightens the base to `stone-mid`. This is Inventory, Drop block, Back to the day, and Undo.
- **Gold (+15 min):** `gold.svg` over `gold`, ink text at 700, `gold-lt` / `gold-dk` bevel, no text shadow. Hover lightens to `gold-lt`.
- **Grass (Save & Quit):** `grass-side.svg` (the lit set) over `grass-lit`, ink text at 700, `grass-lit-bevel` / `grass` bevel, no text shadow. Hover lightens to `grass-lit-hi`. One per screen; it is the only irreversible commit.
- **Disabled:** Tile removed, flat `inert` fill, `text-disabled` type, a muted bevel, and no text shadow. A disabled button loses its material, which is the clearest possible signal that it is not a surface you can act on.
- **Focus:** `outline: 3px solid var(--gold-lt)` at 2px offset, globally. Gold rather than white, because white already belongs to the held slot's frame.

### Cards / Containers
- **Corner Style:** Square (0).
- **Background:** Deepslate for panels that carry reading (held block, toast, item cards, anchor bar); stone tile for the inventory chest.
- **Shadow Strategy:** Raised-panel bevel only; see Elevation & Depth.
- **Internal Padding:** Held block 32px (16px below 620px), chest 24px, toast and overrun 12px / 16px, hollow 40px / 24px.

### Inputs / Fields
- **Style:** The time field is a cut well — `deepslate-dk` fill with the inverted bevel, paper text at body size, 4px / 8px padding — sitting inside the deepslate anchor bar, with its "Day starts" label in `text-dim` beside it.
- **Focus:** The global gold focus ring; the caret is `gold-lt`.

### Navigation
There is no nav bar. Movement through the day *is* the hotbar: slots 1–9 are the navigation, `1`–`9` select, `E` opens the inventory chest, `Esc` closes it. The keyboard hint line is hidden on coarse-pointer devices, where there is no keyboard to name.

### Hotbar slot (signature)
A square button in a recessed tray. Body is `stone-dk` with a stone bevel; a filled slot's background is replaced by its biome tint (`biome-morning`, `biome-afternoon`, `biome-evening`), derived from the computed start time. Contents stack centred: the slot index top-left in `text-dim`, a 36px pixel item icon, and the start clock in tabular body type. Empty slots are flat `inert`, non-interactive, and carry no number. The held slot brightens its bevel, takes a 3px white outline, and lifts 6px out of the row.

### The block in hand (signature)
A deepslate panel with a 24px `grass-top` cap across its top edge, capped at 760px. Inside: a 128px cut well holding the item at 88px, then the block's name at display size, its clock range at title size in gold, and its duration / biome / slot position in dim body type. The actions sit below, spanning the full face. When a different slot is selected the whole panel plays a single 90ms `steps(3)` step-up — a one-frame swap with no easing, never a fade or a slide.

### The buffer bar (signature)
An XP bar, not a progress meter: a 20px cut well, 760px wide, with an experience-green fill for the day elapsed through the held block and a gold segment butted directly against it for the 15-minute buffer that follows. Both animate with `transform: scaleX` over 240ms in `steps(8)`, so the bar fills in visible pixel jumps rather than sliding. The caption below names the buffer in words.

### Motion
One authored moment, and everything steps. The held swap is 90ms `steps(3)`; the ripple travels down the hotbar as a per-slot 180ms `steps(3)` drop staggered 30ms apart, starting at the block you grew rather than at the left edge; the chest opens with a 120ms `steps(3)` rise. There is no easing curve anywhere — `steps()` is the world's only timing function. `prefers-reduced-motion: reduce` disables all three animations, the XP transitions, and the button press drop.

## Do's and Don'ts

### Do:
- **Do** run the dirt field (`#513723`, tiled at 64px) edge to edge behind everything, and keep `theme-color` and the manifest on the same value.
- **Do** give every box a 3px hard inset bevel — light top-left, dark bottom-right — and invert the pair for anything that should read as cut into a panel.
- **Do** keep Pixelify Sans as the only face at exactly two sizes (40 / 20, and 32 / 16 below 620px), separating rank by weight, colour, and position.
- **Do** use the lit grass set (`#6EA646` / `#7FB855` / `#639440`) on any grass surface that carries ink text, and the darker `grass` / `grass-dk` on grass that carries none.
- **Do** set every clock, duration, and counter in tabular numerals.
- **Do** keep all nine hotbar slots visible at every width, and derive a slot's biome tint from its computed start time rather than asking for it.
- **Do** author new textures as 16×16 SVG tiles in `assets/` and scale them with `image-rendering: pixelated`.
- **Do** time motion with `steps()` and keep it under 240ms.

### Don't:
- **Don't** round a corner, blur a shadow, add a gradient, or introduce glass anywhere in this world.
- **Don't** darken the field back toward `#3A2A1A`; at 64px that value swallows the tile speckles and the block seams.
- **Don't** lower Save & Quit's grass to `#5A8C3A` or raise the held block's grass cap to the lit set; the two grasses exist for contrast reasons, not by accident.
- **Don't** add a third type size, a second family, or a system display face.
- **Don't** put a second gold or grass button on a screen; stone is the neutral and colour is reserved for grow, commit, and overrun.
- **Don't** replace the pixel item art with an icon font, a glyph, or an emoji.
- **Don't** put the world inside a card, a two-panel split, or a bordered sheet.
- **Don't** ease an animation; if it does not step, it does not belong here.
