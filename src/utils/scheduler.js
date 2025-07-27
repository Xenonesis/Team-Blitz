import cron from 'node-cron';
import dbConnect from '@/utils/dbConnect';
import Hackathon from '@/models/Hackathon';
import { sendBulkEmails, emailTemplates, generateRoundReminderEmailTemplate } from '@/utils/emailService';
import { cleanupExpiredHackathons } from './cleanupService.js';
import { updateHackathonStages } from './stageUpdateService.js';

let schedulerInitialized = false;
let dailyJob = null;
let eveningJob = null;
let cleanupJob = null;
let stageUpdateJob = null;

// Main function to check and send round reminders
const checkAndSendRoundReminders = async () => {
  const startTime = new Date();
  console.log(`\n📅 ===============================================`);
  console.log(`📅 ROUND REMINDER CHECK STARTED`);
  console.log(`📅 Time: ${startTime.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST`);
  console.log(`📅 ===============================================`);

  try {
    await dbConnect();
    
    // Get all active and upcoming hackathons
    const hackathons = await Hackathon.find({
      status: { $in: ['active', 'upcoming'] }
    });

    console.log(`🔍 Found ${hackathons.length} active/upcoming hackathons`);

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day
    
    const twoDaysFromNow = new Date(today);
    twoDaysFromNow.setDate(today.getDate() + 2);
    
    const oneDayFromNow = new Date(today);
    oneDayFromNow.setDate(today.getDate() + 1);

    console.log(`📆 Today: ${today.toDateString()}`);
    console.log(`📆 Checking for rounds on: ${oneDayFromNow.toDateString()} (1 day ahead)`);
    console.log(`📆 Checking for rounds on: ${twoDaysFromNow.toDateString()} (2 days ahead)`);

    let totalEmailsSent = 0;
    const emailResults = [];

    for (const hackathon of hackathons) {
      console.log(`\n🏆 Processing hackathon: ${hackathon.name}`);
      
      if (!hackathon.roundDates) {
        console.log(`⚠️ No round dates found for ${hackathon.name}`);
        continue;
      }

      const rounds = ['ppt', 'round1', 'round2', 'semifinal', 'final'];
      
      for (const roundKey of rounds) {
        const roundDateStr = hackathon.roundDates[roundKey];
        if (!roundDateStr) continue;

        const roundDate = new Date(roundDateStr);
        roundDate.setHours(0, 0, 0, 0);

        // Check if round is exactly 1 or 2 days from now
        const isOneDayAhead = roundDate.getTime() === oneDayFromNow.getTime();
        const isTwoDaysAhead = roundDate.getTime() === twoDaysFromNow.getTime();

        if (isOneDayAhead || isTwoDaysAhead) {
          const daysAhead = isOneDayAhead ? 1 : 2;
          console.log(`🎯 Found round '${roundKey}' for ${hackathon.name} in ${daysAhead} day(s)`);
          console.log(`📅 Round date: ${roundDate.toDateString()}`);

          // Generate and send emails for this round
          const emailsSent = await sendRoundReminderEmails(hackathon, roundKey, roundDate, daysAhead);
          totalEmailsSent += emailsSent;
          
          emailResults.push({
            hackathonName: hackathon.name,
            round: roundKey,
            roundDate: roundDate.toDateString(),
            daysAhead,
            emailsSent
          });
        }
      }
    }

    const endTime = new Date();
    const executionTime = endTime - startTime;

    console.log(`\n📊 ===============================================`);
    console.log(`📊 ROUND REMINDER CHECK COMPLETED`);
    console.log(`📊 Total emails sent: ${totalEmailsSent}`);
    console.log(`📊 Execution time: ${executionTime}ms`);
    console.log(`📊 End time: ${endTime.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST`);
    console.log(`📊 ===============================================\n`);

    if (emailResults.length > 0) {
      console.log(`📧 EMAIL SUMMARY:`);
      emailResults.forEach((result, index) => {
        console.log(`${index + 1}. ${result.hackathonName} - ${result.round} (${result.daysAhead} day${result.daysAhead > 1 ? 's' : ''} ahead): ${result.emailsSent} emails`);
      });
      console.log('');
    } else {
      console.log(`✅ No round reminders needed today`);
    }

    return {
      success: true,
      totalEmailsSent,
      emailResults,
      executionTime
    };

  } catch (error) {
    const endTime = new Date();
    const executionTime = endTime - startTime;
    
    console.error(`❌ ===============================================`);
    console.error(`❌ ROUND REMINDER CHECK FAILED`);
    console.error(`❌ Error: ${error.message}`);
    console.error(`❌ Execution time: ${executionTime}ms`);
    console.error(`❌ End time: ${endTime.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST`);
    console.error(`❌ ===============================================\n`);

    return {
      success: false,
      error: error.message,
      executionTime
    };
  }
};

