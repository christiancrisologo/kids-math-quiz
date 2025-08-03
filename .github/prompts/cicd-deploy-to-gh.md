# CI/CD Deployment to GitHub Pages

## Overview
Create a GitHub Actions workflow to automatically deploy the Math Quiz for Kids Next.js application to GitHub Pages whenever there's a commit to the main branch. This will provide continuous deployment with zero-downtime updates and automatic build optimization.

## Requirements

### 1. GitHub Actions Workflow
Create a workflow file that:
- Triggers on push to `main` branch
- Builds the Next.js application for static export
- Deploys to GitHub Pages
- Provides build status and deployment notifications
- Handles caching for faster builds
- Includes error handling and rollback capabilities

### 2. Next.js Configuration
Update the Next.js configuration to support static export for GitHub Pages:
- Enable static export mode
- Configure proper base path for GitHub Pages
- Optimize images for static hosting
- Handle client-side routing correctly

### 3. Repository Settings
Configure the repository for GitHub Pages deployment:
- Enable GitHub Pages from Actions
- Set up proper permissions
- Configure custom domain (optional)
- Set up branch protection rules

## Implementation Guide

### Step 1: Create GitHub Actions Workflow

Create `.github/workflows/deploy-gh-pages.yml` with the following specifications:

#### Workflow Configuration
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
```

#### Job Structure
- **Build Job**: Install dependencies, build, and prepare artifacts
- **Deploy Job**: Deploy to GitHub Pages with proper environment

#### Required Steps
1. **Checkout**: Use `actions/checkout@v4`
2. **Node.js Setup**: Use `actions/setup-node@v4` with Node.js 18+
3. **Dependency Installation**: Cache and install npm dependencies
4. **Build Process**: Run `npm run build` with static export
5. **Upload Artifacts**: Upload build output to GitHub Pages
6. **Deploy**: Deploy to GitHub Pages environment

### Step 2: Next.js Configuration Updates

#### Update `next.config.js`
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? '/kids-math-quiz' : '',
  basePath: process.env.NODE_ENV === 'production' ? '/kids-math-quiz' : '',
};

module.exports = nextConfig;
```

#### Environment Variables
- `NEXT_PUBLIC_BASE_PATH`: For handling GitHub Pages subdirectory
- `NODE_ENV`: For production optimizations

### Step 3: Package.json Scripts

Add deployment scripts:
```json
{
  "scripts": {
    "build": "next build",
    "export": "next export",
    "deploy": "npm run build && npm run export",
    "build:gh-pages": "next build && next export"
  }
}
```

### Step 4: Repository Configuration

#### GitHub Pages Settings
1. Go to repository Settings → Pages
2. Source: GitHub Actions
3. Custom domain (optional): Configure if needed
4. Enforce HTTPS: Enable

#### Branch Protection
- Protect `main` branch
- Require status checks
- Require up-to-date branches
- Require review before merging

### Step 5: Build Optimization

#### Performance Optimizations
- Enable Tailwind CSS purging
- Optimize images and assets
- Minimize JavaScript bundles
- Enable compression

#### Caching Strategy
- Cache Node.js dependencies
- Cache Next.js build cache
- Cache npm/yarn packages
- Implement incremental builds

## Workflow File Specifications

### File Location
`.github/workflows/deploy-gh-pages.yml`

### Trigger Conditions
- Push to `main` branch
- Manual workflow dispatch
- Exclude draft pull requests

### Environment Configuration
- Node.js version: 18.x or later
- Operating system: ubuntu-latest
- Timeout: 10 minutes maximum

### Security Considerations
- Use minimal required permissions
- Secure environment variables
- Validate inputs and dependencies
- Enable dependency vulnerability scanning

### Error Handling
- Graceful failure handling
- Notification on deployment failures
- Rollback mechanisms
- Build artifact preservation

## File Structure After Implementation

```
.github/
├── workflows/
│   └── deploy-gh-pages.yml     # Main deployment workflow
├── ISSUE_TEMPLATE/             # Issue templates
└── PULL_REQUEST_TEMPLATE.md    # PR template

src/
├── app/
│   ├── layout.tsx              # Updated with base path handling
│   └── ...                     # Other app files
├── components/
├── utils/
│   └── paths.ts               # Helper for GitHub Pages paths
└── ...

next.config.js                  # Updated for static export
package.json                    # Updated with deploy scripts
README.md                      # Updated with deployment info
```

