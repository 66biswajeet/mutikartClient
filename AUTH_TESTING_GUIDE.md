# Quick Start Guide - Authentication System

## 🚀 How to Test the Authentication Flow

### Prerequisites

1. Both servers must be running:

   ```powershell
   # From root directory
   .\start-servers.ps1
   ```

   OR run them separately:

   ```powershell
   # Terminal 1 - Admin (Port 3000)
   cd admin\multikart
   npm run dev

   # Terminal 2 - Client (Port 3001)
   cd client
   npm run dev
   ```

2. Ensure MongoDB is connected and accessible
3. Ensure SMTP settings are configured in admin `.env` for OTP emails

### Environment Setup

**Admin Panel** (`.env`):

```env
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

**Client** (`.env.local`):

```env
NEXT_PUBLIC_ADMIN_API_URL=http://localhost:3000
```

## 📋 Testing Steps

### Test 1: User Registration

1. Go to `http://localhost:3001`
2. Click "Sign In / Register" in the header
3. Click "Sign Up" link at the bottom
4. Fill in the form:
   - **Name**: John Doe
   - **Email**: john@example.com
   - **Password**: Test123! (must have uppercase, lowercase, number, symbol)
   - **Re-enter Password**: Test123!
5. Click "Register"
6. **Expected**: Email verification screen appears
7. Check your email for OTP code
8. Enter the OTP code
9. Click "Verify"
10. **Expected**: Success message, then redirect to home page

### Test 2: Login

1. Click "Sign In / Register" in the header
2. Enter credentials:
   - **Email**: john@example.com
   - **Password**: Test123!
3. Click "Log In"
4. **Expected**: Modal closes, header shows "Hello, John" with Logout button

### Test 3: Logout

1. Click the "Logout" button in the header
2. **Expected**: User logged out, header shows "Sign In / Register" again

### Test 4: Error Handling - Duplicate Email

1. Click "Sign In / Register"
2. Click "Sign Up"
3. Try to register with an existing email
4. **Expected**: Red error message "Email already registered"

### Test 5: Error Handling - Password Validation

1. Click "Sign In / Register"
2. Click "Sign Up"
3. Try different invalid passwords:
   - `test` → "Minimum 6 characters required"
   - `testtest` → "Must contain uppercase letter"
   - `TestTest` → "Must contain number"
   - `TestTest123` → "Must contain symbol"
4. **Expected**: Appropriate error messages appear below password field

### Test 6: Error Handling - Password Mismatch

1. Click "Sign In / Register"
2. Click "Sign Up"
3. Enter different passwords in Password and Re-enter Password fields
4. **Expected**: "Password mismatch" error below confirm password field

### Test 7: Error Handling - Invalid Login

1. Click "Sign In / Register"
2. Enter wrong credentials
3. Click "Log In"
4. **Expected**: "Invalid credentials" error message

### Test 8: OTP Resend

1. Go through registration flow
2. On email verification screen, don't enter OTP
3. Wait 5 seconds
4. Click "Resend verification code"
5. **Expected**: "OTP sent successfully" message, 60-second cooldown starts
6. Check email for new OTP

### Test 9: Invalid OTP

1. Go through registration flow
2. On email verification screen, enter wrong OTP (e.g., "12345")
3. Click "Verify"
4. **Expected**: "Invalid code!" error in red

### Test 10: Mobile Responsiveness

1. Open browser DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test on different screen sizes:
   - Mobile (375px)
   - Tablet (768px)
   - Desktop (1920px)
4. **Expected**: Modal adapts properly, slides up from bottom on mobile

## 🎨 Visual Checks

### Login Modal

- [ ] Modal has backdrop blur
- [ ] Close button (X) in top-right corner
- [ ] Email/Mobile input field
- [ ] Password field with eye icon
- [ ] "Forgot Password?" link
- [ ] Purple gradient "Log In" button
- [ ] "Not Registered? Sign Up" link at bottom

### Register Modal

- [ ] "Register with a new account" title
- [ ] Name input field
- [ ] Email input field
- [ ] Password field with eye icon
- [ ] Re-enter password field with eye icon
- [ ] Purple gradient "Register" button
- [ ] "Already Registered? Sign in" link at bottom

### Email Verification Modal

- [ ] Checkmark icon at top
- [ ] "Verify your email" title
- [ ] User email displayed in blue
- [ ] Large OTP input field (centered text)
- [ ] Purple gradient "Verify" button
- [ ] "Not received verification code? Resend" link
- [ ] Success/error messages display properly

### Header Changes

- [ ] Guest: Shows "Hello, Guest" with "Sign In / Register"
- [ ] Logged In: Shows "Hello, [FirstName]" with "Logout" button
- [ ] Logout button is red/pink themed

## 🐛 Common Issues & Solutions

### Issue: Modal doesn't open

**Solution**: Check browser console, ensure AuthProvider is wrapped in layout.js

### Issue: "Network Error" on login

**Solution**: Verify admin panel is running on port 3000

### Issue: OTP not received

**Solution**:

1. Check admin panel SMTP settings
2. Check spam/junk folder
3. Check admin console for email sending errors
4. Test with a different email provider

### Issue: "CORS Error"

**Solution**: Check `admin/multikart/vercel.json` CORS settings

### Issue: Registration successful but OTP screen doesn't appear

**Solution**: Check browser console, look for API response errors

### Issue: Can't read user cookie

**Solution**:

1. Check browser Application/Storage → Cookies
2. Verify `user` and `uat` cookies are set
3. Clear cookies and try again

## 📸 Screenshots to Verify

Take screenshots of:

1. ✅ Login modal with all fields
2. ✅ Register modal with validation errors shown
3. ✅ Email verification modal with OTP input
4. ✅ Header showing logged-in user name
5. ✅ Mobile view of auth modal (slides from bottom)
6. ✅ Error states (red borders, red text)
7. ✅ Success states (green messages)
8. ✅ Loading spinner in buttons

## 🔍 Debugging Tips

### Check Network Tab

1. Open DevTools → Network
2. Filter by "Fetch/XHR"
3. Look for these endpoints:
   - `/api/auth/login` → Should return 200 with user data
   - `/api/auth/register` → Should return 200 with user data
   - `/api/auth/verify-otp` → Should return 200 on success

### Check Console

Look for:

- ❌ No React errors
- ❌ No API call errors
- ✅ Successful API responses logged

### Check Cookies

1. DevTools → Application → Cookies → localhost:3001
2. Should see:
   - `uat` (httpOnly, secure)
   - `user` (contains user data JSON)

### Check Admin Logs

In admin terminal, you should see:

```
POST /api/auth/signin 200
POST /api/auth/signup 201
POST /api/auth/verify-token 200
```

## ✅ Final Verification Checklist

Before considering complete:

- [ ] All 10 test cases pass
- [ ] No console errors
- [ ] All visual elements match wireframe
- [ ] Mobile responsive works
- [ ] Loading states visible
- [ ] Error states clear and helpful
- [ ] Success redirects work
- [ ] Role-based redirects work
- [ ] Logout clears auth state
- [ ] OTP resend cooldown works

## 📞 Need Help?

If tests fail:

1. Check this guide's "Common Issues & Solutions"
2. Review `AUTH_IMPLEMENTATION.md` for architecture details
3. Check browser DevTools console and network tabs
4. Verify environment variables are set correctly
5. Restart both servers with `.\start-servers.ps1`
