# Demo Credentials

This document contains demo/test credentials for the Discovr platform.

## 🎯 Quick Demo Credentials

### Admin Dashboard
- **Email:** `admin@discovr.com`
- **Password:** `admin123`
- **Role:** `admin`
- **Access:** Full platform management

### Brand Dashboard
- **Email:** `brand@discovr.com`
- **Password:** `brand123`
- **Role:** `brand_owner`
- **Access:** Campaign management, creator discovery

### Creator Dashboard
- **Email:** `creator@discovr.com`
- **Password:** `creator123`
- **Role:** `creator`
- **Access:** Campaign browsing, bidding, content submission

---

## 🔧 Backend Test Credentials

Based on backend documentation, there's also a test account:

- **Email:** `diligentdwivedi@gmail.com`
- **Password:** `TestPassword123!`
- **Role:** `creator` (can be changed via backend)

---

## 📝 Notes

1. **First Time Setup:** These demo accounts need to be created in Firebase and the backend before they can be used.

2. **Creating Demo Accounts:**
   - Sign up through the respective login pages, OR
   - Use the backend API to create users programmatically

3. **Backend API:**
   - The backend will automatically create users in MongoDB when they first log in
   - Users are created with the role specified during signup/login

4. **Firebase Setup:**
   - All users must be created in Firebase Authentication first
   - The backend then syncs with Firebase to create MongoDB records

---

## 🚀 Quick Start

1. **Start the backend server:**
   ```bash
   cd backend
   go run main.go
   ```

2. **Start the frontend:**
   ```bash
   cd discovr-app-new
   npm run dev
   ```

3. **Create a demo account:**
   - Navigate to the appropriate login page
   - Click "Sign up" to create a new account
   - Or use the demo credentials if accounts are already created

4. **Login:**
   - Use the demo credentials shown on each login page
   - Or use the credentials listed above

---

## ⚠️ Important

- These are **demo/test credentials only**
- **DO NOT** use these in production
- Change all passwords before deploying to production
- Use strong, unique passwords for production accounts

---

## 🔐 Security Best Practices

1. Never commit real credentials to version control
2. Use environment variables for sensitive data
3. Implement proper password policies in production
4. Enable two-factor authentication for admin accounts
5. Regularly rotate passwords and tokens
