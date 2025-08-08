# 📧 Email Notification System Setup - Team Blitz

This document explains how to set up and use the automated email notification system for hackathon participants.

## 🚀 Quick Setup

### 1. Gmail Configuration

#### Create App Password
1. Go to your Google Account settings
2. Navigate to Security → 2-Step Verification
3. Scroll down to "App passwords"
4. Generate a new app password for "Mail"
5. Copy the 16-character password

#### Update Environment Variables
Add these to your `.env` file:

```env
# Email Configuration
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-character-app-password

# Optional: Base URL for email links
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 2. Start the System

#### Development Mode
```bash
npm run dev
```

#### Initialize Scheduler (Manual)
Visit your admin dashboard at `/live_hackthons` and use the "Initialize Scheduler" button, or call:

```bash
curl -X POST http://localhost:3000/api/scheduler/init \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 📅 Automated Schedule

### Daily Notifications
- **Time:** 8:00 AM IST (Indian Standard Time)
- **Recipients:** All hackathon participants + leaders
- **Content:** 
  - Current round status
  - Progress updates
  - Days remaining
  - Team information
  - Round dates overview

### Evening Reminders
- **Time:** 6:00 PM IST
- **Trigger:** Only when next round is tomorrow
- **Content:**
  - Urgent reminder for next day's round
  - Preparation checklist
  - Team coordination info

### Database Cleanup
- **Time:** 2:00 AM IST (Daily)
- **Purpose:** Automatically delete expired hackathons
- **Criteria:** Hackathons with endDate before current date
- **Process:**
  - Finds all hackathons past their end date
  - Logs details of hackathons to be deleted
  - Removes expired hackathons from database
  - Provides detailed cleanup statistics

## 📧 Email Templates

### Daily Update Email Features
- **Personalized greeting** with participant name
- **Current round information** with progress bar
- **Team statistics** (days left, members, progress)
- **Next round preparation** details
- **Complete round dates** overview
- **Team leader contact** information
- **Direct dashboard link**

### Reminder Email Features
- **Urgent styling** for attention
- **24-hour countdown** warning
- **Pre-round checklist** items
- **Team coordination** details
- **Direct action buttons**

## 🛠️ Admin Dashboard Features

### Notification Manager Panel
Access via `/live_hackthons` (admin only):

1. **System Status Overview**
   - Scheduler active/inactive status
   - Total active hackathons
   - Total email recipients

2. **Manual Controls**
   - Send immediate notifications
   - View last send results
   - Initialize scheduler

3. **Database Cleanup Panel**
   - View expired hackathons ready for deletion
   - Manual cleanup trigger
   - Cleanup statistics and status
   - Next scheduled cleanup time

4. **Hackathon Details**
   - Per-hackathon participant counts
   - Email recipient verification
   - Current stage tracking

## 🔧 API Endpoints

### Notification Management
- `POST /api/notifications/send` - Send manual notifications
- `GET /api/notifications/status` - Get system status
- `POST /api/scheduler/init` - Initialize scheduler
- `GET /api/scheduler/init` - Check scheduler status

### Database Cleanup Management
- `POST /api/cleanup/manual` - Trigger manual cleanup
- `GET /api/cleanup/status` - Get cleanup status and expired hackathons list

### Example API Usage

