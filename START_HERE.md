# 🎯 START HERE - Deployment Guide

## 👋 Welcome!

You want to host your SWIS app for **100% FREE**. I've prepared everything for you!

---

## 📚 Which Guide Should You Use?

### 🟢 **BEGINNER** (Never deployed before)
**Use:** `BEGINNER_DEPLOYMENT_GUIDE.md`
- Step-by-step instructions
- Explains everything in detail
- Includes screenshots descriptions
- Estimated time: 2 hours

### 🟡 **QUICK START** (Some experience)
**Use:** `DEPLOYMENT_CHECKLIST.md`
- Simple checklist format
- Just the essential steps
- Check off as you go
- Estimated time: 1 hour

### 🔵 **ADVANCED** (Know what you're doing)
**Use:** `DEPLOYMENT.md`
- Technical documentation
- Configuration details
- Troubleshooting guide
- Estimated time: 30 minutes

---

## 🎯 Your Hosting Setup

```
Frontend  → Vercel      (Free, instant, no sleep)
Backend   → Render      (Free, 750 hrs/month, sleeps after 15 min)
Database  → Supabase    (You already have this!)
Extension → Chrome      (Install locally)
```

**Total Cost: $0/month** ✅

---

## ✅ What I've Already Done For You

I've prepared your code for deployment:

1. ✅ Created `frontend/src/config.ts` - Centralized API configuration
2. ✅ Updated all frontend pages to use environment variables
3. ✅ Created `frontend/.env` - Local development config
4. ✅ Created `frontend/.env.example` - Template for others
5. ✅ Created `server/requirements.txt` - Python dependencies for ML
6. ✅ Created `render.yaml` - Render configuration
7. ✅ Created `vercel.json` - Vercel configuration
8. ✅ Created `.gitignore` - Ignore sensitive files
9. ✅ Created deployment guides (3 versions!)

---

## 🚀 Quick Start (5 Steps)

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR-USERNAME/swis-app.git
git push -u origin main
```

### 2. Deploy Backend (Render)
- Go to https://render.com
- Sign up with GitHub
- New Web Service → Connect repo
- Configure (see guide for details)
- Add DATABASE_URL from Supabase

### 3. Deploy Frontend (Vercel)
- Go to https://vercel.com
- Sign up with GitHub
- Import project
- Set root directory: `frontend`
- Add VITE_API_URL environment variable

### 4. Update Extension
- Edit `extension/background.js`
- Change API_URL and DASHBOARD_URL to your deployed URLs
- Push changes to GitHub

### 5. Test Everything
- Visit your Vercel URL
- Register and login
- Install extension in Chrome
- Browse websites
- Check Analytics page

---

## 📋 What You Need

Before starting, make sure you have:

- [ ] GitHub account
- [ ] Git installed on your computer
- [ ] Supabase database connection string
- [ ] 1-2 hours of time
- [ ] Chrome browser (for extension)

---

## 🎓 Choose Your Path

**I'm a complete beginner:**
→ Open `BEGINNER_DEPLOYMENT_GUIDE.md`
→ Follow every single step
→ Don't skip anything!

**I've deployed apps before:**
→ Open `DEPLOYMENT_CHECKLIST.md`
→ Check off items as you go
→ Refer to BEGINNER guide if stuck

**I'm experienced:**
→ Open `DEPLOYMENT.md`
→ Skim the technical details
→ Deploy in 30 minutes

---

## 🆘 Need Help?

### Common Questions

**Q: Do I need a credit card?**
A: No! Everything is 100% free, no credit card required.

**Q: Will my backend be slow?**
A: First request after 15 min takes 30-60 seconds (cold start). After that it's instant. Use UptimeRobot (free) to prevent sleep.

**Q: Can I use a custom domain?**
A: Yes! Vercel offers free custom domains. Render requires paid plan.

**Q: What if I get stuck?**
A: Check the troubleshooting section in `BEGINNER_DEPLOYMENT_GUIDE.md`

**Q: How do I update my app later?**
A: Just push to GitHub: `git add .` → `git commit -m "message"` → `git push`
   Render and Vercel auto-deploy in 2-3 minutes!

---

## 📊 Free Tier Limits

**Render (Backend):**
- ✅ 750 hours/month (enough for 24/7)
- ⚠️ Sleeps after 15 min inactivity
- ✅ Auto-deploys from GitHub
- ✅ Free SSL certificate

**Vercel (Frontend):**
- ✅ Unlimited bandwidth
- ✅ No sleep/cold starts
- ✅ Global CDN (super fast)
- ✅ Auto-deploys from GitHub
- ✅ Free SSL certificate

**Supabase (Database):**
- ✅ 500MB storage
- ✅ 2GB bandwidth/month
- ✅ No sleep (always-on)
- ✅ Auto backups

---

## 🎯 Success Checklist

After deployment, you should have:

- [ ] Frontend URL (Vercel)
- [ ] Backend URL (Render)
- [ ] Backend health check returns "ok"
- [ ] Can register and login
- [ ] Can add assignments
- [ ] Can log study sessions
- [ ] Extension tracks websites
- [ ] Analytics page shows data
- [ ] Insights page shows ML predictions

---

## 🎉 Ready to Deploy?

1. **Choose your guide** (see above)
2. **Open the guide** in your text editor or browser
3. **Follow step by step** - don't skip!
4. **Test everything** when done
5. **Share your app** with friends!

---

## 📞 Support Resources

- **Render Docs:** https://render.com/docs
- **Vercel Docs:** https://vercel.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **Git Tutorial:** https://git-scm.com/docs/gittutorial

---

## 💡 Pro Tips

1. **Save your URLs** - Write them down somewhere safe
2. **Set up UptimeRobot** - Prevents backend from sleeping
3. **Enable auto-deploy** - Already configured for you!
4. **Check logs** - If something breaks, check Render/Vercel logs
5. **Test locally first** - Make sure everything works before deploying

---

## 🚀 Let's Go!

**Pick your guide and start deploying!**

Good luck! You've got this! 💪

---

*Last updated: March 2026*
*Questions? Check the troubleshooting section in BEGINNER_DEPLOYMENT_GUIDE.md*
