import dbConnect from '@/utils/dbConnect';
import Hackathon from '@/models/Hackathon';

/**
 * Find all expired hackathons in the database
 * A hackathon is considered expired if its endDate is before the current date
 */
export const findExpiredHackathons = async () => {
  try {
    await dbConnect();
    
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set to start of day for accurate comparison
    
    console.log(`🔍 Searching for expired hackathons before: ${currentDate.toISOString()}`);
    
    // Get all hackathons and filter expired ones
    const allHackathons = await Hackathon.find({});
    const expiredHackathons = allHackathons.filter(hackathon => {
      const endDate = typeof hackathon.endDate === 'string' ? new Date(hackathon.endDate) : hackathon.endDate;
      return endDate < currentDate;
    });
    
    console.log(`📊 Found ${expiredHackathons.length} expired hackathons`);
    
    return expiredHackathons;
  } catch (error) {
    console.error('❌ Error finding expired hackathons:', error);
    throw error;
  }
};

/**
 * Delete expired hackathons from the database
 * Returns statistics about the cleanup operation
 */
export const deleteExpiredHackathons = async (expiredHackathons) => {
  try {
    if (!expiredHackathons || expiredHackathons.length === 0) {
      console.log('✅ No expired hackathons to delete');
      return {
        deletedCount: 0,
        deletedHackathons: [],
        errors: []
      };
    }

    await dbConnect();
    
    const deletedHackathons = [];
    const errors = [];
    let deletedCount = 0;

    console.log(`🗑️ Starting deletion of ${expiredHackathons.length} expired hackathons...`);

    for (const hackathon of expiredHackathons) {
      try {
        // Ensure endDate is a Date object
        const endDate = typeof hackathon.endDate === 'string' ? new Date(hackathon.endDate) : hackathon.endDate;
        
        // Log hackathon details before deletion
        console.log(`🗑️ Deleting hackathon: ${hackathon.name} (ID: ${hackathon.id}) - Ended: ${endDate.toDateString()}`);
        
        // Delete the hackathon using Firebase method
        const deleteResult = await Hackathon.deleteMany({ id: hackathon.id });
        
        if (deleteResult.deletedCount > 0) {
          deletedHackathons.push({
            id: hackathon.id,
            name: hackathon.name,
            endDate: endDate,
            participantCount: hackathon.participants ? hackathon.participants.length : 0,
            leader: hackathon.leader ? hackathon.leader.name : 'Unknown'
          });
          deletedCount++;
          console.log(`✅ Successfully deleted: ${hackathon.name}`);
        } else {
          console.log(`⚠️ No document deleted for: ${hackathon.name}`);
        }
      } catch (error) {
        console.error(`❌ Error deleting hackathon ${hackathon.name}:`, error);
        errors.push({
          hackathonId: hackathon.id,
          hackathonName: hackathon.name,
          error: error.message
        });
      }
    }

    console.log(`🎯 Cleanup completed: ${deletedCount} hackathons deleted, ${errors.length} errors`);

    return {
      deletedCount,
      deletedHackathons,
      errors
    };
  } catch (error) {
    console.error('❌ Error in deleteExpiredHackathons:', error);
    throw error;
  }
};

/**
 * Complete cleanup process: find and delete expired hackathons
 * This is the main function called by the scheduler
 */
