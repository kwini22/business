# Mirinae Beauty — Korean cosmetics website

The Mirinae shop as a real, search-engine-friendly website. Every page has its own URL and is pre-rendered to static HTML, so Google can index each brand and product:

| Page | Uzbek URL | Russian URL |
|---|---|---|
| Home | `/` | `/ru/` |
| All brands | `/brendlar/` | `/ru/brendlar/` |
| Brand (67) | `/brend/anua/` | `/ru/brend/anua/` |
| Product (162) | `/mahsulot/anua-heartleaf-toner/` | `/ru/mahsulot/…` |
| Sections | `/dorixona/`, `/vitaminlar/`, `/daiso/`, `/hammasi/` | `/ru/…` |

That's 468 indexable pages. Each one has a unique title and description, a canonical URL, `hreflang` uz/ru links, Open Graph tags and schema.org structured data (Product with price in UZS, BreadcrumbList, OnlineStore and FAQ). The build also generates `sitemap.xml`, `robots.txt`, icons and a social-sharing image.

## Project layout

```
src/index.html        page shell (header, footer, cart)
src/assets/app.js     shop logic: routing, pages, cart, SEO tags
src/assets/data.js    brands, products, prices  ← edit products here
src/assets/style.css  design
src/img/              product photos (file name = "photos" key in data.js)
site.config.json      site address + Google verification code
build.mjs             pre-renders every page into dist/
```

Shop settings (Telegram, Instagram, phone, delivery prices) are in the `SHOP` object at the top of the shop logic in `src/assets/app.js`.

## Build locally

```bash
npm install
npx playwright install chromium
npm run build       # -> dist/
```

## Going live and getting onto Google

1. **Turn on hosting:** on GitHub open *Settings → Pages*. Under **Source**, choose **GitHub Actions**. Each push to `main` then publishes the site to `https://kwini22.github.io/business/`. The repository must be public on a free GitHub plan.
2. **Optional custom domain (recommended), for example `mirinae.uz`:**
   - Set `siteUrl` in `site.config.json` to `https://mirinae.uz`, or add a repository variable `SITE_URL`.
   - Add the domain in *Settings → Pages → Custom domain*.
   - Point the domain's DNS to GitHub Pages.
3. **Google Search Console:** go to <https://search.google.com/search-console> and add the site as a *URL prefix* property.
   - Choose the **HTML tag** method and copy the `content="…"` code into `googleSiteVerification` in `site.config.json`, or into a repository variable `GOOGLE_SITE_VERIFICATION`. Push, wait for the deploy to finish, then click **Verify**.
   - Go to **Sitemaps** and submit `sitemap.xml`.
   - Optional: use **URL inspection → Request indexing** on the home page.
4. Indexing usually takes from a few days to a couple of weeks. To speed it up, add the website link to the Telegram channel and the Instagram bio.
