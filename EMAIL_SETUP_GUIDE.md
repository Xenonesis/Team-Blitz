# 📧 Email Setup Guide

## Gmail Configuration for Team Blitz

### Step 1: Enable Gmail App Password

1. **Go to Google Account Settings**
   - Visit: https://myaccount.google.com/
   - Click on "Security" in the left sidebar

2. **Enable 2-Factor Authentication** (Required)
   - Under "Signing in to Google", click "2-Step Verification"
   - Follow the setup process if not already enabled

3. **Generate App Password**
   - Go back to Security settings
   - Click "2-Step Verification"
   - Scroll down and click "App passwords"
   - Select "Mail" for app and "Other" for device
   - Name it "Team Blitz Hackathon"
   - Copy the 16-character password (format: xxxx xxxx xxxx xxxx)

### Step 2: Update Environment Variables

#### For Development (.env.local):
```env
GMAIL_USER=your-actual-email@gmail.com
GMAIL_APP_PASSWORD=your-16-character-app-password
```

#### For Production (.env.production):
```env
GMAIL_USER=your-production-email@gmail.com
GMAIL_APP_PASSWORD=your-production-16-character-app-password
```

### Step 3: Test Email Configuration

After updating the environment variables, test the email service:

1. **Restart your development server**
   ```bash
   npm run dev
   ```

2. **Test email endpoint**
   - Visit: http://localhost:3000/api/notifications/send
   - Or use the manual notification trigger

### Email Features in Your App

#### 1. **Round Reminders**
- Automatic emails 1-2 days before each hackathon round
- Personalized content with preparation tips
- Team leader gets additional responsibilities

#### 2. **Daily Updates**
- Progress tracking emails
- Team coordination information
- Next round preparation

#### 3. **Admin Notifications**
- System status updates
- Error notifications
- Performance reports

### Email Templates Available

1. **Round Reminder Email**
   - Urgency-based styling (red for tomorrow, blue for 2 days)
   - Preparation checklist
   - Team information
   - Progress tracking

2. **Daily Update Email**
   - Current round status
   - Progress percentage
   - Team statistics
   - Next round information

### Security Notes

- ✅ App passwords are more secure than regular passwords
- ✅ They can be revoked independently
- ✅ They don't expose your main Google password
- ✅ Each app gets its own unique password

### Troubleshooting

#### Common Issues:
1. **"Invalid credentials"** - Check app password format (no spaces)
2. **"Less secure app access"** - Use app password, not regular password
3. **Rate limiting** - Built-in delays between bulk emails

#### Testing Commands:
```bash
# Test email service
curl -X POST http://localhost:3000/api/notifications/send

# Check email configuration
curl http://localhost:3000/api/health
```

### Production Considerations

1. **Use a dedicated email account** for production
2. **Monitor email quotas** (Gmail: 500 emails/day for free accounts)
3. **Consider email service providers** like SendGrid for high volume
4. **Set up email monitoring** and delivery tracking

### Alternative Email Services

If you prefer not to use Gmail, you can configure:

#### SendGrid:
```env
EMAIL_SERVICE=sendgrid
SENDGRID_API_KEY=your-sendgrid-api-key
```

#### AWS SES:
```env
EMAIL_SERVICE=ses
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
```

The current implementation uses Gmail SMTP, which is perfect for getting started!