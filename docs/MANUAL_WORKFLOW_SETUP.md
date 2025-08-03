# Manual GitHub Actions Workflow Setup

## 🚨 **Action Required: Create GitHub Actions Workflow**

Due to GitHub token permissions, the workflow file needs to be created manually in the GitHub repository.

## 📋 **Step-by-Step Instructions**

### 1. **Navigate to GitHub Repository**
Go to: https://github.com/christiancrisologo/kids-math-quiz

### 2. **Create Workflow Directory** 
1. Click on **"Create new file"**
2. Type: `.github/workflows/deploy-gh-pages.yml`
3. GitHub will automatically create the directory structure

### 3. **Copy Workflow Content**
Copy and paste the following content into the file:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

env:
  NODE_VERSION: '18'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm run test --if-present

      - name: Run linting
        run: npm run lint

      - name: Build application
        run: npm run build
        env:
          NODE_ENV: production

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./out

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4

  notification:
    runs-on: ubuntu-latest
    needs: [build, deploy]
    if: always()
    steps:
      - name: Deployment Status
        run: |
          if [ "${{ needs.deploy.result }}" == "success" ]; then
            echo "✅ Deployment successful! Math Quiz for Kids is now live on GitHub Pages."
            echo "🌐 Live URL: https://christiancrisologo.github.io/kids-math-quiz/"
          else
            echo "❌ Deployment failed. Please check the logs for details."
            exit 1
          fi
```

### 4. **Commit the Workflow**
1. Scroll down to **"Commit new file"**
2. Title: `ci: add GitHub Pages deployment workflow`
3. Description: `Add automated CI/CD pipeline for GitHub Pages deployment`
4. Click **"Commit new file"**

### 5. **Enable GitHub Pages**
1. Go to **Repository Settings**
2. Navigate to **"Pages"** in the sidebar
3. Under **"Source"**, select **"GitHub Actions"**
4. Click **"Save"**

## 🎯 **What Happens Next**

### **Immediate Effects:**
- ✅ GitHub Actions workflow is now active
- ✅ GitHub Pages is configured for deployment
- ✅ Next push to main will trigger automatic deployment

### **After Merging PR:**
1. **Automatic Trigger**: When the dark mode PR is merged to main
2. **Build Process**: GitHub Actions will build the app
3. **Deployment**: App will be deployed to GitHub Pages
4. **Live URL**: https://christiancrisologo.github.io/kids-math-quiz/

## 🔧 **Verification Steps**

### **Check Workflow Status:**
1. Go to **"Actions"** tab in GitHub repository
2. Verify the workflow appears in the list
3. Check that it's enabled and ready to run

### **Test Manual Trigger:**
1. Go to **"Actions"** tab
2. Click on **"Deploy to GitHub Pages"** workflow
3. Click **"Run workflow"** to test manually

## ⚡ **Expected Timeline**

| Step | Duration | Status |
|------|----------|---------|
| Create workflow file | 2 minutes | ⏳ Manual |
| Enable GitHub Pages | 1 minute | ⏳ Manual |
| First deployment | 3-5 minutes | 🤖 Automatic |
| Live site availability | Immediate | 🌐 Automatic |

## 🚨 **Important Notes**

### **Repository Settings Required:**
- ✅ Actions must be enabled
- ✅ Pages source set to "GitHub Actions"
- ✅ Repository must be public (or GitHub Pro/Team)

### **Branch Protection:**
- Consider protecting main branch
- Require PR reviews before merge
- Require status checks to pass

## 🎉 **Success Indicators**

You'll know it's working when:
- ✅ Green checkmark appears on commits
- ✅ "Pages" section shows deployment URL
- ✅ App is accessible at GitHub Pages URL
- ✅ Build badges in README show "passing"

## 🆘 **Troubleshooting**

### **Common Issues:**
1. **Workflow not triggering**: Check if Actions are enabled
2. **Build failures**: Check Node.js version and dependencies
3. **Deployment errors**: Verify Pages settings and permissions
4. **404 errors**: Check base path configuration

### **Debug Commands:**
```bash
# Test build locally
npm run build

# Check production build
NODE_ENV=production npm run build

# Verify static export
ls -la out/
```

## 📞 **Support**

If you encounter issues:
1. Check the `DEPLOYMENT_SUMMARY.md` for detailed troubleshooting
2. Review GitHub Actions logs in the "Actions" tab
3. Verify all configuration files are properly set up

---

**Once completed, the Math Quiz for Kids app will be automatically deployed to GitHub Pages with every commit to main! 🚀**
