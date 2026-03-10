# 🚀 Quick Reference: Push to GitHub + Deploy

## One-Time Setup (5 minutes)

### 1. Run the GitHub setup script:
```bash
cd /home/rhiper/Documents/Model.1
./PUSH_TO_GITHUB.sh
```

This will:
- Initialize git repository
- Add all files
- Create initial commit
- Set up main branch

### 2. Create GitHub repository:

Go to https://github.com/new and create a new repository named `ai-whale-service`

**Don't** initialize with README, .gitignore, or license (we already have these)

### 3. Connect and push:

```bash
# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/ai-whale-service.git
git push -u origin main
```

## Deploy to Production

### Deploy Backend to Railway (10 min)

1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub repo"
3. Select `ai-whale-service`
4. Add PostgreSQL (click "+ New" → Database → PostgreSQL)
5. Add Redis (click "+ New" → Database → Redis)
6. Add environment variables in backend service:
   ```bash
   MASTER_API_KEY=your-secure-key
   SECRET_KEY=your-secret-key
   CORS_ORIGINS=https://your-vercel-app.vercel.app
   ```
7. Copy your Railway URL: `https://your-backend.up.railway.app`

### Deploy Demo Dashboard to Vercel (5 min)

1. Go to https://vercel.com/new
2. Import `ai-whale-service` from GitHub
3. Configure:
   - Root Directory: `apps/demo-dashboard`
   - Framework: Next.js (auto-detected)
4. Add environment variable:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.up.railway.app
   ```
5. Click "Deploy"

### Deploy Customer Dashboard to Vercel (5 min)

1. Create another Vercel project
2. Same repo, but Root Directory: `apps/customer-dashboard`
3. Add same environment variable
4. Deploy

### Update CORS

Back in Railway, update `CORS_ORIGINS`:
```bash
CORS_ORIGINS=https://demo.vercel.app,https://customer.vercel.app
```

## That's It! 🎉

Your services are now live:
- Demo: `https://your-demo.vercel.app`
- Customer: `https://your-customer.vercel.app`
- API: `https://your-backend.up.railway.app`

## Auto-Deployment

From now on:
- Push to `main` → Auto-deploys everywhere
- Push to other branches → Preview deployments on Vercel

## Need Help?

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.
