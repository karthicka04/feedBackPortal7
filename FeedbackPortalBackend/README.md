# Deployment Setup Guide

This guide covers the necessary steps to configure your application for deployment on Vercel.

## Prerequisites

1. Node.js version: 18.x or higher
2. MongoDB Atlas account
3. Vercel account
4. Git and GitHub account

## Backend Setup


### 1. Package Dependencies
Update your `package.json` with these specific versions:

```json
{
  "dependencies": {
    "express": "^4.21.2",
    "mongoose": "^8.10.0",
    "mongodb": "^6.3.0",
    "cors": "^2.8.5",
    "dotenv": "^16.4.7",
    "bcryptjs": "^3.0.2",
    "jsonwebtoken": "^9.0.2",
    "body-parser": "^1.20.2",
    "multer": "^1.4.5-lts.1",
    "xlsx": "^0.18.5",
    "axios": "^1.8.4"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  },
  "engines": {
    "node": "18.x"
  }
}
```

### 2. Update Dependencies
Run these commands to ensure clean installation:

```powershell
# Remove existing node_modules and package-lock.json
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json

# Install dependencies fresh
npm install

# Build the project
npm run build
```

### 3. MongoDB Setup
1. Create a MongoDB Atlas account if you don't have one
2. Create a new cluster (free tier is sufficient)
3. Set up database access:
   - Create a database user with password
   - Add your IP address to the IP whitelist
4. Get your connection string from MongoDB Atlas

### 4. Create vercel.json
Create a `vercel.json` file in the server directory:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

### 5. Update CORS Configuration
In `server.js`, update the CORS configuration:

```javascript
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://your-frontend-domain.vercel.app" // Replace with your actual frontend domain after deploy the backend
  ],
  credentials: true
}));
```

### 6. Environment Variables
Create a `.env` file in the server directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

## Frontend Setup

### 1. Package Dependencies
Update your `package.json` with these specific versions:

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "axios": "^1.8.4",
    "react-router-dom": "^6.22.0",
    "@mui/material": "^5.15.0",
    "@mui/icons-material": "^5.15.0",
    "@emotion/react": "^11.11.0",
    "@emotion/styled": "^11.11.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "vite": "^5.0.0"
  }
}
```

### 2. Update Dependencies
Run these commands to ensure clean installation:

```powershell
# Remove existing node_modules and package-lock.json
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json

# Install dependencies fresh
npm install

# Build the project
npm run build
```

### 3. Create vercel.json
Create a `vercel.json` file in the frontend directory:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

### 4. Environment Variables
Create a `.env` file in the frontend directory:

```env
VITE_API_BASE_URL=http://localhost:5000
```

### 5. API Base URL Configuration
In all frontend components where you make API calls:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Example API call
const response = await axios.get(`${API_BASE_URL}/api/feedback?userId=${userId}`);
```

## Deployment Steps

### 1. Backend Deployment (Do this first)
1. Push your backend code to GitHub
2. Import your repository in Vercel
3. Configure build settings:
   - Build Command: `npm install && npm run build`
   - Output Directory: `./`
   - Install Command: `npm install`
4. Add environment variables in Vercel project settings:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Your JWT secret key
   - `PORT`: 5000 (or your preferred port)
5. Deploy
6. After successful deployment, copy your backend URL (e.g., `https://your-backend.vercel.app`)

### 2. Frontend Deployment (Do this after backend)
1. Push your frontend code to GitHub
2. Import your repository in Vercel
3. Configure build settings:
   - Framework Preset: Vite
   - Build Command: `npm install && npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
4. Add environment variables in Vercel project settings:
   - `VITE_API_BASE_URL`: Set to your deployed backend URL (e.g., `https://your-backend.vercel.app`)
5. Deploy

### 3. Final Configuration
1. After both deployments are complete:
   - Get your frontend URL from Vercel
   - Update the CORS configuration in your backend's `server.js` with the actual frontend URL
   - Redeploy the backend if needed

## Important Notes

1. **Environment Variables**
   - Never commit `.env` files to GitHub
   - Use `.env.example` files to document required variables
   - Set all environment variables in Vercel project settings

2. **CORS Configuration**
   - Always include both development (localhost) and production URLs
   - Update the frontend URL in CORS after deployment

3. **API Base URL**
   - Development: `http://localhost:5000`
   - Production: Your deployed backend URL (e.g., `https://your-backend.vercel.app`)

4. **Vercel Configuration**
   - Backend: Uses Node.js runtime
   - Frontend: Uses Vite build system
   - Both need proper environment variables set in Vercel

## Troubleshooting

1. **CORS Issues**
   - Check if frontend URL is correctly added to CORS configuration
   - Verify environment variables are set correctly

2. **API Connection Issues**
   - Verify `VITE_API_BASE_URL` is set correctly in frontend
   - Check if backend is running and accessible
   - Ensure all environment variables are set in Vercel

3. **Build Failures**
   - Check build logs in Vercel
   - Verify all dependencies are in package.json
   - Ensure build commands are correct

4. **MongoDB Connection Issues**
   - Verify MongoDB Atlas connection string is correct
   - Check if IP address is whitelisted in MongoDB Atlas
   - Ensure database user credentials are correct 
