# Frontend-Backend Communication Fix

## Problem
The frontend was not calling the backend during deployment because it was using `http://localhost:5000` instead of the actual backend URL.

## Root Cause
- The `.env` file was missing in the deployed environment
- Each Redux slice was using `import.meta.env.VITE_API_URL || 'http://localhost:5000'` which defaulted to localhost
- No centralized API URL management

## Solution Implemented

### 1. Created `.env` File
**File:** `frontend/.env`
```
VITE_API_URL=http://13.49.223.157:5000
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 2. Created Centralized API Configuration
**File:** `frontend/src/utils/apiConfig.js`
- Centralized API URL handling
- Automatically removes trailing slashes
- Single source of truth for API URL across the application

### 3. Updated All Redux Slices
Updated the following files to use the centralized API config:
- `src/redux/Slices/AdminProductSlice.js`
- `src/redux/Slices/authSlice.js`
- `src/redux/Slices/CartSlice.js`
- `src/redux/Slices/GetProductSlice.js`
- `src/redux/Slices/OrderSlice.js`
- `src/pages/Cart/Cart.jsx`

### 4. Updated Environment Example
**File:** `frontend/.env.example`
- Added clear documentation
- Provided example URLs for different environments
- No trailing slash in examples

## Environment Variables Required

For deployment, ensure the `.env` file contains:

```env
VITE_API_URL=http://13.49.223.157:5000
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51Rlrb6QU12STd9GvoZvjGzJZLQM0lCNYUdtq3vOBChu4TZFYkZWMVP0xuN9wqKSTVvFhf70mWjovRnB1VVsBIncY00AU4OIGwT
```

### For Different Environments:
- **Development:** `VITE_API_URL=http://localhost:5000`
- **Production/Deployment:** `VITE_API_URL=http://13.49.223.157:5000` (or your domain)

## Backend CORS Configuration
The backend (`server.js`) is already configured with proper CORS:
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'Expires', 'Pragma'],
  credentials: true,
}));
```

## Testing

After deployment:
1. Rebuild the frontend: `npm run build`
2. Verify the `.env` file exists with correct `VITE_API_URL`
3. Check browser console for any API errors
4. Test API calls (login, product fetch, cart operations)

## Additional Notes

- The `.env` file should NOT be committed to git (it's already in .gitignore)
- Different environment files can be used for dev/staging/production
- The API URL should include the port number if not using standard ports (80/443)
- Ensure backend is running and accessible from your deployment server