## Deployment Workflow Steps

### 1. Pre-deployment Checks
- Verify all tests pass
- Check build succeeds locally
- Validate configuration files
- Ensure no sensitive data in build

### 2. Build Process
- Install dependencies with caching
- Run TypeScript compilation
- Execute Next.js build
- Generate static export
- Optimize assets

### 3. Deployment
- Upload artifacts to GitHub Pages
- Update deployment status
- Verify deployment success
- Update environment URLs

### 4. Post-deployment
- Run smoke tests
- Verify all pages load correctly
- Check theme switching functionality
- Validate mobile responsiveness

## Configuration Variables

### Repository Secrets (if needed)
```
GITHUB_TOKEN         # Automatically provided
NODE_ENV=production  # Set in workflow
```

### Environment Variables
```
NEXT_PUBLIC_BASE_PATH=/kids-math-quiz
NEXT_PUBLIC_ASSET_PREFIX=/kids-math-quiz
```

## Testing Strategy

### Pre-deployment Testing
- Unit tests must pass
- Build must succeed
- No TypeScript errors
- ESLint validation passes

### Post-deployment Testing
- Automated smoke tests
- Visual regression testing
- Performance monitoring
- Accessibility validation

## Monitoring and Notifications

### Deployment Status
- GitHub status checks
- Slack/Discord notifications (optional)
- Email notifications on failure
- Deployment history tracking

### Performance Monitoring
- Build time tracking
- Bundle size monitoring
- Core Web Vitals tracking
- Error rate monitoring

## Rollback Strategy

### Automatic Rollback
- On deployment failure
- On critical error detection
- On performance degradation

### Manual Rollback
- Emergency procedures
- Version management
- Backup strategies

## Custom Domain Configuration (Optional)

### Setup Steps
1. Add CNAME file to public folder
2. Configure DNS settings
3. Update repository settings
4. Enable SSL/TLS

### Domain Configuration
```
# public/CNAME
mathquiz.yourdomain.com
```

## Security Best Practices

### Workflow Security
- Minimal permissions principle
- Secure token handling
- Dependency vulnerability scanning
- Branch protection rules

### Application Security
- No sensitive data in client bundle
- Secure headers configuration
- Content Security Policy
- HTTPS enforcement

## Performance Optimization

### Build Optimization
- Tree shaking enabled
- Code splitting
- Asset optimization
- Compression enabled

### Runtime Optimization
- Service worker for caching
- CDN integration
- Image optimization
- Lazy loading

## Maintenance Tasks

### Regular Maintenance
- Update dependencies monthly
- Monitor build performance
- Review deployment logs
- Update documentation

### Security Updates
- Automatic security updates
- Vulnerability scanning
- Regular audits
- Dependency updates

## Success Criteria

### Deployment Success
- [x] Automatic deployment on main branch commits
- [x] Build completes without errors
- [x] All pages load correctly
- [x] Dark mode functionality works
- [x] Mobile responsiveness maintained
- [x] Performance metrics meet standards

### CI/CD Pipeline Success
- [x] Fast build times (<5 minutes)
- [x] Reliable deployments (>99% success rate)
- [x] Proper error handling and notifications
- [x] Rollback capabilities
- [x] Security scanning integration

## Troubleshooting Guide

### Common Issues
1. **Build failures**: Check Node.js version, dependencies
2. **Deployment failures**: Verify permissions, GitHub Pages settings
3. **Path issues**: Check base path configuration
4. **Asset loading**: Verify asset prefix settings

### Debug Steps
1. Check workflow logs
2. Verify repository settings
3. Test build locally
4. Check Next.js configuration

## Documentation Updates

### README.md Updates
- Add deployment badges
- Include live demo link
- Update development instructions
- Add contribution guidelines

### Additional Documentation
- Deployment troubleshooting guide
- Performance optimization tips
- Security considerations
- Maintenance procedures

## Implementation Timeline

### Phase 1: Basic Deployment (Day 1)
- Create workflow file
- Update Next.js config
- Test basic deployment

### Phase 2: Optimization (Day 2-3)
- Add caching strategies
- Implement error handling
- Add monitoring

### Phase 3: Advanced Features (Day 4-5)
- Custom domain setup
- Performance optimization
- Security hardening

This implementation will provide a robust, automated deployment pipeline that ensures the Math Quiz for Kids app is always up-to-date on GitHub Pages with minimal manual intervention.
