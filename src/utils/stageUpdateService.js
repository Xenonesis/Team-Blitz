import dbConnect from '@/utils/dbConnect';
import Hackathon from '@/models/Hackathon';

// Function to determine current stage based on dates
const determineCurrentStage = (roundDates) => {
  if (!roundDates || typeof roundDates !== 'object') {
    return 'ppt'; // Default stage
  }

  const now = new Date();
  now.setHours(0, 0, 0, 0); // Set to start of day for accurate comparison

  // Define stage order and their corresponding date keys
  const stageOrder = [
    { stage: 'ppt', dateKey: 'ppt' },
    { stage: 'round1', dateKey: 'round1' },
    { stage: 'round2', dateKey: 'round2' },
    { stage: 'semifinal', dateKey: 'semifinal' },
    { stage: 'final', dateKey: 'final' }
  ];

  let currentStage = 'ppt'; // Default to first stage

  // Find the current stage based on dates
  for (let i = 0; i < stageOrder.length; i++) {
    const { stage, dateKey } = stageOrder[i];
    const stageDate = roundDates[dateKey];

    if (stageDate) {
      const stageDateObj = new Date(stageDate);
      stageDateObj.setHours(0, 0, 0, 0);

      // If current date is on or after this stage date, update current stage
      if (now >= stageDateObj) {
        currentStage = stage;
      } else {
        // If we haven't reached this stage date yet, break
        break;
      }
    }
  }

  return currentStage;
};

// Main function to update all hackathon stages
export const updateHackathonStages = async () => {
  const startTime = new Date();
  console.log(`\n🔄 ===============================================`);
  console.log(`🔄 STAGE UPDATE CHECK STARTED`);
  console.log(`🔄 Time: ${startTime.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST`);
  console.log(`🔄 ===============================================`);

  try {
    await dbConnect();
    
    // Get all active and upcoming hackathons
    const hackathons = await Hackathon.find({
      status: { $in: ['active', 'upcoming'] }
    });

    console.log(`🔍 Found ${hackathons.length} active/upcoming hackathons to check`);

    let updatedCount = 0;
    const updateResults = [];

    for (const hackathon of hackathons) {
      try {
        console.log(`\n🏆 Checking hackathon: ${hackathon.name}`);
        console.log(`📅 Current stage: ${hackathon.currentStage}`);

        if (!hackathon.roundDates) {
          console.log(`⚠️ No round dates found for ${hackathon.name}, skipping`);
          continue;
        }

        // Determine what the current stage should be
        const newStage = determineCurrentStage(hackathon.roundDates);
        console.log(`🎯 Calculated stage: ${newStage}`);

        // Update if stage has changed
        if (hackathon.currentStage !== newStage) {
          console.log(`🔄 Updating stage from "${hackathon.currentStage}" to "${newStage}"`);
          
          await Hackathon.findByIdAndUpdate(
            hackathon._id,
            { currentStage: newStage },
            { new: true }
          );

          updatedCount++;
          updateResults.push({
            hackathonName: hackathon.name,
            oldStage: hackathon.currentStage,
            newStage: newStage,
            updated: true
          });

          console.log(`✅ Successfully updated ${hackathon.name} to stage: ${newStage}`);
        } else {
          console.log(`✓ Stage is already correct for ${hackathon.name}`);
          updateResults.push({
            hackathonName: hackathon.name,
            currentStage: hackathon.currentStage,
            updated: false
          });
        }

      } catch (error) {
        console.error(`❌ Error updating hackathon ${hackathon.name}:`, error.message);
        updateResults.push({
          hackathonName: hackathon.name,
          error: error.message,
          updated: false
        });
      }
    }

    const endTime = new Date();
    const duration = endTime - startTime;

    console.log(`\n📊 ===============================================`);
    console.log(`📊 STAGE UPDATE SUMMARY`);
    console.log(`📊 Total hackathons checked: ${hackathons.length}`);
    console.log(`📊 Stages updated: ${updatedCount}`);
    console.log(`📊 Duration: ${duration}ms`);
    console.log(`📊 Completed at: ${endTime.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST`);
    console.log(`📊 ===============================================\n`);

    return {
      success: true,
      totalChecked: hackathons.length,
      totalUpdated: updatedCount,
      duration: duration,
      results: updateResults,
      timestamp: endTime
    };

  } catch (error) {
    const endTime = new Date();
    const duration = endTime - startTime;

    console.error(`❌ ===============================================`);
    console.error(`❌ STAGE UPDATE FAILED`);
    console.error(`❌ Error: ${error.message}`);
    console.error(`❌ Duration: ${duration}ms`);
    console.error(`❌ Failed at: ${endTime.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST`);
    console.error(`❌ ===============================================\n`);

    return {
      success: false,
      error: error.message,
      duration: duration,
      timestamp: endTime
    };
  }
};

// Helper function to get stage information for a specific hackathon
export const getHackathonStageInfo = (hackathon) => {
  if (!hackathon.roundDates) {
    return {
      currentStage: hackathon.currentStage,
      calculatedStage: 'ppt',
      isCorrect: hackathon.currentStage === 'ppt'
    };
  }

  const calculatedStage = determineCurrentStage(hackathon.roundDates);
  
  return {
    currentStage: hackathon.currentStage,
    calculatedStage: calculatedStage,
    isCorrect: hackathon.currentStage === calculatedStage,
    roundDates: hackathon.roundDates
  };
};
