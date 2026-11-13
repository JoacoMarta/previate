# Fondo Blanco

Juegos de previa de Uruguay y Argentina para jugar con un solo celular. Es una web app instalable (PWA): funciona sin internet una vez instalada, en iPhone y Android.

## Correr en la compu

```bash
npm install
npm run dev
```

Se abre en http://localhost:5173. Desde el celular, conectado al mismo Wi‑Fi, entrá a `http://<IP de la compu>:5173` (la IP la da `npm run dev` en la línea "Network").

Para instalarla y usarla sin internet hace falta publicarla con HTTPS (por ejemplo, GitHub Pages o Netlify) con `npm run build`, que genera la carpeta `dist/`.

## Dónde está cada cosa

- `src/games/registry.ts`: la lista de juegos, sus reglas y en qué grupo (palo) van.
- `src/content/`: frases, preguntas, palabras y reglas de las cartas de cada juego.
- `src/games/`: la lógica de cada juego jugable.
- `src/screens/`: inicio, jugadores, ficha del juego, editor y ajustes.

Lo que se agrega o cambia desde la app (frases, palabras, reglas de las cartas) se guarda en el celular, no en el código.

Tokens en el contenido: `{a}` `{b}` `{c}` son jugadores al azar; `{1}`…`{9}` son cantidades en la unidad elegida en Ajustes ("2 tragos", "2 shots").
