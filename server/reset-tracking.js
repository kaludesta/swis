import sequelize from './config/database.js';
import WebsiteTracking from './models/WebsiteTracking.js';

async function resetTracking() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to database');
    
    // Delete all tracking data for user 2 (or specify different user)
    const userId = 2; // Change this if needed
    
    const deleted = await WebsiteTracking.destroy({
      where: { user_id: userId }
    });
    
    console.log(`✅ Deleted ${deleted} tracking records for user ${userId}`);
    console.log('🔄 Tracking data has been reset. The extension will start fresh.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

resetTracking();
