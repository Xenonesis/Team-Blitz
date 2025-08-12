# Production Deployment Guide

## Pre-deployment Checklist

### 1. Environment Variables
- [ ] Copy `.env.production` and update with production values
- [ ] Generate strong JWT_SECRET (min 32 characters)
- [ ] Update ADMIN_SECRET with secure value
- [ ] Set production Firebase credentials
- [ ] Configure production email settings
- [ ] Set NEXT_PUBLIC_BASE_URL to production domain

### 2. Security Configuration
- [ ] Enable HTTPS on your domain
- [ ] Configure proper CORS settings
- [ ] Set up rate limiting (recommended)
- [ ] Review and update allowed email domains
- [ ] Ensure Firebase security rules are production-ready

### 3. Performance Optimization
- [ ] Run `npm run build` to test production build
- [ ] Optimize images in `/public` folder
- [ ] Review and minimize bundle size
- [ ] Enable CDN for static assets (recommended)

## Deployment Options

### Option 1: Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Option 2: Docker Deployment
```dockerfile
# Dockerfile (create this file)
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]
```

### Option 3: Traditional VPS/Server
```bash
# On your server
git clone <your-repo>
cd <your-project>
npm install
npm run build
npm run start:prod
```

## Environment Variables Setup

### Required Variables
```env
# Firebase (get from Firebase Console)
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com

# Security
JWT_SECRET=your-super-secure-32-char-minimum-secret
ADMIN_SECRET=your-admin-secret

# Application
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

### Optional but Recommended
```env
# Email notifications
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-char-app-password

# JWT expiration
JWT_EXPIRES_IN=7d
```

## Post-deployment Steps

### 1. Database Setup
```bash
# Run database seeding (if needed)
npm run seed
```

### 2. Admin User Setup
- Access `/api/setup/admin` to create admin user
- Or use the admin creation script

### 3. Testing
- [ ] Test user registration/login
- [ ] Test admin functionality
- [ ] Test email notifications
- [ ] Test hackathon stage updates
- [ ] Verify all API endpoints

### 4. Monitoring Setup
- [ ] Set up error monitoring (Sentry recommended)
- [ ] Configure uptime monitoring
- [ ] Set up log aggregation
- [ ] Monitor performance metrics

## Performance Optimization

### 1. Caching
- Enable CDN for static assets
- Configure proper cache headers
- Use Redis for session storage (optional)

### 2. Database Optimization
- Index frequently queried fields
- Optimize Firebase security rules
- Monitor query performance

### 3. Monitoring
```bash
# Bundle analysis
npm run build:analyze
```

## Security Best Practices

### 1. Environment Security
- Never commit `.env` files
- Use strong, unique secrets
- Rotate secrets regularly
- Use environment-specific configurations

### 2. Application Security
- Keep dependencies updated
- Enable HTTPS only
- Implement rate limiting
- Validate all inputs
- Use CSRF protection

### 3. Firebase Security
- Review Firestore security rules
- Enable audit logging
- Monitor authentication events
- Set up alerts for suspicious activity

## Troubleshooting

### Common Issues
1. **Build Failures**: Check environment variables and dependencies
2. **Firebase Connection**: Verify credentials and project settings
3. **Email Issues**: Check Gmail app password and SMTP settings
4. **Performance**: Analyze bundle size and optimize imports

### Logs and Debugging
- Check application logs for errors
- Monitor Firebase console for issues
- Use browser dev tools for client-side debugging
- Enable verbose logging in development

## Maintenance

### Regular Tasks
- [ ] Update dependencies monthly
- [ ] Monitor error rates
- [ ] Review security logs
- [ ] Backup database regularly
- [ ] Test disaster recovery procedures

### Updates
```bash
# Update dependencies
npm update

# Security audit
npm audit

# Test after updates
npm run test:build
```