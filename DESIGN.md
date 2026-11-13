---
name: Fondo Blanco
description: The previa's deck, dice, timer and rulebook on one passed phone.
colors:
  fernet-ground: "#241915"
  fernet-raise: "#30221c"
  table-line: "#4a372d"
  cream-text: "#f6ede3"
  muted-text: "#c4b2a3"
  faint-text: "#a38d7d"
  card-stock: "#fbf6ee"
  card-ink: "#2a1d17"
  card-ink-soft: "#6b5548"
  oros: "#e9b422"
  oros-ink: "#9a6a00"
  copas: "#d9362b"
  espadas: "#3a68c4"
  bastos: "#3e9a5c"
  level-hot: "#b3245e"
  on-suit: "#ffffff"
typography:
  wordmark:
    fontFamily: "Bricolage Grotesque Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(66px, 22vw, 112px)"
    fontWeight: 800
    lineHeight: 0.84
    letterSpacing: "-0.035em"
    fontVariation: "'wdth' 75"
  display-value:
    fontFamily: "Bricolage Grotesque Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(80px, 30vw, 132px)"
    fontWeight: 800
    lineHeight: 0.85
    letterSpacing: "-0.04em"
    fontVariation: "'wdth' 75"
  headline:
    fontFamily: "Bricolage Grotesque Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(40px, 12vw, 56px)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.03em"
    fontVariation: "'wdth' 80"
  prompt:
    fontFamily: "Bricolage Grotesque Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(25px, 7.4vw, 34px)"
    fontWeight: 700
    lineHeight: 1.14
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Bricolage Grotesque Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "22px"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Bricolage Grotesque Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.45
  label:
    fontFamily: "Bricolage Grotesque Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 600
    lineHeight: 1.35
rounded:
  s: "10px"
  m: "16px"
  card: "22px"
  frame: "14px"
  pill: "999px"
spacing:
  gutter: "18px"
  section: "22px"
  tight: "14px"
  inline: "10px"
components:
  button-primary:
    backgroundColor: "{colors.oros}"
    textColor: "{colors.card-ink}"
    typography: "{typography.title}"
    rounded: "{rounded.m}"
    padding: "14px 20px"
    height: "56px"
  button-primary-copas:
    backgroundColor: "{colors.copas}"
    textColor: "{colors.on-suit}"
    rounded: "{rounded.m}"
    height: "56px"
  button-primary-espadas:
    backgroundColor: "{colors.espadas}"
    textColor: "{colors.on-suit}"
    rounded: "{rounded.m}"
    height: "56px"
  button-primary-bastos:
    backgroundColor: "{colors.bastos}"
    textColor: "{colors.card-ink}"
    rounded: "{rounded.m}"
    height: "56px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.cream-text}"
    rounded: "{rounded.m}"
    padding: "14px 20px"
    height: "56px"
  button-small:
    rounded: "{rounded.s}"
    padding: "10px 16px"
    height: "44px"
  icon-button:
    backgroundColor: "transparent"
    textColor: "{colors.cream-text}"
    rounded: "{rounded.pill}"
    size: "44px"
  chip:
    backgroundColor: "transparent"
    textColor: "{colors.muted-text}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "9px 15px"
    height: "42px"
  chip-selected:
    backgroundColor: "{colors.oros}"
    textColor: "{colors.card-ink}"
    rounded: "{rounded.pill}"
  input:
    backgroundColor: "{colors.fernet-raise}"
    textColor: "{colors.cream-text}"
    rounded: "{rounded.s}"
    padding: "12px 14px"
    height: "48px"
  panel:
    backgroundColor: "{colors.fernet-raise}"
    textColor: "{colors.cream-text}"
    rounded: "{rounded.m}"
    padding: "16px"
  naipe:
    backgroundColor: "{colors.card-stock}"
    textColor: "{colors.card-ink}"
    rounded: "{rounded.card}"
    padding: "58px 30px"
  status-pill:
    backgroundColor: "{colors.fernet-raise}"
    textColor: "{colors.muted-text}"
    rounded: "{rounded.pill}"
    padding: "7px 11px"
---

# Design System: Fondo Blanco

## Overview

**Creative North Star: "The Phone Is the Table's Deck"**

Every game moment is a naipe dealt onto a fernet-brown table. The ground is a dark, warm brown; the thing you read is a cream playing card with a thin suit-colored inner frame and a corner index top-left, mirrored bottom-right. Everything around the card (top bar, status pills, rule panels, the sticky action bar) is quiet brown-on-brown so the card stays the only bright object in the room. The system is built for a dim, loud room and a phone passed mid-sentence: big condensed type, one primary action per screen, large touch targets.

