# 🚀 Deployment Guide - Vercel + Railway

This guide walks you through deploying the AI Whale Service to production using:
- **Vercel** for Next.js frontends (demo & customer dashboards)
- **Railway** for FastAPI backend + PostgreSQL + Redis

## 📋 Prerequisites

1. **GitHub Account** - https://github.com
2. **Vercel Account** - https://vercel.com (sign up with GitHub)
3. **Railway Account** - https://railway.app (sign up with GitHub)
4. **Git Installed** - Already on your machine

## 🎯 Quick Deploy (30 minutes)

### Part 1: Push to GitHub (5 minutes)

```bash
cd /home/rhiper/Documents/Model.1

# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit - AI Whale Service with mobile optimization"

# Create repository on GitHub (via browser or CLI)
# Then connect and push:
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ai-whale-service.git
git push -u origin main
```

### Part 2: Deploy Backend to Railway (10 minutes)

#### 1. Create Railway Project

1. Go to https://railway.app
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your `ai-whale-service` repository
5. Railway will auto-detect Python/FastAPI

#### 2. Add PostgreSQL Database

1. In your Railway project, click **"+ New"**
2. Select **"Database"** → **"PostgreSQL"**
3. Railway will automatically:
   - Create the database
   - Set `DATABASE_URL` environment variable
   - Connect it to your app

#### 3. Add Redis

1. Click **"+ New"** again
2. Select **"Database"** → **"Redis"**
3. Railway will automatically set `REDIS_URL`

#### 4. Configure Environment Variables

In the Railway backend service settings, add these variables:

```bash
# Required
MASTER_API_KEY=your-secure-random-key-here
SECRET_KEY=another-secure-random-key-here

# Already set by Railway
DATABASE_URL=postgresql://...  (auto-set)
REDIS_URL=redis://... (auto-set)

# CORS - Add your Vercel URLs after deployment
CORS_ORIGINS=https://your-demo.vercel.app,https://your-customer.vercel.app

# Optional
LOG_LEVEL=INFO
ENVIRONMENT=production
```

**Generate secure keys:**
```bash
# On your machine
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

#### 5. Deploy

1. Railway will auto-deploy after detecting changes
2. Get your deployment URL: `https://your-backend.up.railway.app`
3. Test it: `curl https://your-backend.up.railway.app/v1/health`

#### 6. Enable Workers (Optional but Recommended)

For background tasks (data refresh, model retraining):

1. In Railway, click **"+ New"** → **"Empty Service"**
2. Name it "celery-worker"
3. Connect to same GitHub repo
4. Set custom start command: `celery -A app.workers.celery_app worker --loglevel=info`
5. Add same environment variables (copy from main service)

Repeat for Celery Beat scheduler:
- Name: "celery-beat"
- Start command: `celery -A app.workers.celery_app beat --loglevel=info`

### Part 3: Deploy Demo Dashboard to Vercel (5 minutes)

#### 1. Create Vercel Project

1. Go to https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Vercel will detect multiple Next.js apps

#### 2. Configure Demo Dashboard

1. **Framework Preset**: Next.js
2. **Root Directory**: `apps/demo-dashboard`
3. **Build Command**: `npm run build` (auto-detected)
4. **Output Directory**: `.next` (auto-detected)
5. **Install Command**: `npm install` (auto-detected)

#### 3. Add Environment Variables

In Vercel project settings → Environment Variables:

```bash
NEXT_PUBLIC_API_URL=https://your-backend.up.railway.app
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=  (optional - get from cloud.walletconnect.com)
```

#### 4. Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes for build
3. Your demo dashboard will be live at: `https://your-project.vercel.app`

#### 5. Configure Custom Domain (Optional)

1. Go to project settings → Domains
2. Add your custom domain (e.g., `demo.yourdomain.com`)
3. Follow DNS instructions
4. SSL certificate is automatic

### Part 4: Deploy Customer Dashboard to Vercel (5 minutes)

Repeat Part 3 with these changes:

1. Create another Vercel project from same GitHub repo
2. **Root Directory**: `apps/customer-dashboard`
3. Same environment variables as demo dashboard
4. Deploy
5. Your customer dashboard will be at: `https://your-customer-project.vercel.app`

### Part 5: Update CORS Origins (2 minutes)

Back in Railway backend settings, update `CORS_ORIGINS`:

```bash
CORS_ORIGINS=https://your-demo.vercel.app,https://your-customer.vercel.app,http://localhost:3000,http://localhost:3001
```

Save and redeploy.

### Part 6: Test Everything (3 minutes)

#### Backend Health Check
```bash
curl https://your-backend.up.railway.app/v1/health
```

Expected:
```json
{"status":"healthy","service":"AI Whale Service","version":"1.0.0"}
```

#### Demo Dashboard
1. Visit `https://your-demo.vercel.app`
2. Navigate to whale tracking page
3. Test whale prediction API call
4. Check mobile version (hamburger menu)
5. Toggle dark mode

#### Customer Dashboard
1. Visit `https://your-customer.vercel.app`
2. Test API playground
3. Generate API key
4. Check mobile responsiveness

## 🔒 Post-Deployment Security Checklist

After deployment, complete these security steps:

