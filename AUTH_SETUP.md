# 🔐 Authentication System Setup - Team Blitz

This document explains the JWT-based authentication system implemented for the Team Blitz hackathons dashboard.

## 🚀 Quick Start

### 1. Create Admin User
Visit: `http://localhost:3000/setup-admin.html`
- Enter admin secret: `team-blitz-admin-2025`
- Click "Create Admin User"
- Note down the credentials

### 2. Access Protected Route
Visit: `http://localhost:3000/live_hackthons`
- You'll be redirected to login if not authenticated
- Login with admin credentials
- Access the hackathons dashboard

## 🏗️ System Architecture

### Authentication Flow
1. **Login** → JWT token generated and stored in localStorage
2. **Protected Routes** → Token verified on each request
3. **API Calls** → Token sent in Authorization header
4. **Logout** → Token removed from localStorage

### Components Created

#### 🔧 Backend Components
- **`/src/models/User.js`** - User model with bcrypt password hashing
- **`/src/utils/jwt.js`** - JWT token generation and verification utilities
- **`/src/middleware/auth.js`** - Authentication middleware for API routes
- **`/src/app/api/auth/login/route.js`** - Login endpoint
- **`/src/app/api/auth/register/route.js`** - Registration endpoint (with admin secret)
- **`/src/app/api/auth/verify/route.js`** - Token verification endpoint
- **`/src/app/api/setup/admin/route.js`** - Admin user creation endpoint

#### 🎨 Frontend Components
- **`/src/contexts/AuthContext.tsx`** - React context for auth state management
- **`/src/components/LoginForm.tsx`** - Login form component
- **`/src/components/ProtectedRoute.tsx`** - Route protection wrapper
- **`/public/setup-admin.html`** - Admin setup page

### Protected Routes
- **`/live_hackthons`** - Requires admin authentication
- **API `/api/hackathons`** - All methods (GET, POST, DELETE) require admin auth

## 🔑 Environment Variables

Add these to your `.env` file:

```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
ADMIN_SECRET=team-blitz-admin-2025
```

## 👤 User Roles

### Admin
- Can access `/live_hackthons` dashboard
- Can create, view, and delete hackathons
- Can manage team members

### User (Future)
- Currently not implemented
- Could be used for team member access

## 🛡️ Security Features

1. **Password Hashing** - bcrypt with salt rounds of 12
2. **JWT Tokens** - Signed with secret key, 7-day expiration
3. **Route Protection** - Client-side and server-side validation
4. **Admin Secret** - Required for creating admin users
5. **Token Verification** - Middleware checks token validity on each API call

## 📝 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration (requires admin secret for admin role)
- `GET /api/auth/verify` - Token verification

### Setup
- `POST /api/setup/admin` - Create admin user (requires admin secret)

### Hackathons (Protected)
- `GET /api/hackathons` - Get all hackathons (admin only)
- `POST /api/hackathons` - Create hackathon (admin only)
- `DELETE /api/hackathons` - Delete hackathon (admin only)

## 🔧 Usage Examples

### Creating Admin User (via API)
```javascript
const response = await fetch('/api/setup/admin', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ adminSecret: 'team-blitz-admin-2025' })
});
```

### Login
```javascript
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    email: 'admin@teamblitz.com', 
    password: 'admin123' 
  })
});
```

### Making Authenticated API Calls
```javascript
const token = localStorage.getItem('auth_token');
const response = await fetch('/api/hackathons', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

## 🚨 Default Credentials

**Admin User:**
- Email: `admin@teamblitz.com`
- Username: `admin`
- Password: `admin123`
- Role: `admin`

**⚠️ Important:** Change these credentials in production!

## 🔄 Development Workflow

1. Start development server: `npm run dev`
2. Visit `/setup-admin.html` to create admin user
3. Visit `/live_hackthons` to access protected dashboard
4. Login with admin credentials
5. Start managing hackathons!

## 🛠️ Troubleshooting

### Common Issues

1. **"Invalid or expired token"**
   - Token expired (7 days)
   - Invalid JWT secret
   - Solution: Login again

2. **"Admin access required"**
   - User role is not 'admin'
   - Solution: Create user with admin role

3. **"User not found"**
   - Admin user not created
   - Solution: Run admin setup

4. **Database connection issues**
   - Check MongoDB connection
   - Verify environment variables

## 🔮 Future Enhancements

- [ ] Password reset functionality
- [ ] Email verification
- [ ] Role-based permissions system
- [ ] Session management
- [ ] Rate limiting
- [ ] OAuth integration (Google, GitHub)
- [ ] Two-factor authentication

## 📚 Dependencies Added

```json
{
  "jsonwebtoken": "^9.0.0",
  "bcryptjs": "^2.4.3",
  "@types/jsonwebtoken": "^9.0.0",
  "@types/bcryptjs": "^2.4.0"
}
```

---

**🎉 Your Team Blitz hackathons dashboard is now secure and ready to use!**
