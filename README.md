# Token Builder Website

A premium, static marketing website for the Token Builder Figma plugin.

## Local Development

Simply open the `index.html` file in your browser:

```bash
# macOS
open index.html

# Windows
start index.html

# Linux
xdg-open index.html
```

Or use any local server:

```bash
# Python 3
python -m http.server 8000

# Node.js (npx)
npx serve .

# PHP
php -S localhost:8000
```

Then visit `http://localhost:8000` in your browser.

## Deployment

### Netlify

1. Create a new site on [Netlify](https://netlify.com)
2. Drag and drop the `token-builder-website` folder to deploy
3. Or connect your GitHub repo and set the publish directory to `token-builder-website`

### Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the `token-builder-website` directory
3. Follow the prompts to deploy

### GitHub Pages

1. Push the `token-builder-website` folder to your repo
2. Go to Settings > Pages
3. Set source to the branch containing the website
4. Set folder to `/token-builder-website` (or root if you moved files)

### Manual Hosting

Upload the contents of `token-builder-website` to any static hosting provider:
- AWS S3 + CloudFront
- Google Cloud Storage
- DigitalOcean Spaces
- Any web server (nginx, Apache)

## Customization

### Update CTA Links

Search for `href="#"` in `index.html` and replace with your actual Figma Community plugin URL.

### Add Screenshots

Replace the placeholder in the screenshots section with actual plugin screenshots. Add images to an `assets` folder and update the HTML.

### Modify Content

All content is in `index.html`. Edit the text directly to update copy, features, FAQ, or roadmap items.

## Features

- Single HTML file (no build step required)
- Fully responsive (mobile-first approach)
- Dark theme with subtle gradients
- Smooth scroll navigation
- FAQ accordion
- Floating CTA button
- CSS-only animations
- No external dependencies
- System fonts for fast loading