The four Spanish suits are not decoration; they are category roles. Oros is phrases and questions read aloud, espadas is pass-the-phone, copas is cards and dice, bastos is objects and rules. Each game screen re-points the single accent (`--accent`) at its suit, so the primary button, the selected chip, the card frame and the big value all speak in that suit's color. The type is one family, Bricolage Grotesque, pushed to a condensed width (wdth 75 to 80) for names and big values and left at normal width for reading.

The world refuses the party-app default: no neon gradients, no emoji, no confetti, no bubbly cards. Iconography is drawn SVG (Spanish suits, French suits, dice, a small stroke icon set).

**Key Characteristics:**
- Fernet-brown ground, cream card stock, four suit colors as category roles.
- One accent at a time, re-pointed per game to that game's suit.
- Condensed heavy Bricolage Grotesque for names, numbers and the wordmark.
- The naipe: cream card, suit inner frame, mirrored corner indices, dealt in with motion.
- One sticky thumb-zone action bar per screen.
- Single column, phone-width (max 560px), dark color scheme only.

## Colors

A warm, low-light palette: brown ground and raised brown surfaces, cream for text and card stock, and four saturated suit colors that carry meaning.

### Primary
- **Oros Gold** (`oros`): the default accent and the color of the phrases category. Primary buttons, selected chips, focus rings, the text caret, selection, the "rules unconfirmed" flag and its panel tint. Dark card ink sits on it.
- **Oros Ink** (`oros-ink`): a darker gold used wherever oros has to appear on cream card stock (inner frame, corner index, big value, "suave" level). Plain oros on cream is too light to read.

### Secondary
- **Copas Red** (`copas`): cards-and-dice category accent; also the "bad" verdict tint, the impostor's secret word, the boom screen ground, the ace pip on the die, and the "picante" level. White text on it.
- **Espadas Blue** (`espadas`): pass-the-phone category accent and the resting state of the rhythm pulse. White text on it.
- **Bastos Green** (`bastos`): objects-and-rules category accent and the "ok" verdict tint. Dark card ink on it.

### Tertiary
- **Hot Magenta** (`level-hot`): only the "hot" content level marker on cards, alongside oros-ink (suave) and copas (picante).

### Neutral
- **Fernet Ground** (`fernet-ground`): the page background, the action bar fade, and the base for every color-mix tint.
- **Fernet Raise** (`fernet-raise`): raised surfaces: players strip, panels, inputs, status pills, step counters, pressed rows.
- **Table Line** (`table-line`): every 1px border and divider; ghost button and icon button strokes; scrollbar.
- **Cream Text** (`cream-text`): primary text on the ground.
- **Muted Text** (`muted-text`): secondary lines, descriptions, unselected chips, meta lines.
- **Faint Text** (`faint-text`): tertiary info only: chevrons, row numbers, placeholders, hidden phrases, small counts.
- **Card Stock** (`card-stock`): the naipe face, die faces, value buttons, suit buttons, the drawing canvas, the toast, and the card border on deck backs.
- **Card Ink** (`card-ink`) and **Card Ink Soft** (`card-ink-soft`): text on card stock and on light accents (oros, bastos).
- **On-Suit White** (`on-suit`): text on copas and espadas buttons and chips (the `--accent-ink` override).

### Named Rules
**The One Accent Rule.** A screen has one accent, its game's suit, set by re-pointing `--accent` (and `--accent-ink`) on the screen wrapper. Never mix two suit accents as interactive color on one screen.

**The Suit Means Category Rule.** Oros phrases, espadas pass-the-phone, copas cards and dice, bastos objects and rules. A new game takes the color of its category, not the color that looks nice.

**The Ink-on-Cream Rule.** On card stock, oros is always `oros-ink`. Suit colors on the brown ground are for large or heavy type and icons only (copas reads 3.7:1, espadas 3.2:1 on the ground); body-size colored text on the ground uses cream or muted.

## Typography

**Display Font:** Bricolage Grotesque Variable (self-hosted, wdth axis), with ui-sans-serif, system-ui fallback
**Body Font:** the same family at normal width

**Character:** One grotesque doing two jobs: squeezed and heavy (weight 800, wdth 75 to 80, tight negative tracking) it becomes the poster voice of names and numbers; at normal width and 17px it reads easily aloud in a dark room.

