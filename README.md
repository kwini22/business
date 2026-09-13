# unlocked

A static site deployed to GitHub Pages, which serves HTTPS automatically.

## Going live with HTTPS

1. Push this branch to `main` (or merge a PR into it).
2. In the repo settings: **Settings → Pages → Build and deployment → Source**, choose **GitHub Actions**. The included workflow (`.github/workflows/deploy.yml`) builds and deploys the site on every push to `main`.
3. Your site will be available at `https://<username>.github.io/unlocked/` — GitHub Pages provisions and renews the TLS certificate for you, no extra setup needed.
4. Once the first deployment finishes, check **Settings → Pages → Enforce HTTPS** is ticked (it's on by default and forces plain `http://` visitors to redirect to `https://`).

### Using a custom domain

If you point a custom domain at this site (via a `CNAME` file + DNS records), GitHub Pages automatically issues and renews a Let's Encrypt certificate for it too — just wait for the "DNS check successful" status in **Settings → Pages** before enabling **Enforce HTTPS**.
