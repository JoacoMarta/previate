# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

The owner, for personal use for now, and the friends they play with at previas (the drinks before going out) in Uruguay and Argentina. Groups are often large, 10 or more people. One phone is passed from hand to hand around a table or a living room. It is night, there is music and talk, people are drinking, and whoever holds the phone reads aloud or looks at something in secret before passing it on.

## Product Purpose

Fondo Blanco gathers the previa games played in Uruguay and Argentina in one phone. The app is the deck, the dice, the timer, the scorekeeper and the rulebook. When a game needs real objects (cups, a ball, a coin, a physical deck), the app explains the rules and helps run the game with turns, teams, counters and timers. Success means the group plays without needing anything else and without arguing about the rules.

## Positioning

Local previa games, including ones spread on TikTok in the region (La Puta, piedra, papel o tijera con canción, contar con reglas), with rules each group can rewrite inside the app. The pass-the-phone mechanics (secret words, private hands, hidden dice) are built for exactly one phone. It was renamed from "Previate" to "Fondo Blanco" to stand apart from existing drinking-game apps.

## Operating Context

- One phone, many hands, often 10 or more players. The player list is loaded once per night and its order is the turn order.
- Dim light, noise, distracted and drinking players. Text is read aloud by whoever holds the phone.
- Often poor signal, so it must work offline once installed.
- Installed from Safari (iPhone) or Chrome (Android) to the home screen.

## Capabilities and Constraints

- PWA built with Vite, React and vite-plugin-pwa. It is served from GitHub Pages out of a public repository, and every push to `main` publishes.
- No backend. Players, settings, added or hidden phrases and edited card rules live in each phone's localStorage.
- Picante content is set per game with Suave, Picante and Hot levels that can be mixed.
- Content rule (binding, set by the owner): picante and hot content is only questions to answer or to point at someone. No kisses, no physical contact, no undressing, and no dare that makes one person do something to another. Dares are always individual and harmless.
- The penalty unit is configurable: trago, sorbo or shot.
- Games whose real rules are not confirmed must say so clearly in the main UI (the home list and the game page), and be editable.
- iPhone web apps cannot vibrate. Audio needs a tap first.

## Brand Commitments

- Name: Fondo Blanco.
- Voice: Rioplatense voseo, mixing Uruguayan and Argentine words that both countries understand ("ómnibus o bondi").
- The owner asked to keep: the naipe-style cards, the suit colors (fernet-brown ground with oros, copas, espadas and bastos as colors), and the home screen (big name on top, games grouped by suit).

## Evidence on Hand

- Game content written for the app: `src/content/` (phrases, questions, categories, impostor words, card rules).
- Rules researched from the web, TikTok captions and the owner. No testimonials, user counts or press. Do not invent any.

## Product Principles

1. The phone is the only thing the table needs; anything physical is optional and guided.
2. The rules belong to the group: every phrase and card rule can be changed on the phone.
3. Nobody is made to do anything to someone else.
4. Readable at a glance and passable mid-sentence: one clear action per screen.
5. Honest about uncertain rules: say when a version is a base guess.

## Accessibility & Inclusion

Large type and large touch targets for dim light and impaired coordination. Contrast holds on the dark ground. Players are never addressed by gender.