### Hierarchy
- **Wordmark** (800, clamp(66px, 22vw, 112px), 0.84, wdth 75): the home screen "Fondo Blanco" only, top-left.
- **Display value** (800, clamp(80px, 30vw, 132px), 0.85, wdth 75): the card value on a naipe, in the suit color. Sibling sizes: countdown-huge (clamp(96px, 34vw, 168px)), boom category (clamp(90px, 30vw, 140px)), whose-turn name on the pass screen (clamp(54px, 17vw, 88px)). All condensed, tabular numerals for counters.
- **Headline** (800, clamp(40px, 12vw, 56px), 0.95, wdth 80): game name on the detail page, big names, secret words (clamp(46px, 14vw, 72px)), totals.
- **Prompt** (700, clamp(25px, 7.4vw, 34px), 1.14, text-wrap: pretty): the instruction on a naipe; drops to clamp(21px, 6vw, 27px) past 110 characters. Questions use 800 at clamp(24px, 7vw, 30px); rule titles 800 at clamp(30px, 9vw, 40px).
- **Title** (700, 18 to 22px, 1.1 to 1.2): suit section heads (22px), game row names (18px), block and panel heads (18px), top bar title (20px), buttons (18px).
- **Body** (400, 17px, 1.45): default reading text; ledes at 18px with 34ch measure; short descriptions at 14.5 to 15px in muted.
- **Label** (600, 13.5 to 15px): chips, field labels, status pills, the naipe's footer kind line (700, 14.5px, suit color), the unconfirmed flag.

### Named Rules
**The Squeeze for Shouting Rule.** Condensed width (wdth 75 to 80) is reserved for weight-800 display type: names, values, counters, the wordmark. Reading text is never condensed.

**The Read-Aloud Floor Rule.** Body text is 17px; nothing a player must read aloud goes below 15px. Sizes under 15px are for secondary metadata only.

## Layout

A single phone-width column (max-width 560px, centered) filling the dynamic viewport height, padded with safe-area insets. Horizontal gutter is 18px everywhere. Pages stack sections with a 22px gap (14px on tight pages); rows and inline groups use 8 to 14px gaps.

Every screen has three bands: a top bar (56px minimum, back or close icon button, title, optional right action), a content area, and a sticky action bar at the bottom in the thumb zone. The action bar sits over a gradient fade from the ground (70%) to transparent and holds one primary button, sometimes beside a ghost button.

On play screens the content area is the table: the naipe centered vertically, capped at 62dvh height with a 5:7.2 aspect ratio, a meta line above it (who drew, what is left), and status pills under the top bar. Pass-the-phone screens replace the card with the next player's name, left-aligned and huge, until that person taps to reveal. Lists (games, players, phrases, scores) are flush rows separated by 1px table-line rules, not cards.

There is no desktop layout: on wide screens the same column centers on the brown ground.

## Elevation & Depth

The ground and its surfaces are flat: raised brown (fernet-raise) plus a 1px table-line border is the only layering for panels, inputs and pills. Real shadows belong to physical objects only, the card and things lying on the table, and they model card stock: a faint inset top highlight, a soft long drop below, and a 2px card-thickness edge.

### Shadow Vocabulary
- **Naipe at rest** (`box-shadow: 0 1px 0 #fff8 inset, 0 18px 40px -18px #000c, 0 2px 0 #00000040`): the dealt card.
- **Naipe in flight** (`box-shadow: 0 1px 0 #fff8 inset, 0 46px 60px -22px #000e, 0 2px 0 #00000040`): the first frame of the deal animation, lifted higher.
- **Deck stack** (`box-shadow: 0 0 0 8px var(--card) inset, 0 2px 0 #00000055, 0 4px 0 -1px #e9e0d2, 0 6px 0 -2px #00000044, 0 8px 0 -3px #d9cfbf, 0 24px 40px -16px #000c`): the face-down deck, its stacked edges drawn as alternating cream and dark slivers.
- **Object drop** (`filter: drop-shadow(0 14px 22px #0008)`): the roulette wheel.
- **Toast** (`box-shadow: 0 10px 30px -10px #000`): the cream confirmation toast.

### Named Rules
**The Only Cards Cast Shadows Rule.** Shadows are for the naipe, the deck, the wheel and the toast. Buttons, panels, chips and inputs are flat.

## Shapes

Gently rounded throughout, in three steps: small (10px) for inputs, small buttons, value buttons and the rules panel; medium (16px) for primary buttons, panels, the players strip and verdicts; card (22px) for the naipe, deck back and drawing canvas. Inside a naipe the suit inner frame sits 10px in with a 14px radius and a 2px stroke. Icon buttons, step counters and the pulse are circles; chips and status pills are full pills (999px). Mini cards in the pyramid and hands use 8px.

Borders are always 1px table-line on the ground. Face-down cards use a 45-degree stripe over the suit color with an inset cream border, so a back always reads as a card back.

## Components

### Buttons
Big, flat, and in the suit's color: one confident slab at the bottom of the screen.
- **Shape:** medium radius (16px), 56px minimum height, full width of the action bar (flex: 1).
- **Primary:** accent background with accent ink, 700 at 18px, 14px 20px padding. On copas and espadas screens the ink is white; on oros and bastos it is card ink.
- **Ghost:** transparent with a 1px table-line border and cream text; the secondary option beside a primary.
- **Small:** 44px high, 10px radius, 16px text, not stretched; used inside panels and forms.
- **Text button:** no box, 600 weight, accent mixed 72% with white, 44px tall hit area.
- **Card-colored answer:** on choice screens (red or black) one button uses card stock with card ink as the "black" option next to the copas primary.
- **Disabled:** 40% opacity. **Focus:** 3px accent outline, 2px offset (global `:focus-visible`).

