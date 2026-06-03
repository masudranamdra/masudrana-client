# Environment Variables Guide for Production Deployment

## Frontend (Client) - Vercel

### Public Environment Variables (Required)
These variables must be set in Vercel Environment Variables:

```bash
# API Base URL (Backend Render URL after deployment)
NEXT_PUBLIC_API_BASE_URL=https://your-backend.onrender.com

# Site URL (Frontend Vercel URL after deployment)
NEXT_PUBLIC_SITE_URL=https://your-frontend.vercel.app

# Google OAuth Client ID (Public)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
```

### Development Environment Variables (Local)
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:10000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-local-google-client-id
```

## Backend (Server) - Render

### Required Environment Variables
These variables must be set in Render Environment Variables:

```bash
# Server Configuration
PORT=10000
NODE_ENV=production

# MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
MONGODB_DB=portfolio_db

# Authentication Secrets
JWT_SECRET=your-jwt-secret-min-32-characters-long
BETTER_AUTH_SECRET=your-better-auth-secret-min-32-characters-long

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Frontend URL (for CORS and trusted origins)
CLIENT_URL=https://your-frontend.vercel.app

# Admin Configuration
ADMIN_EMAILS=admin@example.com,another-admin@example.com

# Email Configuration (Nodemailer)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password
```

### Development Environment Variables (Local)
```bash
PORT=10000
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
MONGODB_DB=portfolio_db
JWT_SECRET=dev-jwt-secret-min-32-characters-long
BETTER_AUTH_SECRET=dev-better-auth-secret-min-32-characters-long
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
CLIENT_URL=http://localhost:3000,http://localhost:3001
ADMIN_EMAILS=admin@example.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password
```

## Important Notes

1. **Never commit secrets to git** - Use environment variables in deployment platforms
2. **Generate strong secrets** - Use at least 32 characters for JWT_SECRET and BETTER_AUTH_SECRET
3. **Google OAuth Setup**:
   - Create OAuth 2.0 credentials in Google Cloud Console
   - Add both frontend and backend URLs to authorized redirect URIs
   - For Vercel: https://your-frontend.vercel.app/api/auth/callback/google
   - For Render: https://your-backend.onrender.com/api/auth/callback/google
4. **MongoDB Atlas**:
   - Whitelist Render IP addresses (0.0.0.0/0 for all)
   - Use connection string with SRV records
5. **Email Configuration**:
   - Use App Passwords for Gmail (not regular password)
   - Enable 2FA on Gmail account
