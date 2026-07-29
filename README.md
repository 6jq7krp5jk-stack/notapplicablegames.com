# notapplicablegames.com

Static studio site for Not Applicable Games. Two pages, no build step:

- `index.html` - front page featuring Procession Engine
- `press.html` - press kit (fact sheet, description, downloadable art)
- `style.css`, `assets/` - everything else

Preview locally: `python3 -m http.server 8741` in this directory.

## Deploying

Any static host works. Cheapest paths:

- **Cloudflare Pages** or **GitHub Pages**: point the host at this folder,
  then at the domain registrar set notapplicablegames.com's DNS to the host.
- **processionengine.com**: set up as a redirect at the registrar or host.
  Until the Steam page is public, redirect to https://notapplicablegames.com.
  Once the store page is live, 301 it to
  https://store.steampowered.com/app/4995080

## Post-launch checklist

- Swap the front-page primary CTA to a Steam wishlist button once the store
  page is public.
- Add screenshots + trailer embed to both pages when captured from the
  release build.
- Update the X profile website field from the Discord invite to this site.