### Chips
- **Style:** pill, 42px minimum height, 1px table-line border, transparent, 600 at 15px in muted text.
- **State:** selected (`aria-pressed="true"`) fills with the accent and accent ink. Used for level pickers, deck choices and editor tabs (tabs scroll horizontally without a scrollbar).

### Status pills
Non-interactive (or 36px tap-high when a button) pills under the top bar: fernet-raise, 1px line, 14px muted text with the number in cream bold ("Quedan **47**").

### Cards / Containers
- **Corner Style:** medium (16px).
- **Background:** fernet-raise.
- **Shadow Strategy:** none (see Elevation).
- **Border:** 1px table-line.
- **Internal Padding:** 16px (panels, verdicts); 14px 16px (players strip, unconfirmed notice).
- **Verdict variants:** ok and bad tint the panel with bastos or copas at 14% over the ground and a 70% border.
- **Unconfirmed notice:** an oros-bordered (55%) panel tinted 9% oros with a warning icon heading. Its small inline form on home rows is the oros "Reglas sin confirmar" flag with the same icon.

### Inputs / Fields
- **Style:** fernet-raise fill, 1px table-line border, small radius (10px), 12px 14px padding, 48px minimum (textarea 84px), 17px text, faint placeholder, oros caret.
- **Focus:** the global 3px accent outline.
- **Labels:** 600 at 15px above the field, 6px gap.

### Navigation
- **Top bar:** a 44px circular icon button with a 1px line border (back arrow, or close on play screens), then a 20px bold title that ellipsizes, then an optional right-hand icon button (settings on home).
- **Game list:** home groups games under suit section heads (34px drawn suit icon, 22px title, 14px muted description). Each row: 18px bold name, muted short description, optional unconfirmed flag, faint chevron; pressing tints the row fernet-raise.

### The Naipe (signature)
The card is the product. Cream card stock (22px radius, 5:7.2, max 62dvh), a 2px suit-colored inner frame 10px in, a corner index (condensed 800 numeral at 22px over a 22px suit icon) top-left and the same rotated 180 degrees bottom-right, each on a cream patch that breaks the frame. Content is vertically centered: either a prompt, or a big suit-colored value with its card name under it in soft ink, then a rule title and rule text. A footer kind line in the suit color names what kind of card it is. The suit comes from the game, with oros swapped to oros-ink.

**Deal motion:** every new card enters with `deal` (420ms, cubic-bezier(.16,1,.3,1)): from up-left, rotated -7 degrees and slightly scaled, overshooting to 0.6 degrees before settling. Re-keying the card replays it. Disabled under `prefers-reduced-motion`.

### Pass the phone
A full-screen handoff: the next player's name in condensed 800 (clamp(54px, 17vw, 88px)), one muted line ("Pasale el celular a ..."), and a single primary button "Soy [name], mostrar". Secret content only renders after the tap and hides again with "Listo, ocultar".

### Table objects
Dice are drawn SVG on card stock with ink pips (the single pip in copas). Mini cards (46 by 64px, 70 by 98px in a hand) use the striped copas back face-down and card stock face-up, with a 3px oros outline on the current card. The boom screen swaps the whole ground to copas with white-alpha lines. Roulette wheel segments alternate suit colors under a pointer.

## Do's and Don'ts

### Do:
- **Do** set `--accent` (and `--accent-ink`: white on copas and espadas, card ink on oros and bastos) on the screen wrapper from the game's suit.
- **Do** put every game moment on a naipe or a table object, with one primary action in the sticky bottom bar.
- **Do** use condensed weight-800 Bricolage Grotesque (wdth 75 to 80) for names, values and counters, with tabular numerals on anything that ticks.
- **Do** keep touch targets at 44px minimum and primary buttons at 56px.
- **Do** draw suits, dice and icons as inline SVG in `currentColor`.
- **Do** flag unconfirmed rules with the oros warning flag on the home row and the oros notice on the game page.
- **Do** separate lists with 1px table-line rules rather than boxing each row.

### Don't:
- **Don't** use neon gradients, emoji, confetti or bubbly cards; the only gradients are the action bar fade and the striped card backs.
- **Don't** put shadows on buttons, chips, panels or inputs; shadows belong to cards and table objects.
- **Don't** use plain oros on card stock; use oros-ink.
- **Don't** set body-size text in copas or espadas on the brown ground.
- **Don't** introduce a light theme or a second type family.
- **Don't** add small uppercase labels above headings; the naipe's kind line sits at the foot of the card in sentence case.