export const cleanupExpiredHackathons = async () => {
  const startTime = new Date();
  console.log(`\n🧹 ===============================================`);
  console.log(`🧹 HACKATHON CLEANUP PROCESS STARTED`);
  console.log(`🧹 Time: ${startTime.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST`);
  console.log(`🧹 ===============================================`);

  try {
    // Step 1: Find expired hackathons
    const expiredHackathons = await findExpiredHackathons();
    
    if (expiredHackathons.length === 0) {
      console.log('✅ No expired hackathons found. Database is clean!');
      return {
        success: true,
        message: 'No expired hackathons found',
        deletedCount: 0,
        deletedHackathons: [],
        errors: [],
        executionTime: new Date() - startTime
      };
    }

    // Step 2: Log details of hackathons to be deleted
    console.log(`\n📋 HACKATHONS TO BE DELETED:`);
    expiredHackathons.forEach((hackathon, index) => {
      const participantCount = hackathon.participants ? hackathon.participants.length : 0;
      const leaderName = hackathon.leader ? hackathon.leader.name : 'Unknown';
      const endDate = typeof hackathon.endDate === 'string' ? new Date(hackathon.endDate) : hackathon.endDate;
      console.log(`${index + 1}. ${hackathon.name}`);
      console.log(`   - ID: ${hackathon.id}`);
      console.log(`   - End Date: ${endDate.toDateString()}`);
      console.log(`   - Status: ${hackathon.status}`);
      console.log(`   - Participants: ${participantCount}`);
      console.log(`   - Leader: ${leaderName}`);
      console.log('');
    });

    // Step 3: Delete expired hackathons
    const cleanupResult = await deleteExpiredHackathons(expiredHackathons);
    
    // Step 4: Log final results
    const endTime = new Date();
    const executionTime = endTime - startTime;
    
    console.log(`\n🎯 ===============================================`);
    console.log(`🎯 CLEANUP PROCESS COMPLETED`);
    console.log(`🎯 Execution Time: ${executionTime}ms`);
    console.log(`🎯 Successfully Deleted: ${cleanupResult.deletedCount} hackathons`);
    console.log(`🎯 Errors: ${cleanupResult.errors.length}`);
    console.log(`🎯 End Time: ${endTime.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST`);
    console.log(`🎯 ===============================================\n`);

    // Log deleted hackathons summary
    if (cleanupResult.deletedHackathons.length > 0) {
      console.log(`📊 DELETED HACKATHONS SUMMARY:`);
      cleanupResult.deletedHackathons.forEach((hackathon, index) => {
        console.log(`${index + 1}. ${hackathon.name} (${hackathon.participantCount} participants)`);
      });
      console.log('');
    }

    // Log errors if any
    if (cleanupResult.errors.length > 0) {
      console.log(`❌ ERRORS DURING CLEANUP:`);
      cleanupResult.errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error.hackathonName}: ${error.error}`);
      });
      console.log('');
    }

    return {
      success: true,
      message: `Successfully cleaned up ${cleanupResult.deletedCount} expired hackathons`,
      deletedCount: cleanupResult.deletedCount,
      deletedHackathons: cleanupResult.deletedHackathons,
      errors: cleanupResult.errors,
      executionTime
    };

  } catch (error) {
    const endTime = new Date();
    const executionTime = endTime - startTime;
    
    console.error(`❌ ===============================================`);
    console.error(`❌ CLEANUP PROCESS FAILED`);
    console.error(`❌ Error: ${error.message}`);
    console.error(`❌ Execution Time: ${executionTime}ms`);
    console.error(`❌ End Time: ${endTime.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST`);
    console.error(`❌ ===============================================\n`);

    return {
      success: false,
      message: `Cleanup failed: ${error.message}`,
      deletedCount: 0,
      deletedHackathons: [],
      errors: [{ error: error.message }],
      executionTime
    };
  }
};

/**
 * Get cleanup statistics without performing actual cleanup
 * Useful for monitoring and reporting
 */
export const getCleanupStats = async () => {
  try {
    const expiredHackathons = await findExpiredHackathons();
    
    return {
      expiredCount: expiredHackathons.length,
      expiredHackathons: expiredHackathons.map(h => ({
        id: h.id,
        name: h.name,
        endDate: typeof h.endDate === 'string' ? new Date(h.endDate) : h.endDate,
        status: h.status,
        participantCount: h.participants ? h.participants.length : 0,
        leader: h.leader ? h.leader.name : 'Unknown'
      }))
    };
  } catch (error) {
    console.error('❌ Error getting cleanup stats:', error);
    throw error;
  }
};
