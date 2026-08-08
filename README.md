# LEXA:RIFT

An original browser-based 3D educational arcade game. Recover three language cores through combat missions covering gerunds and infinitives, phrasal verbs, and reported speech.

## Run

Serve this folder over HTTP (ES modules do not run reliably from `file://`). In VS Code, use **Live Server** and open `index.html`. The project is also compatible with GitHub Pages.

Three.js and the interface font are loaded from public CDNs, so the first launch requires an internet connection.

## Controls

- WASD — move
- Mouse — aim
- Left click — shoot / acquire pointer lock
- Space — jump
- Shift — dash
- Q — Grammar Scan
- Esc — pause

Progress, hero selection, sound state, statistics, recovered cores, and loot are stored in `localStorage` under `lexaRift`.
