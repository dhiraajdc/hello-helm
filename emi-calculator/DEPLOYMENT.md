# Deployment Guide - EMI Foreclosure Calculator

This guide covers multiple deployment options for hosting your EMI Calculator with a live URL.

## Quick Deployment Options

### Option 1: Render (Recommended - Free & Easy)

Render offers free hosting with automatic deployments from GitHub.

**Steps:**

1. **Push your code to GitHub** (already done!)

2. **Sign up at [Render](https://render.com)**
   - Create a free account at https://render.com

3. **Create a New Web Service**
   - Click "New +" and select "Web Service"
   - Connect your GitHub account
   - Select the `hello-helm` repository
   - Select branch: `claude/create-project-boilerplate-011CUTZJFpj5K4bk1J5A8udA`

4. **Configure the Service**
   - **Name**: `emi-calculator` (or your choice)
   - **Root Directory**: `emi-calculator`
   - **Environment**: `Node`
   - **Build Command**:
     ```
     cd frontend && npm install && npm run build && cd ../backend && npm install
     ```
   - **Start Command**:
     ```
     cd backend && NODE_ENV=production node server.js
     ```
   - **Plan**: Free

5. **Add Environment Variables** (if needed)
   - Click "Advanced"
   - Add: `NODE_ENV` = `production`

6. **Deploy**
   - Click "Create Web Service"
   - Wait 5-10 minutes for the build
   - Your app will be live at: `https://your-app-name.onrender.com`

**Pros**:
- Completely free
- Auto-deploys on git push
- HTTPS included
- Easy setup

**Cons**:
- Free tier spins down after inactivity (cold starts)

---

### Option 2: Railway (Alternative - Free Tier)

Railway offers $5 free credit monthly.

**Steps:**

1. **Sign up at [Railway](https://railway.app)**

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Connect GitHub and select `hello-helm`

3. **Configure**
   - Root directory: `emi-calculator`
   - Add these as build/start commands in Settings:
     - **Build**: `cd frontend && npm install && npm run build && cd ../backend && npm install`
     - **Start**: `cd backend && NODE_ENV=production node server.js`

4. **Deploy**
   - Railway auto-detects Node.js
   - Your app will be live at a railway.app subdomain

**Pros**:
- Very fast deployments
- No cold starts
- Great developer experience

**Cons**:
- Limited free tier ($5/month credit)

---

### Option 3: Vercel (Frontend + Backend)

Vercel is excellent for frontend hosting, and can host the backend as serverless functions.

**Note**: This requires restructuring the backend as serverless functions. The simpler approach is to use Vercel for frontend + Render for backend.

**Simple Approach - Frontend Only on Vercel:**

1. Deploy frontend to Vercel
2. Deploy backend to Render (as above)
3. Update frontend API calls to use Render backend URL

---

### Option 4: Docker (DigitalOcean, AWS, Google Cloud, etc.)

For container-based deployments:

**Build the Docker image:**
```bash
cd emi-calculator
docker build -t emi-calculator .
docker run -p 5000:5000 emi-calculator
```

**Deploy to various platforms:**

- **DigitalOcean App Platform**: Connect GitHub repo, auto-detects Dockerfile
- **Google Cloud Run**: Push image to GCR, deploy from console
- **AWS ECS/Fargate**: Similar process with ECR

---

### Option 5: Heroku (Paid)

Heroku no longer has a free tier, but it's still very popular.

**Steps:**

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Login and Create App**
   ```bash
   heroku login
   cd emi-calculator
   heroku create your-app-name
   ```

3. **Set Root Directory**
   ```bash
   heroku config:set NODE_ENV=production
   ```

4. **Create Procfile** (already have package.json scripts)
   Heroku will use `npm start` from root package.json

5. **Deploy**
   ```bash
   git push heroku your-branch:main
   ```

6. **Open App**
   ```bash
   heroku open
   ```

---

## Recommended: Render Deployment (Detailed)

Since Render is free and easiest, here's a complete guide:

### Step-by-Step Render Deployment

1. **Visit Render**: Go to https://render.com and sign up

2. **Connect GitHub**:
   - Click your profile icon → Account Settings
   - Connect GitHub account
   - Grant access to the `hello-helm` repository

3. **Create Web Service**:
   - Dashboard → "New +" → "Web Service"
   - Select `hello-helm` repository
   - Branch: `claude/create-project-boilerplate-011CUTZJFpj5K4bk1J5A8udA`

4. **Service Configuration**:
   ```
   Name: emi-calculator
   Region: Choose closest to you
   Branch: claude/create-project-boilerplate-011CUTZJFpj5K4bk1J5A8udA
   Root Directory: emi-calculator
   Runtime: Node
   Build Command: cd frontend && npm install && npm run build && cd ../backend && npm install
   Start Command: cd backend && NODE_ENV=production node server.js
   ```

5. **Instance Type**: Free

6. **Advanced Settings** (optional):
   - Auto-Deploy: Yes (deploys on every git push)
   - Health Check Path: `/api/health`

7. **Create Web Service**: Click the button and wait

8. **Monitor Build**: Watch the logs as it builds (takes 5-10 minutes first time)

9. **Access Your App**: Once deployed, you'll get a URL like:
   ```
   https://emi-calculator-xxxx.onrender.com
   ```

### Auto-Deployment

Once set up on Render:
- Every push to your branch automatically deploys
- No manual intervention needed
- Rollback available in Render dashboard

---

## Testing Your Deployment

Once deployed, test these endpoints:

1. **Health Check**:
   ```
   https://your-url.com/api/health
   ```
   Should return: `{"status":"OK","message":"EMI Calculator API is running"}`

2. **Full App**:
   ```
   https://your-url.com
   ```
   Should show the calculator interface

3. **API Test**: Use the web interface to calculate EMI foreclosure

---

## Environment Variables

For production, you may want to set:

```
NODE_ENV=production
PORT=5000 (or use platform default)
```

Most platforms automatically set `PORT`, so you don't need to configure it.

---

## Troubleshooting

### Build Fails
- Check build logs for specific errors
- Ensure all dependencies are in package.json
- Verify build commands are correct

### App Doesn't Load
- Check start command is correct
- Verify port binding (use `process.env.PORT`)
- Check server logs

### API Calls Fail
- Verify backend is running
- Check CORS configuration
- Ensure frontend is built correctly

### Cold Starts (Render Free Tier)
- Free tier spins down after inactivity
- First request after idle takes 30-60 seconds
- Keep alive with uptime monitoring (like UptimeRobot)

---

## Cost Comparison

| Platform | Free Tier | Cold Starts | Auto-Deploy | HTTPS |
|----------|-----------|-------------|-------------|-------|
| Render | Yes (unlimited) | Yes | Yes | Yes |
| Railway | $5/month credit | No | Yes | Yes |
| Vercel | Yes (frontend) | No | Yes | Yes |
| Heroku | No (starts $5/month) | No | Yes | Yes |
| DigitalOcean | No ($5/month min) | No | Depends | Yes |

---

## Recommended Choice

**For this project**: Use **Render**
- Free forever
- Easy setup (10 minutes)
- Auto-deploys from GitHub
- HTTPS included
- Perfect for small projects

---

## Custom Domain (Optional)

Most platforms allow custom domains:

1. **Get a domain** (Namecheap, GoDaddy, etc.)
2. **Add to platform**:
   - Render: Settings → Custom Domain
   - Railway: Settings → Domains
   - Vercel: Project Settings → Domains
3. **Update DNS**: Add CNAME record pointing to platform URL
4. **SSL**: Auto-configured by platform

---

## Next Steps

After deployment:
1. Test thoroughly
2. Share the URL
3. Monitor usage in platform dashboard
4. Set up error tracking (optional - Sentry, LogRocket)
5. Configure custom domain (optional)

---

**Need Help?**
- Render Docs: https://render.com/docs
- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs

Good luck with your deployment! 🚀
