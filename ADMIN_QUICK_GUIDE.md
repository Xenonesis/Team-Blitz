# Admin Panel - Email Management Quick Guide

## 🚀 Quick Start

### Accessing the Admin Panel
1. Go to `/admin/login`
2. Login with your super admin credentials
3. You'll be redirected to the main admin panel

## 📋 Understanding the Dashboard

### Statistics (Top Section)
- **Registered Users**: Total users who have created accounts
- **Allowed Emails**: Total emails authorized to access the platform
- **Blocked Emails**: Total emails temporarily blocked from access

### Status Indicators
- 🟢 **REGISTERED**: User has an account and can access platform
- 🔵 **INVITED**: Email is allowed but user hasn't registered yet
- 🟢 **ALLOWED**: Email has platform access
- 🔴 **BLOCKED**: Email is temporarily blocked
- ⚫ **NO ACCESS**: User registered but doesn't have access

## ⚡ Common Tasks

### Adding New Users
1. **Add Email to Allowed List**:
   - Enter email in "Add New Email" form
   - Click "Add Email"
   - User can now register and access platform

### Managing Existing Users
1. **Grant Access to Registered User**:
   - Find user in "Registered Users" section
   - Click "Grant Access" for users with "NO ACCESS" status

2. **Block a User Temporarily**:
   - Find user in "Allowed Emails" or "Registered Users" section
   - Click "Block" button
   - User cannot login until unblocked

3. **Unblock a User**:
   - Find user in "Blocked Emails" section
   - Click "Unblock" button
   - User can login again

4. **Remove User Completely**:
   - Find user in "Allowed Emails" section
   - Click "Remove" button
   - User loses all access and cannot register again

### Password Management
- Use the "Password Management" section at bottom
- Can update passwords for any registered user
- Useful for helping users who forgot passwords

## 🔍 Monitoring Access

### Check Who Has Access
- **Allowed Emails Section**: Shows all emails that can access platform
- **Registered Users Section**: Shows actual users with accounts
- Look for status indicators to understand each user's situation

### Identify Issues
- Users with "NO ACCESS": Registered but not authorized
- Users with "INVITED": Authorized but haven't registered yet
- Users with "BLOCKED": Temporarily restricted

## ⚠️ Important Notes

### Security
- Only super admins can access this panel
- All changes are logged with your admin email
- Changes take effect immediately

### Best Practices
1. **Before Blocking**: Consider if temporary block or permanent removal is needed
2. **Communication**: Inform users when you change their access
3. **Documentation**: Keep track of why you blocked/removed users
4. **Regular Review**: Periodically review allowed emails list

### Troubleshooting
- **User Can't Register**: Check if their email is in allowed list
- **User Can't Login**: Check if they're blocked or have no access
- **Changes Not Working**: Refresh page and check again

## 📞 Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify your super admin status
3. Ensure stable internet connection
4. Contact technical support if problems persist

## 🎯 Quick Actions Checklist

**New Team Member**:
- [ ] Add their email to allowed list
- [ ] Inform them they can now register
- [ ] Verify they can access platform after registration

**Remove Team Member**:
- [ ] Decide: Block temporarily or Remove permanently
- [ ] Take appropriate action in admin panel
- [ ] Inform them of access change if needed

**User Having Login Issues**:
- [ ] Check their status in "Registered Users" section
- [ ] Verify they're not blocked
- [ ] Grant access if they have "NO ACCESS" status
- [ ] Help with password reset if needed