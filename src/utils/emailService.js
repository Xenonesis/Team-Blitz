import nodemailer from 'nodemailer';

// Email configuration
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER || 'your-email@gmail.com',
      pass: process.env.GMAIL_APP_PASSWORD || 'your-app-password'
    }
  });
};

// Generate round reminder email template
export const generateRoundReminderEmailTemplate = ({
  participantName,
  hackathon,
  roundInfo,
  previousRounds,
  daysAhead,
  isLeader
}) => {
  const urgencyColor = daysAhead === 1 ? '#ff6b6b' : '#4ecdc4';
  const urgencyText = daysAhead === 1 ? 'TOMORROW' : `IN ${daysAhead} DAYS`;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 650px; margin: 0 auto; background: #ffffff; }
        .header { background: linear-gradient(135deg, ${urgencyColor} 0%, #667eea 100%); color: white; padding: 40px 30px; text-align: center; }
        .urgency-badge { background: rgba(255,255,255,0.2); padding: 8px 16px; border-radius: 20px; display: inline-block; margin-bottom: 10px; font-weight: bold; }
        .content { padding: 30px; }
        .round-card { background: #f8f9fa; border-left: 5px solid ${urgencyColor}; padding: 25px; margin: 20px 0; border-radius: 8px; }
        .round-title { color: ${urgencyColor}; font-size: 24px; margin-bottom: 10px; font-weight: bold; }
        .round-date { background: ${urgencyColor}; color: white; padding: 10px 15px; border-radius: 5px; display: inline-block; margin: 10px 0; font-weight: bold; }
        .preparation-section { background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .tip-list { list-style: none; padding: 0; }
        .tip-list li { background: white; margin: 8px 0; padding: 12px; border-radius: 5px; border-left: 3px solid #4CAF50; }
        .previous-rounds { background: #f0f0f0; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .round-item { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #ddd; }
        .round-item:last-child { border-bottom: none; }
        .completed { color: #4CAF50; font-weight: bold; }
        .upcoming { color: #ff9800; font-weight: bold; }
        .hackathon-info { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .leader-badge { background: #ffd700; color: #333; padding: 5px 10px; border-radius: 15px; font-size: 12px; font-weight: bold; margin-left: 10px; }
        .footer { text-align: center; padding: 30px; background: #f8f9fa; color: #666; }
        .btn { display: inline-block; background: ${urgencyColor}; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; margin: 15px 0; font-weight: bold; transition: all 0.3s ease; }
        .btn:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0,0,0,0.2); }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin: 20px 0; }
        .stat-card { background: white; padding: 20px; border-radius: 8px; text-align: center; border: 2px solid #e0e0e0; }
        .stat-number { font-size: 28px; font-weight: bold; color: ${urgencyColor}; }
        .stat-label { color: #666; font-size: 14px; margin-top: 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="urgency-badge">${urgencyText}</div>
          <h1>🚀 ${roundInfo.name}</h1>
          <p>${hackathon.name}</p>
          ${isLeader ? '<span class="leader-badge">👑 TEAM LEADER</span>' : ''}
        </div>
        
        <div class="content">
          <h2>Hello ${participantName}! 👋</h2>
          <p>This is your <strong>${daysAhead}-day reminder</strong> for the upcoming round in ${hackathon.name}.</p>
          
          <div class="round-card">
            <div class="round-title">📅 ${roundInfo.name}</div>
            <p>${roundInfo.description}</p>
            <div class="round-date">📍 ${roundInfo.date.toLocaleDateString('en-IN', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</div>
          </div>
          
          ${roundInfo.preparationTips.length > 0 ? `
          <div class="preparation-section">
            <h3>🎯 Preparation Checklist</h3>
            <p>Here's what you should focus on for the ${roundInfo.name}:</p>
            <ul class="tip-list">
              ${roundInfo.preparationTips.map(tip => `<li>✅ ${tip}</li>`).join('')}
            </ul>
          </div>
          ` : ''}
          
          ${previousRounds.length > 0 ? `
          <div class="previous-rounds">
            <h3>📊 Previous Rounds Summary</h3>
            ${previousRounds.map(round => `
              <div class="round-item">
                <span>${round.name}</span>
                <span class="${round.completed ? 'completed' : 'upcoming'}">
                  ${round.completed ? '✅ Completed' : '⏳ Upcoming'}
                </span>
              </div>
            `).join('')}
          </div>
          ` : ''}
          
          <div class="hackathon-info">
            <h3>🏆 Hackathon Details</h3>
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-number">${hackathon.participants ? hackathon.participants.length : 0}</div>
                <div class="stat-label">Team Members</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">${daysAhead}</div>
                <div class="stat-label">Days to Round</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">${hackathon.status ? hackathon.status.toUpperCase() : 'ACTIVE'}</div>
                <div class="stat-label">Status</div>
              </div>
            </div>
            
            ${hackathon.leader ? `
            <p><strong>👑 Team Leader:</strong> ${hackathon.leader.name}</p>
            <p><strong>📧 Contact:</strong> ${hackathon.leader.email}</p>
            ` : ''}
            
            ${hackathon.location ? `<p><strong>📍 Location:</strong> ${hackathon.location}</p>` : ''}
            ${hackathon.prize ? `<p><strong>🏆 Prize:</strong> ${hackathon.prize}</p>` : ''}
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/live_hackthons" class="btn">
              🎯 View Dashboard
            </a>
          </div>
          
          ${isLeader ? `
          <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h4>👑 Leader Reminder</h4>
            <p>As the team leader, please ensure:</p>
            <ul>
              <li>All team members are prepared for the ${roundInfo.name}</li>
              <li>Coordinate team activities and responsibilities</li>
              <li>Review team progress and address any blockers</li>
              <li>Prepare for team presentation and demo</li>
            </ul>
          </div>
          ` : ''}
          
          <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h4>💡 Quick Tips</h4>
            <p><strong>Time Management:</strong> Use the remaining ${daysAhead} day${daysAhead > 1 ? 's' : ''} wisely to prepare thoroughly.</p>
            <p><strong>Team Coordination:</strong> Stay in touch with your team members and coordinate your efforts.</p>
            <p><strong>Resources:</strong> Make sure you have all necessary tools and resources ready.</p>
            <p><strong>Questions:</strong> Reach out to organizers if you have any questions or concerns.</p>
          </div>
        </div>
        
        <div class="footer">
          <p>🚀 <strong>${hackathon.name}</strong></p>
          <p>This is an automated reminder. Please do not reply to this email.</p>
          <p>Good luck with your ${roundInfo.name}! 🎯</p>
          <p style="font-size: 10px; color: #999; margin-top: 20px;">
            Sent on ${new Date().toLocaleDateString('en-IN', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              timeZone: 'Asia/Kolkata'
            })} at ${new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Email templates
export const emailTemplates = {
  dailyUpdate: (hackathon, participant, roundInfo) => ({
    subject: `🚀 Daily Update: ${hackathon.name} - Round ${roundInfo.currentRound}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .round-info { background: white; padding: 20px; margin: 20px 0; border-left: 4px solid #667eea; border-radius: 5px; }
          .progress-bar { background: #e0e0e0; height: 20px; border-radius: 10px; overflow: hidden; margin: 10px 0; }
          .progress-fill { background: linear-gradient(90deg, #4CAF50, #45a049); height: 100%; transition: width 0.3s ease; }
          .next-round { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 15px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          .btn { display: inline-block; background: #667eea; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
          .stats { display: flex; justify-content: space-around; margin: 20px 0; }
          .stat { text-align: center; }
          .stat-number { font-size: 24px; font-weight: bold; color: #667eea; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏆 ${hackathon.name}</h1>
            <p>Daily Progress Update</p>
          </div>
          
          <div class="content">
            <h2>Hello ${participant.name}! 👋</h2>
            <p>Here's your daily update for the hackathon progress:</p>
            
            <div class="round-info">
              <h3>📍 Current Round: ${roundInfo.currentRound}</h3>
              <p><strong>Status:</strong> ${roundInfo.status}</p>
              <p><strong>Description:</strong> ${roundInfo.description}</p>
              
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${roundInfo.progressPercent}%"></div>
              </div>
              <p>Progress: ${roundInfo.progressPercent}% (${hackathon.progress.completedTasks}/${hackathon.progress.totalTasks} tasks completed)</p>
            </div>
            
            <div class="stats">
              <div class="stat">
                <div class="stat-number">${roundInfo.daysRemaining}</div>
                <div>Days Left</div>
              </div>
              <div class="stat">
                <div class="stat-number">${hackathon.participants.length}</div>
                <div>Team Members</div>
              </div>
              <div class="stat">
                <div class="stat-number">${roundInfo.currentRoundNumber}/5</div>
                <div>Round Progress</div>
              </div>
            </div>
            
            ${roundInfo.nextRound ? `
              <div class="next-round">
                <h4>🔥 Next Round: ${roundInfo.nextRound.name}</h4>
                <p><strong>Date:</strong> ${roundInfo.nextRound.date}</p>
                <p><strong>Preparation needed:</strong> ${roundInfo.nextRound.description}</p>
              </div>
            ` : ''}
            
            <div style="margin: 25px 0;">
              <h4>📋 Round Dates Overview:</h4>
              <ul>
                ${Object.entries(hackathon.roundDates || {}).map(([round, date]) => 
                  `<li><strong>${round.toUpperCase()}:</strong> ${new Date(date).toLocaleDateString()}</li>`
                ).join('')}
              </ul>
            </div>
            
            <div style="margin: 25px 0;">
              <h4>👥 Team Information:</h4>
              <p><strong>Leader:</strong> ${hackathon.leader.name} (${hackathon.leader.email})</p>
              <p><strong>Your Role:</strong> ${participant.role}</p>
              <p><strong>Location:</strong> ${hackathon.location}</p>
              <p><strong>Prize:</strong> ${hackathon.prize}</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/live_hackthons" class="btn">
                View Dashboard 🚀
              </a>
            </div>
          </div>
          
          <div class="footer">
            <p>This is an automated daily update from Team Blitz Hackathon System</p>
            <p>Keep pushing forward! 💪</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  roundReminder: (hackathon, participant, roundInfo) => ({
    subject: `⏰ REMINDER: ${hackathon.name} - ${roundInfo.nextRound.name} Tomorrow!`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .urgent { background: #ffebee; border: 2px solid #f44336; padding: 20px; border-radius: 5px; margin: 20px 0; }
          .checklist { background: white; padding: 20px; margin: 20px 0; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⚠️ URGENT REMINDER</h1>
            <h2>${hackathon.name}</h2>
          </div>
          
          <div class="content">
            <div class="urgent">
              <h3>🚨 ${roundInfo.nextRound.name} is TOMORROW!</h3>
              <p><strong>Date:</strong> ${roundInfo.nextRound.date}</p>
              <p><strong>Time Remaining:</strong> Less than 24 hours!</p>
            </div>
            
            <h3>Hello ${participant.name},</h3>
            <p>This is your final reminder that <strong>${roundInfo.nextRound.name}</strong> is scheduled for tomorrow!</p>
            
            <div class="checklist">
              <h4>📝 Pre-Round Checklist:</h4>
              <ul>
                <li>✅ Review your project progress</li>
                <li>✅ Prepare your presentation materials</li>
                <li>✅ Test all technical components</li>
                <li>✅ Coordinate with team members</li>
                <li>✅ Get a good night's sleep</li>
              </ul>
            </div>
            
            <p><strong>Team Leader:</strong> ${hackathon.leader.name} (${hackathon.leader.email})</p>
            <p><strong>Location:</strong> ${hackathon.location}</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/live_hackthons" 
                 style="display: inline-block; background: #f44336; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px;">
                View Dashboard Now! 🚀
              </a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  })
};

// Send email function
export const sendEmail = async (to, subject, html) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"Team Blitz Hackathons" <${process.env.GMAIL_USER}>`,
      to: Array.isArray(to) ? to.join(', ') : to,
      subject,
      html
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${to}:`, result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

// Send bulk emails
export const sendBulkEmails = async (emailList) => {
  const results = [];
  
  for (const email of emailList) {
    try {
      const result = await sendEmail(email.to, email.subject, email.html);
      results.push({ ...email, ...result });
      
      // Add delay between emails to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      results.push({ ...email, success: false, error: error.message });
    }
  }
  
  return results;
};
