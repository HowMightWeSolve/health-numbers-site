# Health Numbers - A Conceptual Landscape

A reference and toolkit for product teams working on health features. Built with Next.js and React.

## What's in the site

**Measurements:** 56 raw health measurements, 17 categories, and 5 overall score examples with app store links.

**Presentation:** Numbers and narratives (3 representation modes), Time and trends (time windows, reference frames, direction styles), and 12 framing choices with visual mockups.

**Tools:** Decision helper, Same person different lens (AI-powered persona builder), and Coaching topic options (AI-powered, 10 visual approaches).

**Workshop:** Medication adherence case study (3 philosophies x 3 levels = 9 phone mockups), and a Library for saving and comparing generated views.

## Deploy to Vercel

### 1. Create a GitHub repo

1. Go to [github.com/new](https://github.com/new)
2. Name it `health-numbers` (or whatever you like)
3. Keep it public or private, your choice
4. Don't add a README (this project already has one)

### 2. Push this code to GitHub

From your terminal, in this project folder:

```
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/health-numbers.git
git push -u origin main
```

### 3. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign up with your GitHub account
2. Click "Add New Project"
3. Import your `health-numbers` repo
4. Vercel will auto-detect Next.js. Click "Deploy"
5. It will build and give you a URL like `health-numbers-abc123.vercel.app`

### 4. Add your API key

The AI-powered tools (Same person different lens, Coaching topic options) need an Anthropic API key.

1. In your Vercel dashboard, go to your project > Settings > Environment Variables
2. Add a variable:
   - Name: `ANTHROPIC_API_KEY`
   - Value: your API key (starts with `sk-ant-`)
3. Redeploy (Vercel > Deployments > click the three dots on the latest > Redeploy)

### 5. Custom domain (optional)

To use `health.howmightwesolve.org` or similar:

1. In Vercel, go to your project > Settings > Domains
2. Add your custom domain
3. Vercel will give you DNS records to add at your domain registrar (SiteGround)
4. Add a CNAME record pointing your subdomain to `cname.vercel-dns.com`

## Run locally

```
cp .env.example .env
# Edit .env and add your Anthropic API key

npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Notes

- The AI tools use Claude Sonnet via the Anthropic API. Each generation makes 2-3 API calls. Cost is minimal (a few cents per generation).
- Saved cards and shared collections use browser localStorage. They persist in your browser but don't sync across devices. For multi-device or true sharing, a database backend would be needed.
- The site is a single-page React app. All reference content (measurements, categories, approaches) is static and loads instantly. Only the AI tools make network calls.