// Function to send round reminder emails
const sendRoundReminderEmails = async (hackathon, roundKey, roundDate, daysAhead) => {
  try {
    console.log(`📧 Preparing emails for ${hackathon.name} - ${roundKey} round`);
    
    // Get all participants (including leader)
    const allParticipants = [...hackathon.participants];
    if (hackathon.leader && !allParticipants.find(p => p.email === hackathon.leader.email)) {
      allParticipants.push(hackathon.leader);
    }

    console.log(`👥 Found ${allParticipants.length} participants for ${hackathon.name}`);

    // Generate round information
    const roundInfo = getRoundDetails(roundKey, roundDate, daysAhead);
    const previousRounds = getPreviousRoundsInfo(hackathon, roundKey);
    
    // Create emails for all participants
    const emails = [];
    const uniqueEmails = new Set();

    for (const participant of allParticipants) {
      if (!participant.email || uniqueEmails.has(participant.email)) {
        continue; // Skip invalid or duplicate emails
      }
      
      uniqueEmails.add(participant.email);
      
      const emailData = {
        to: participant.email,
        subject: `🚀 ${roundInfo.name} - ${daysAhead} Day${daysAhead > 1 ? 's' : ''} Reminder | ${hackathon.name}`,
        html: generateRoundReminderEmailTemplate({
          participantName: participant.name,
          hackathon,
          roundInfo,
          previousRounds,
          daysAhead,
          isLeader: hackathon.leader && hackathon.leader.email === participant.email
        })
      };
      
      emails.push(emailData);
    }

    console.log(`📨 Sending ${emails.length} round reminder emails`);
    
    if (emails.length > 0) {
      await sendBulkEmails(emails);
      console.log(`✅ Successfully sent ${emails.length} emails for ${hackathon.name} - ${roundKey}`);
    }
    
    return emails.length;
    
  } catch (error) {
    console.error(`❌ Error sending round reminder emails for ${hackathon.name}:`, error);
    return 0;
  }
};

// Helper function to get round details
const getRoundDetails = (roundKey, roundDate, daysAhead) => {
  const roundNames = {
    ppt: 'PPT Presentation',
    round1: 'Round 1 - Prototype Development',
    round2: 'Round 2 - Advanced Development',
    semifinal: 'Semifinal Round',
    final: 'Final Presentation'
  };

  const roundDescriptions = {
    ppt: 'Present your project idea, concept, and initial planning. Focus on clarity and innovation.',
    round1: 'Develop your initial prototype with core features. Demonstrate basic functionality.',
    round2: 'Implement advanced features and improvements. Show significant progress from Round 1.',
    semifinal: 'Final testing, bug fixes, and presentation preparation. Polish your project.',
    final: 'Final presentation and judging. Showcase your complete project and achievements.'
  };

  const preparationTips = {
    ppt: [
      'Prepare a clear and engaging presentation',
      'Define your problem statement and solution',
      'Create mockups or wireframes if possible',
      'Practice your pitch timing',
      'Prepare for Q&A session'
    ],
    round1: [
      'Set up your development environment',
      'Implement core features first',
      'Focus on functionality over design',
      'Document your progress',
      'Test basic user flows'
    ],
    round2: [
      'Add advanced features and integrations',
      'Improve user interface and experience',
      'Implement error handling',
      'Optimize performance',
      'Prepare demo scenarios'
    ],
    semifinal: [
      'Conduct thorough testing',
      'Fix critical bugs and issues',
      'Prepare comprehensive demo',
      'Create presentation materials',
      'Practice final presentation'
    ],
    final: [
      'Finalize all features and fixes',
      'Prepare compelling presentation',
      'Create project documentation',
      'Practice demo multiple times',
      'Prepare for technical questions'
    ]
  };

  return {
    key: roundKey,
    name: roundNames[roundKey] || roundKey.toUpperCase(),
    description: roundDescriptions[roundKey] || 'Important hackathon round',
    date: roundDate,
    daysAhead,
    preparationTips: preparationTips[roundKey] || []
  };
};

