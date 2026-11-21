# notapplicablegames.com

Static studio site for Not Applicable Games. Plain HTML and CSS, no build step:

- `index.html` - front page for Procession Engine
- `press.html` - press kit (fact sheet, description, screenshot and art downloads)
- `privacy.html` - privacy statement for the games (linked from the game's settings)
- `404.html` - not-found page (served by GitHub Pages for any missing path)
- `discord/` - short redirect to the Discord invite
- `style.css`, `site.js`, `assets/` - styles, the menu toggle and screenshot viewer, images
- `assets/home/` - the home page's gate scene as stacked layers, each in AVIF and WebP
  at two sizes with a PNG or JPEG fallback; `style.css` places them on a 2560 x 1080 stage

`site.js` is optional: without it the menu shows as a wrapped row and every
image link opens the full-resolution file.

Preview locally: `python3 -m http.server 8741` in this directory.

## Deploying

GitHub Pages serves this repository at notapplicablegames.com (see `CNAME`).
Pushing to `main` publishes.