#### Send Manual Notification
```javascript
const response = await fetch('/api/notifications/send', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${adminToken}`,
  }
});
```

#### Check System Status
```javascript
const response = await fetch('/api/notifications/status', {
  headers: {
    'Authorization': `Bearer ${adminToken}`,
  }
});
```

#### Trigger Manual Cleanup
```javascript
const response = await fetch('/api/cleanup/manual', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${adminToken}`,
  }
});
```

#### Check Cleanup Status
```javascript
const response = await fetch('/api/cleanup/status', {
  headers: {
    'Authorization': `Bearer ${adminToken}`,
  }
});
```

## 📊 Email Content Details

### Information Included in Each Email

#### Hackathon Details
- Hackathon name and description
- Current stage and status
- Progress percentage
- Days remaining until end
- Prize information
- Location details

#### Team Information
- Team leader name and contact
- Participant role
- Total team member count
- Individual participant details

#### Round Information
- All round dates (PPT, Round 1, Round 2, Semifinal, Final)
- Current round description
- Next round preparation requirements
- Stage progression tracking

#### Interactive Elements
- Direct link to dashboard
- Responsive HTML design
- Progress bars and statistics
- Status badges and indicators

## 🔍 Troubleshooting

### Common Issues

#### 1. Emails Not Sending
**Symptoms:** No emails received, API errors
**Solutions:**
- Verify Gmail credentials in `.env`
- Check app password is correct (16 characters)
- Ensure 2-factor authentication is enabled
- Verify Gmail account allows app passwords

#### 2. Scheduler Not Running
**Symptoms:** No automatic emails at scheduled times
**Solutions:**
- Check server logs for initialization
- Use manual scheduler init API
- Verify timezone settings (Asia/Kolkata)
- Restart the application

#### 3. Missing Participant Emails
**Symptoms:** Some team members not receiving emails
**Solutions:**
- Verify participant email addresses in database
- Check for duplicate emails (system filters them)
- Ensure hackathon status is 'active' or 'upcoming'
- Verify participants are properly added to hackathon

#### 4. Email Formatting Issues
**Symptoms:** Broken HTML, missing styles
**Solutions:**
- Check email client compatibility
- Verify BASE_URL environment variable
- Test with different email providers
- Check for HTML template errors

### Debug Commands

#### Check Email Configuration
```bash
# Test email sending (manual trigger)
curl -X POST http://localhost:3000/api/notifications/send \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Verify Scheduler Status
```bash
curl -X GET http://localhost:3000/api/scheduler/init \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Check Notification Status
```bash
curl -X GET http://localhost:3000/api/notifications/status \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🎯 Best Practices

### Email Management
1. **Test thoroughly** before production deployment
2. **Monitor send rates** to avoid Gmail limits
3. **Keep participant emails updated** in the system
4. **Use meaningful subject lines** for better open rates
5. **Include unsubscribe options** for compliance

### System Administration
1. **Regular monitoring** of scheduler status
2. **Backup email configurations** securely
3. **Monitor email delivery rates** and failures
4. **Keep participant lists current**
5. **Test manual triggers** regularly

### Security Considerations
1. **Never commit** email credentials to version control
2. **Use app passwords** instead of account passwords
3. **Rotate credentials** periodically
4. **Monitor unauthorized access** attempts
5. **Implement rate limiting** for API endpoints

## 📈 Performance Metrics

### Email Delivery Stats
- **Send success rate** tracking
- **Delivery time** monitoring
- **Bounce rate** analysis
- **Open rate** tracking (if analytics added)

### System Performance
- **Scheduler reliability** monitoring
- **API response times** tracking
- **Database query performance**
- **Memory usage** optimization

## 🔮 Future Enhancements

### Planned Features
- [ ] Email analytics and tracking
- [ ] Custom email templates per hackathon
- [ ] SMS notifications integration
- [ ] Slack/Discord webhook support
- [ ] Participant email preferences
- [ ] A/B testing for email content
- [ ] Automated follow-up sequences
- [ ] Integration with calendar systems

### Advanced Configurations
- [ ] Multiple timezone support
- [ ] Custom scheduling per hackathon
- [ ] Email template editor
- [ ] Bulk import/export of participants
- [ ] Email campaign management
- [ ] Advanced filtering and segmentation

---

## 📞 Support

For issues or questions about the email notification system:

1. Check this documentation first
2. Review server logs for errors
3. Test with manual triggers
4. Verify environment configuration
5. Contact system administrator

**🎉 Your automated hackathon notification system is ready to keep your team informed and engaged!**