// Helper function to get previous rounds information
const getPreviousRoundsInfo = (hackathon, currentRoundKey) => {
  const rounds = ['ppt', 'round1', 'round2', 'semifinal', 'final'];
  const currentIndex = rounds.indexOf(currentRoundKey);
  const previousRounds = [];

  for (let i = 0; i < currentIndex; i++) {
    const roundKey = rounds[i];
    const roundDateStr = hackathon.roundDates?.[roundKey];
    
    if (roundDateStr) {
      const roundDate = new Date(roundDateStr);
      const today = new Date();
      
      previousRounds.push({
        key: roundKey,
        name: getRoundDetails(roundKey, roundDate, 0).name,
        date: roundDate,
        completed: roundDate < today
      });
    }
  }

  return previousRounds;
};

// Helper function to get round information
const getRoundInfo = (hackathon) => {
  const stages = ['ppt', 'round1', 'round2', 'semifinal', 'final'];
  const currentStageIndex = stages.indexOf(hackathon.currentStage);
  const nextStageIndex = currentStageIndex + 1;
  
  const today = new Date();
  const endDate = new Date(hackathon.endDate);
  const daysRemaining = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
  
  const progressPercent = Math.round(
    (hackathon.progress.completedTasks / hackathon.progress.totalTasks) * 100
  );

  const stageNames = {
    ppt: 'PPT Presentation',
    round1: 'Round 1 - Prototype',
    round2: 'Round 2 - Development',
    semifinal: 'Semifinal',
    final: 'Final Round'
  };

  const stageDescriptions = {
    ppt: 'Present your project idea and concept',
    round1: 'Develop initial prototype and core features',
    round2: 'Implement advanced features and improvements',
    semifinal: 'Final testing and presentation preparation',
    final: 'Final presentation and judging'
  };

  let nextRound = null;
  if (nextStageIndex < stages.length) {
    const nextStage = stages[nextStageIndex];
    const nextDate = hackathon.roundDates?.[nextStage];
    
    if (nextDate) {
      nextRound = {
        name: stageNames[nextStage],
        date: new Date(nextDate).toLocaleDateString(),
        description: stageDescriptions[nextStage]
      };
    }
  }

  return {
    currentRound: stageNames[hackathon.currentStage] || hackathon.currentStage,
    currentRoundNumber: currentStageIndex + 1,
    status: hackathon.status,
    description: stageDescriptions[hackathon.currentStage] || 'Current round in progress',
    daysRemaining: Math.max(0, daysRemaining),
    progressPercent,
    nextRound
  };
};

// Check if tomorrow is a round date
const isTomorrowRoundDate = (hackathon) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];
  
  if (!hackathon.roundDates) return false;
  
  return Object.values(hackathon.roundDates).some(date => {
    const roundDate = new Date(date).toISOString().split('T')[0];
    return roundDate === tomorrowStr;
  });
};

// Generate emails for a hackathon
const generateHackathonEmails = (hackathon, isReminder = false) => {
  const emails = [];
  const roundInfo = getRoundInfo(hackathon);
  
  // Get all participants (including leader)
  const allParticipants = [hackathon.leader, ...hackathon.participants];
  
  // Remove duplicates based on email
  const uniqueParticipants = allParticipants.filter((participant, index, self) => 
    index === self.findIndex(p => p.email === participant.email)
  );

  for (const participant of uniqueParticipants) {
    if (!participant.email) continue;
    
    const template = isReminder 
      ? emailTemplates.roundReminder(hackathon, participant, roundInfo)
      : emailTemplates.dailyUpdate(hackathon, participant, roundInfo);
    
    emails.push({
      to: participant.email,
      subject: template.subject,
      html: template.html,
      hackathonId: hackathon.id,
      participantName: participant.name,
      type: isReminder ? 'reminder' : 'daily_update'
    });
  }
  
  return emails;
};

