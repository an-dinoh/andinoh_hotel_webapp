# 🧪 UI Test Guide - Hotel Registration Flow

## 📋 Test Credentials

Use these random test credentials:

```
Hotel Name: Grand Test Hotel
Email: testhotel2025@example.com
Password: Test123456!
Hotel Address: 123 Main Street, Test City
Hotel License Number: LIC20251024
```

---

## ✅ Step-by-Step UI Test

### **Step 1: Access Registration Page**

1. Open your browser
2. Go to: `http://localhost:3001/register`
3. ✅ **Verify:** Registration form loads with all fields

---

### **Step 2: Fill Registration Form**

Fill in the following fields:

| Field | Value |
|-------|-------|
| **Hotel Name** | Grand Test Hotel |
| **Hotel Address** | 123 Main Street, Test City |
| **Hotel License Number** | LIC20251024 |
| **Official Email** | testhotel2025@example.com |
| **Password** | Test123456! |
| **Confirm Password** | Test123456! |

**What to check:**
- ✅ Password strength indicator appears (should show strong)
- ✅ No validation errors
- ✅ All fields accept input

---

### **Step 3: Submit Registration**

1. Click **"Register Hotel"** button
2. ✅ **Verify:** Button shows "Loading..." with spinner
3. ⏳ **Wait:** First request may take 30-60 seconds (API cold start)

**Expected behavior:**
- Button is disabled while loading
- Loading spinner appears
- Console logs show API request (press F12 to see)

**Console logs you should see:**
```
🚀 API Request: POST /auth/api/auth/register
📦 Request data: {email: "...", password: "...", ...}
✅ API Response: 200 /auth/api/auth/register
```

---

### **Step 4: Handle Success/Errors**

**✅ If Successful:**
- You'll be redirected to: `http://localhost:3001/dashboard`
- Dashboard loads with stats
- Sidebar shows navigation

**❌ If Error Occurs:**

1. **"Network error"** message appears
   - **Cause:** API is still waking up
   - **Solution:** Wait 30 seconds and click "Register Hotel" again

2. **"Email already exists"** error
   - **Cause:** Email was already used
   - **Solution:** Change email to: `testhotel2025b@example.com`

3. **Other validation errors**
   - Check console (F12) for details
   - Verify all required fields are filled

---

### **Step 5: Verify Dashboard**

Once redirected to dashboard (`/dashboard`):

**Check these elements:**

1. ✅ **Header:** "Dashboard" title visible
2. ✅ **Sidebar:** Navigation menu on the left
3. ✅ **Stat Cards:** 6 stat cards showing:
   - Today's Check-Ins
   - Today's Check-Outs
   - New Bookings Today
   - Occupancy Rate
   - Revenue (Today)
   - Total Guests

4. ✅ **Recent Bookings:** Table at the bottom (may be empty)
5. ✅ **Active Navigation:** Dashboard menu item is highlighted

---

### **Step 6: Test Navigation**

Click on each sidebar menu item to verify pages load:

| Menu Item | URL | Expected Page |
|-----------|-----|---------------|
| Dashboard | /dashboard | Stats and recent bookings |
| My Hotel | /my_hotel | Hotel profile (create form) |
| Rooms | /rooms | Rooms list (empty initially) |
| Bookings | /bookings | Bookings list (empty initially) |
| Staff | /staff | Staff list (empty initially) |
| Analytics | /analytics | Analytics placeholder |
| Settings | /settings | Settings tabs |

**What to check:**
- ✅ All pages load without errors
- ✅ Active menu item is highlighted
- ✅ No console errors
- ✅ Pages are responsive

---

### **Step 7: Create Hotel Profile**

1. Click **"My Hotel"** in sidebar
2. You should see a form to create hotel profile
3. Fill in hotel details:
   - Hotel Name: Grand Test Hotel
   - Hotel Type: Luxury (dropdown)
   - Star Rating: 5 Stars
   - Total Rooms: 50
   - Description: "A luxurious test hotel"
   - Address: 123 Main Street
   - City: Test City
   - State: Test State
   - Country: Test Country
   - Postal Code: 12345
   - Phone: +1234567890
   - Email: info@testhotel.com
   - Check-in Time: 15:00
   - Check-out Time: 11:00

4. Click **"Save Changes"**
5. ✅ **Verify:** Success message appears
6. ✅ **Verify:** Page refreshes showing hotel info (not edit mode)

---

### **Step 8: Test Logout**

1. Scroll to bottom of sidebar
2. Click **"Logout"** button
3. ✅ **Verify:** Redirected to `/login`
4. ✅ **Verify:** localStorage is cleared (check DevTools → Application → Local Storage)

---

### **Step 9: Test Login**

1. On login page, enter:
   - Email: testhotel2025@example.com
   - Password: Test123456!
2. Click **"Sign In"**
3. ✅ **Verify:** Redirected to dashboard
4. ✅ **Verify:** Token saved in localStorage

---

## 🐛 Common Issues & Solutions

### Issue 1: Network Error on Registration
**Symptom:** "Network error. The API server might be unreachable..."

**Solution:**
1. Wait 60 seconds
2. Try again
3. Check console for detailed error

### Issue 2: Registration Button Stuck Loading
**Symptom:** Button shows "Loading..." forever

**Solution:**
1. Refresh page
2. Wait for API to fully wake up
3. Try registration again

### Issue 3: CORS Error in Console
**Symptom:** Console shows "CORS policy blocked"

**Solution:**
- This is a backend issue
- Contact backend developer to add `http://localhost:3001` to CORS allowed origins

### Issue 4: 404 Error When Creating Hotel
**Symptom:** "Failed to save hotel information"

**Solution:**
- Check console logs
- Verify you're logged in (token in localStorage)
- Try logging out and back in

---

## 📊 What to Screenshot/Report

If testing, capture these:

1. ✅ Registration form filled out
2. ✅ Dashboard with stats
3. ✅ My Hotel page (edit mode and view mode)
4. ✅ All sidebar pages loaded
5. ❌ Any errors in console (F12 → Console tab)
6. ❌ Any network errors (F12 → Network tab)

---

## ✅ Expected Results

After completing all steps, you should have:

- ✅ Successfully registered a hotel account
- ✅ Logged in and reached dashboard
- ✅ Created hotel profile
- ✅ Navigated to all pages
- ✅ Logged out successfully
- ✅ Logged back in successfully
- ✅ No console errors (except maybe API warnings)

---

## 🎯 Success Criteria

**✅ PASS if:**
- Registration works (even after retry)
- Dashboard loads with stats
- All pages accessible
- Hotel profile can be created
- Logout/Login works

**❌ FAIL if:**
- Cannot register after multiple attempts
- Dashboard doesn't load
- Pages show errors
- Cannot create hotel profile
- Logout doesn't work

---

## 🚀 Ready to Test!

**Start here:** `http://localhost:3001/register`

**Remember:**
- First API request takes 30-60 seconds
- Just retry if you get "Network error"
- Check browser console (F12) for detailed logs

**Good luck with testing!** 🎉