### 1. Secure API Keys
```bash
# In Railway, regenerate keys:
MASTER_API_KEY=$(python3 -c "import secrets; print(secrets.token_urlsafe(32))")
SECRET_KEY=$(python3 -c "import secrets; print(secrets.token_urlsafe(32))")
```

### 2. Enable HTTPS Only
Railway and Vercel provide automatic SSL - ensure you're not allowing HTTP:
- Vercel: Automatic HTTPS redirect enabled
- Railway: Check "Force HTTPS" in settings

### 3. Configure Rate Limiting
Add to Railway environment:
```bash
RATE_LIMIT_PER_MINUTE=60
```

### 4. Set Up Monitoring

**Sentry (Error Tracking)**
1. Create account at https://sentry.io
2. Get DSN
3. Add to Railway: `SENTRY_DSN=https://...`
4. Add to Vercel dashboards: `NEXT_PUBLIC_SENTRY_DSN=https://...`

**Vercel Analytics**
1. Enable in Vercel project settings → Analytics
2. Automatic Web Vitals tracking

**Railway Logs**
1. View logs: Railway dashboard → Your service → Deployments
2. Set up log retention

## 📊 Monitoring URLs

After deployment, bookmark these:

- **Demo Dashboard**: https://your-demo.vercel.app
- **Customer Dashboard**: https://your-customer.vercel.app  
- **API Docs**: https://your-backend.up.railway.app/docs
- **Health Check**: https://your-backend.up.railway.app/v1/health
- **Railway Dashboard**: https://railway.app/dashboard
- **Vercel Dashboard**: https://vercel.com/dashboard

## 🔄 Continuous Deployment

Both platforms support automatic deployments:

### Vercel
- **Push to `main`**: Auto-deploys to production
- **Push to other branches**: Creates preview deployment
- **Pull requests**: Automatic preview deployments

### Railway
- **Push to `main`**: Auto-deploys backend
- **Environment variables**: Changed via dashboard (triggers redeploy)
- **Database migrations**: Run manually or via deploy command

## 🐛 Troubleshooting

### Build Failures

**Vercel: "Module not found"**
```bash
# Check package.json is in correct directory
# Ensure all dependencies are listed
cd apps/demo-dashboard
npm install
npm run build  # Test locally
```

**Railway: "Application failed to start"**
- Check Railway logs
- Verify `DATABASE_URL` and `REDIS_URL` are set
- Test locally: `uvicorn app.main:app`

### CORS Errors

If frontend can't connect to backend:

1. Check `CORS_ORIGINS` in Railway includes your Vercel URLs
2. Verify URLs don't have trailing slashes
3. Check browser console for exact error
4. Test API directly: `curl https://your-backend.up.railway.app/v1/health`

### Database Connection Issues

Railway PostgreSQL connection:
1. Check Railway PostgreSQL service is running
2. Verify `DATABASE_URL` format: `postgresql://user:pass@host:port/dbname`
3. Check connection limit (Railway free tier: 100 connections)

### Performance Issues

**Slow API Response:**
- Check Railway metrics for CPU/memory usage
- Upgrade Railway plan if needed
- Add Redis caching for frequent queries

**Slow Frontend:**
- Check Vercel Analytics for performance metrics
- Optimize images (use Next.js Image component)
- Enable Vercel Edge Network (automatic)

## 💰 Cost Estimate

### Free Tier (Hobby Projects)

**Vercel:**
- 2 projects on free tier
- 100GB bandwidth/month
- Unlimited deployments
- Custom domains: ✅

**Railway:**
- $5 free credit/month
- ~500 hours of uptime
- PostgreSQL + Redis included
- Enough for development/small projects

**Total: Free for small projects** 🎉

### Production Tier (Recommended for launch)

**Vercel Pro: $20/month per team**
- Unlimited projects
- 1TB bandwidth
- Analytics included
- Password protection
- Team collaboration

**Railway: ~$10-30/month**
- Pay-as-you-go after free credit
- Scales automatically
- Dedicated database
- 24/7 uptime

**Total: ~$30-50/month for production**

## 🎯 Alternative Deployment Options

### Option 2: Vercel + Supabase
- Frontend: Vercel (same as above)
- Backend: Deploy to Vercel Serverless Functions
- Database: Supabase (PostgreSQL + Redis included)
- Cost: Free tier available

### Option 3: Traditional VPS (DigitalOcean/Linode)
- Full control
- Single $12/month droplet
- Manual setup required
- Use provided `docker-compose.yml`

### Option 4: AWS (Enterprise)
- Frontend: AWS Amplify or S3 + CloudFront
- Backend: ECS or Lambda
- Database: RDS PostgreSQL
- Cost: Variable, $50-200+/month

## 📞 Support

- **Railway Discord**: https://discord.gg/railway
- **Vercel Support**: support@vercel.com
- **Project Issues**: GitHub Issues on your repo

## ✅ Deployment Complete!

Your AI Whale Service is now live! 🎉

Next steps:
1. ⭐ Star your repo on GitHub
2. 🔔 Set up monitoring alerts
3. 📈 Track usage metrics
4. 🚀 Share with users
5. 🐛 Monitor for issues

**Pro tip**: Create a status page at https://status.io or https://uptime.com to track uptime.