// Main notification function
export const sendDailyNotifications = async () => {
  try {
    console.log('🕐 Starting daily notification scheduler...');
    await dbConnect();
    
    // Get all active hackathons
    const hackathons = await Hackathon.find({
      status: { $in: ['active', 'upcoming'] }
    });
    
    if (hackathons.length === 0) {
      console.log('📭 No active hackathons found');
      return { success: true, message: 'No active hackathons' };
    }
    
    console.log(`📧 Found ${hackathons.length} active hackathons`);
    
    let allEmails = [];
    let reminderEmails = [];
    
    for (const hackathon of hackathons) {
      // Generate daily update emails
      const dailyEmails = generateHackathonEmails(hackathon, false);
      allEmails = allEmails.concat(dailyEmails);
      
      // Check if tomorrow is a round date for reminder emails
      if (isTomorrowRoundDate(hackathon)) {
        const reminders = generateHackathonEmails(hackathon, true);
        reminderEmails = reminderEmails.concat(reminders);
        console.log(`⚠️ Tomorrow is a round date for ${hackathon.name} - sending reminders`);
      }
    }
    
    // Send all emails
    const totalEmails = allEmails.concat(reminderEmails);
    console.log(`📨 Sending ${totalEmails.length} emails...`);
    
    const results = await sendBulkEmails(totalEmails);
    
    // Log results
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    
    console.log(`✅ Successfully sent: ${successful} emails`);
    console.log(`❌ Failed to send: ${failed} emails`);
    
    if (failed > 0) {
      console.log('Failed emails:', results.filter(r => !r.success));
    }
    
    return {
      success: true,
      totalSent: successful,
      totalFailed: failed,
      details: results
    };
    
  } catch (error) {
    console.error('❌ Error in daily notification scheduler:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Initialize scheduler
export const initializeScheduler = () => {
  console.log('🚀 Initializing email notification scheduler...');
  
  // Daily round reminder check at midnight
  dailyJob = cron.schedule('0 0 * * *', async () => {
    console.log('🌌 Running daily round reminder check at midnight');
    await checkAndSendRoundReminders();
  }, {
    scheduled: true,
    timezone: "Asia/Kolkata"
  });
  
  // Daily cleanup at 2:00 AM to delete expired hackathons
  cleanupJob = cron.schedule('0 2 * * *', async () => {
    console.log('🧹 Running daily cleanup job at 2:00 AM');
    try {
      const result = await cleanupExpiredHackathons();
      if (result.success) {
        console.log(`✅ Cleanup completed: ${result.deletedCount} hackathons deleted`);
      } else {
        console.error('❌ Cleanup failed:', result.message);
      }
    } catch (error) {
      console.error('❌ Error in cleanup job:', error);
    }
  }, {
    scheduled: true,
    timezone: "Asia/Kolkata"
  });
  
  // Stage update job every 6 hours
  stageUpdateJob = cron.schedule('0 */6 * * *', async () => {
    console.log('🔄 Running stage update job every 6 hours');
    try {
      const result = await updateHackathonStages();
      if (result.success) {
        console.log(`✅ Stage update completed: ${result.totalUpdated} hackathons updated`);
      } else {
        console.error('❌ Stage update failed:', result.error);
      }
    } catch (error) {
      console.error('❌ Error in stage update job:', error);
    }
  }, {
    scheduled: true,
    timezone: "Asia/Kolkata"
  });
  
  schedulerInitialized = true;
  console.log('✅ Email scheduler initialized successfully!');
  console.log('🌌 Round reminders: Midnight IST (1-2 days before rounds)');
  console.log('🧹 Daily cleanup: 2:00 AM IST');
  console.log('🔄 Stage updates: Every 6 hours IST');
};

// Manual trigger function for testing round reminders
export const triggerManualNotification = async () => {
  console.log('🔧 Manual round reminder check activated');
  return await checkAndSendRoundReminders();
};

// Manual cleanup trigger function for testing
export const triggerManualCleanup = async () => {
  console.log('🧹 Manual cleanup trigger activated');
  return await cleanupExpiredHackathons();
};

// Manual stage update trigger function for testing
export const triggerManualStageUpdate = async () => {
  console.log('🔄 Manual stage update trigger activated');
  return await updateHackathonStages();
};

// Get scheduler status including cleanup job
export const getSchedulerStatus = () => {
  return {
    initialized: schedulerInitialized,
    jobs: {
      dailyNotifications: dailyJob ? 'active' : 'inactive',
      eveningReminders: eveningJob ? 'active' : 'inactive',
      dailyCleanup: cleanupJob ? 'active' : 'inactive',
      stageUpdates: stageUpdateJob ? 'active' : 'inactive'
    },
    schedules: {
      roundReminders: 'Midnight IST (1-2 days before rounds)',
      dailyCleanup: '2:00 AM IST',
      stageUpdates: 'Every 6 hours IST'
    }
  };
};

// Stop all scheduler jobs
export const stopScheduler = () => {
  if (dailyJob) {
    dailyJob.stop();
    dailyJob = null;
  }
  if (eveningJob) {
    eveningJob.stop();
    eveningJob = null;
  }
  if (cleanupJob) {
    cleanupJob.stop();
    cleanupJob = null;
  }
  if (stageUpdateJob) {
    stageUpdateJob.stop();
    stageUpdateJob = null;
  }
  schedulerInitialized = false;
  console.log('⚙️ All scheduler jobs stopped');
};
