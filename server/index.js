import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import sequelize from './config/database.js';
import User from './models/User.js';
import WebsiteTracking from './models/WebsiteTracking.js';
import StudySession from './models/StudySession.js';
import Assignment from './models/Assignment.js';
import { Op } from 'sequelize';
import ical from 'node-ical';
import https from 'https';
import { predictProductivity, getRecommendations, calculateBurnoutRisk, analyzeStudyPattern } from './ml-insights.js';
import { testEmailConfig } from './email-service.js';
import { initializeSchedulers } from './notification-scheduler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Root route for testing
app.get('/', (req, res) => {
  res.json({ message: 'SWIS Backend API is running', status: 'ok' });
});

// Simple API test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API route works!', timestamp: new Date().toISOString() });
});

// Health check - moved here for testing
app.get('/api/health', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ 
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.json({ 
      status: 'error',
      database: 'disconnected',
      timestamp: new Date().toISOString()
    });
  }
});

// Database connection and sync
async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to PostgreSQL');
    console.log(`📊 Database: ${sequelize.config.database}`);
    
    // Sync models (create tables if they don't exist)
    await sequelize.sync({ alter: true });
    console.log('✅ Database tables synchronized');
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    console.log('💡 Make sure PostgreSQL is running');
    console.log('   Default: postgresql://postgres:postgres@localhost:5432/academic_dashboard');
    console.log('   Or set DATABASE_URL environment variable');
  }
}

// Auth endpoints
app.post('/api/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await User.create({
      email,
      password_hash: hashedPassword,
      name
    });
    
    console.log(`✅ New user registered: ${email}`);
    res.json({ success: true, userId: user.id });
  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const validPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    console.log(`✅ User logged in: ${email}`);
    res.json({ 
      success: true, 
      userId: user.id,
      name: user.name,
      email: user.email
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Tracking endpoints
app.post('/api/tracking', async (req, res) => {
  try {
    const { user_id, domain, url, title, time_spent, visit_date } = req.body;
    
    console.log(`📊 Tracking data received:`, { user_id, domain, time_spent, visit_date });
    
    // Find existing record or create new one
    const [record, created] = await WebsiteTracking.findOrCreate({
      where: {
        user_id,
        domain,
        visit_date
      },
      defaults: {
        url,
        title,
        time_spent
      }
    });
    
    if (!created) {
      // Update existing record
      record.time_spent += time_spent;
      record.url = url;
      record.title = title;
      record.last_updated = new Date();
      await record.save();
      console.log(`✅ Updated tracking for ${domain}: +${time_spent}s (total: ${record.time_spent}s)`);
    } else {
      console.log(`✅ New tracking record for ${domain}: ${time_spent}s`);
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('❌ Tracking error:', error);
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/tracking/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate } = req.query;
    
    const where = { user_id: userId };
    
    if (startDate || endDate) {
      where.visit_date = {};
      if (startDate) where.visit_date[Op.gte] = startDate;
      if (endDate) where.visit_date[Op.lte] = endDate;
    }
    
    const data = await WebsiteTracking.findAll({
      where,
      order: [['visit_date', 'DESC'], ['time_spent', 'DESC']]
    });
    
    console.log(`✅ Retrieved ${data.length} tracking records for user ${userId}`);
    res.json(data);
  } catch (error) {
    console.error('❌ Get tracking error:', error);
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/tracking/:userId/top', async (req, res) => {
  try {
    const { userId } = req.params;
    const limit = parseInt(req.query.limit) || 10;
    const { startDate, endDate } = req.query;
    
    // Build where clause with optional date filtering
    const where = { user_id: userId };
    if (startDate || endDate) {
      where.visit_date = {};
      if (startDate) where.visit_date[Op.gte] = startDate;
      if (endDate) where.visit_date[Op.lte] = endDate;
    }
    
    const data = await WebsiteTracking.findAll({
      attributes: [
        'domain',
        [sequelize.fn('SUM', sequelize.col('time_spent')), 'total_time'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'visit_count']
      ],
      where,
      group: ['domain'],
      order: [[sequelize.fn('SUM', sequelize.col('time_spent')), 'DESC']],
      limit,
      raw: true
    });
    
    // Convert string values to numbers
    const formattedData = data.map(item => ({
      domain: item.domain,
      total_time: parseInt(item.total_time),
      visit_count: parseInt(item.visit_count)
    }));
    
    console.log(`✅ Retrieved top ${formattedData.length} sites for user ${userId}`);
    res.json(formattedData);
  } catch (error) {
    console.error('❌ Get top sites error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Study session endpoints
app.post('/api/study-sessions', async (req, res) => {
  try {
    const { user_id, subject, duration, notes } = req.body;
    
    const session = await StudySession.create({
      user_id,
      subject,
      duration,
      notes
    });
    
    console.log(`✅ Study session created: ${subject} (${duration} min)`);
    res.json({ success: true, sessionId: session.id });
  } catch (error) {
    console.error('❌ Study session error:', error);
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/study-sessions/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const sessions = await StudySession.findAll({
      where: { user_id: userId },
      order: [['created_at', 'DESC']]
    });
    
    res.json(sessions);
  } catch (error) {
    console.error('❌ Get study sessions error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Assignment endpoints
app.post('/api/assignments', async (req, res) => {
  try {
    const { user_id, title, description, due_date, priority } = req.body;
    
    const assignment = await Assignment.create({
      user_id,
      title,
      description,
      due_date,
      priority
    });
    
    console.log(`✅ Assignment created: ${title}`);
    res.json({ success: true, assignmentId: assignment.id });
  } catch (error) {
    console.error('❌ Assignment error:', error);
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/assignments/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const assignments = await Assignment.findAll({
      where: { user_id: userId },
      order: [['due_date', 'ASC']]
    });
    
    res.json(assignments);
  } catch (error) {
    console.error('❌ Get assignments error:', error);
    res.status(400).json({ error: error.message });
  }
});

app.patch('/api/assignments/:assignmentId', async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const updates = req.body;
    
    const assignment = await Assignment.findByPk(assignmentId);
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }
    
    await assignment.update(updates);
    
    console.log(`✅ Assignment updated: ${assignment.title}`);
    res.json({ success: true, assignment });
  } catch (error) {
    console.error('❌ Update assignment error:', error);
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/assignments/:assignmentId', async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const assignment = await Assignment.findByPk(assignmentId);
    
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }
    
    await assignment.destroy();
    
    console.log(`✅ Assignment deleted: ${assignmentId}`);
    res.json({ success: true });
  } catch (error) {
    console.error('❌ Delete assignment error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Blackboard Calendar Integration
app.post('/api/user/:userId/calendar-url', async (req, res) => {
  try {
    const { userId } = req.params;
    const { calendarUrl } = req.body;
    
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    user.blackboard_calendar_url = calendarUrl;
    await user.save();
    
    console.log(`✅ Calendar URL saved for user ${userId}`);
    res.json({ success: true });
  } catch (error) {
    console.error('❌ Save calendar URL error:', error);
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/user/:userId/calendar-url', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ 
      calendarUrl: user.blackboard_calendar_url,
      lastSync: user.last_calendar_sync
    });
  } catch (error) {
    console.error('❌ Get calendar URL error:', error);
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/user/:userId/sync-calendar', async (req, res) => {
  try {
    const { userId } = req.params;
    const { replaceAll } = req.body || {}; // Handle empty body
    const user = await User.findByPk(userId);
    
    if (!user || !user.blackboard_calendar_url) {
      return res.status(400).json({ error: 'No calendar URL configured' });
    }
    
    console.log(`🔄 Syncing Blackboard calendar for user ${userId}...`);
    console.log(`📡 Fetching calendar from: ${user.blackboard_calendar_url}`);
    
    // If replaceAll flag is set, delete all existing Blackboard assignments for this user
    if (replaceAll) {
      const deletedCount = await Assignment.destroy({
        where: {
          user_id: userId,
          source: 'blackboard'
        }
      });
      console.log(`🗑️ Deleted ${deletedCount} old Blackboard assignments`);
    }
    
    // Fetch and parse iCal feed
    let events;
    try {
      events = await ical.async.fromURL(user.blackboard_calendar_url);
    } catch (fetchError) {
      console.error('❌ Failed to fetch calendar:', fetchError.message);
      return res.status(400).json({ 
        error: `Failed to fetch calendar: ${fetchError.message}. Please check the URL is correct.` 
      });
    }
    
    // Check if calendar is empty
    const eventCount = Object.values(events).filter(e => e.type === 'VEVENT').length;
    if (eventCount === 0) {
      console.log('⚠️ Calendar is empty - no events found');
      
      // If replaceAll was used, this is a problem - we deleted old assignments but have nothing new
      if (replaceAll) {
        return res.status(400).json({ 
          error: 'Cannot replace assignments: The new calendar is empty. No assignments found. Please check if you have assignments in Blackboard or if the calendar URL is correct.'
        });
      }
      
      return res.status(200).json({ 
        success: true,
        synced: 0,
        new: 0,
        updated: 0,
        removed: 0,
        message: 'Calendar is empty. No assignments found. Please check if you have assignments in Blackboard or if the calendar URL is correct.',
        lastSync: new Date()
      });
    }
    
    let syncedCount = 0;
    let newCount = 0;
    let updatedCount = 0;
    
    // Get all current Blackboard IDs from the calendar
    const currentBlackboardIds = new Set();
    
    for (const event of Object.values(events)) {
      if (event.type === 'VEVENT') {
        const title = event.summary || 'Untitled Assignment';
        const dueDate = event.end || event.start;
        const description = event.description || '';
        const location = event.location || '';
        const blackboardId = event.uid;
        
        currentBlackboardIds.add(blackboardId);
        
        // Extract course name from location or summary
        let courseName = location;
        if (!courseName && title.includes('-')) {
          courseName = title.split('-')[0].trim();
        }
        
        // Check if assignment already exists
        const existing = await Assignment.findOne({
          where: { 
            blackboard_id: blackboardId,
            user_id: userId
          }
        });
        
        if (!existing) {
          try {
            await Assignment.create({
              user_id: userId,
              title,
              description,
              due_date: dueDate,
              status: 'pending',
              priority: 'medium',
              source: 'blackboard',
              blackboard_id: blackboardId,
              course_name: courseName
            });
            newCount++;
          } catch (createError) {
            // If duplicate key error, skip this assignment
            if (createError.name === 'SequelizeUniqueConstraintError') {
              console.log(`⚠️ Skipping duplicate assignment: ${blackboardId}`);
            } else {
              throw createError;
            }
          }
        } else {
          // Update existing assignment
          existing.title = title;
          existing.description = description;
          existing.due_date = dueDate;
          existing.course_name = courseName;
          await existing.save();
          updatedCount++;
        }
        syncedCount++;
      }
    }
    
    // Delete assignments that are no longer in the calendar (removed from Blackboard)
    const allUserBlackboardAssignments = await Assignment.findAll({
      where: {
        user_id: userId,
        source: 'blackboard'
      }
    });
    
    let removedCount = 0;
    for (const assignment of allUserBlackboardAssignments) {
      if (!currentBlackboardIds.has(assignment.blackboard_id)) {
        await assignment.destroy();
        removedCount++;
      }
    }
    
    // Update last sync time
    user.last_calendar_sync = new Date();
    await user.save();
    
    console.log(`✅ Synced ${syncedCount} assignments (${newCount} new, ${updatedCount} updated, ${removedCount} removed) from Blackboard`);
    res.json({ 
      success: true, 
      synced: syncedCount,
      new: newCount,
      updated: updatedCount,
      removed: removedCount,
      lastSync: user.last_calendar_sync
    });
  } catch (error) {
    console.error('❌ Calendar sync error:', error);
    res.status(400).json({ error: error.message });
  }
});

// User Settings Endpoints

// Get user preferences
app.get('/api/user/:userId/preferences', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      notifications: {
        deadlineReminders: user.notify_deadline_reminders,
        workloadAlerts: user.notify_workload_alerts,
        weeklySummary: user.notify_weekly_summary
      },
      privacy: {
        dataCollection: user.privacy_data_collection,
        analytics: user.privacy_analytics,
        emailNotifications: user.privacy_email_notifications
      }
    });
  } catch (error) {
    console.error('❌ Get preferences error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Update user preferences
app.patch('/api/user/:userId/preferences', async (req, res) => {
  try {
    const { userId } = req.params;
    const { notifications, privacy } = req.body;
    
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Update notification preferences
    if (notifications) {
      if (notifications.deadlineReminders !== undefined) {
        user.notify_deadline_reminders = notifications.deadlineReminders;
      }
      if (notifications.workloadAlerts !== undefined) {
        user.notify_workload_alerts = notifications.workloadAlerts;
      }
      if (notifications.weeklySummary !== undefined) {
        user.notify_weekly_summary = notifications.weeklySummary;
      }
    }
    
    // Update privacy preferences
    if (privacy) {
      if (privacy.dataCollection !== undefined) {
        user.privacy_data_collection = privacy.dataCollection;
      }
      if (privacy.analytics !== undefined) {
        user.privacy_analytics = privacy.analytics;
      }
      if (privacy.emailNotifications !== undefined) {
        user.privacy_email_notifications = privacy.emailNotifications;
      }
    }
    
    await user.save();
    
    console.log(`✅ Updated preferences for user ${userId}`);
    res.json({ success: true });
  } catch (error) {
    console.error('❌ Update preferences error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Change password
app.post('/api/user/:userId/change-password', async (req, res) => {
  try {
    const { userId } = req.params;
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new password are required' });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters' });
    }
    
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Verify current password
    const validPassword = await bcrypt.compare(currentPassword, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }
    
    // Hash and save new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password_hash = hashedPassword;
    await user.save();
    
    console.log(`✅ Password changed for user ${userId}`);
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error('❌ Change password error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Delete account
app.delete('/api/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({ error: 'Password is required to delete account' });
    }
    
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Verify password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Incorrect password' });
    }
    
    // Delete all user data
    await WebsiteTracking.destroy({ where: { user_id: userId } });
    await StudySession.destroy({ where: { user_id: userId } });
    await Assignment.destroy({ where: { user_id: userId } });
    await user.destroy();
    
    console.log(`✅ Account deleted for user ${userId}`);
    res.json({ success: true, message: 'Account deleted successfully' });
  } catch (error) {
    console.error('❌ Delete account error:', error);
    res.status(400).json({ error: error.message });
  }
});

// ML Insights endpoint
app.post('/api/ml/insights/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Get user's tracking data (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const tracking = await WebsiteTracking.findAll({
      where: { 
        user_id: userId,
        visit_date: { [Op.gte]: sevenDaysAgo.toISOString().split('T')[0] }
      }
    });
    
    // Get study sessions (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const sessions = await StudySession.findAll({
      where: { 
        user_id: userId,
        created_at: { [Op.gte]: thirtyDaysAgo }
      },
      order: [['created_at', 'DESC']]
    });
    
    // Get pending assignments
    const assignments = await Assignment.findAll({
      where: { 
        user_id: userId,
        status: { [Op.in]: ['pending', 'in_progress'] }
      }
    });
    
    // Calculate metrics
    const totalScreenTime = tracking.reduce((sum, t) => sum + t.time_spent, 0) / 3600; // hours
    const avgStudyHours = sessions.length > 0 
      ? sessions.reduce((sum, s) => sum + s.duration, 0) / sessions.length / 60 
      : 3; // Default 3 hours
    
    // Estimate metrics (can be enhanced with actual tracking)
    const estimatedSleep = 7; // Default
    const socialMediaHours = totalScreenTime * 0.4; // Estimate from screen time
    const gamingHours = totalScreenTime * 0.2;
    const otherScreenTime = totalScreenTime * 0.4;
    const focusScore = Math.min(100, avgStudyHours * 12); // Simple estimation
    
    // Get ML predictions
    const productivity = predictProductivity(
      avgStudyHours,
      estimatedSleep,
      socialMediaHours + gamingHours + otherScreenTime,
      focusScore
    );
    
    const recommendations = getRecommendations(
      avgStudyHours,
      estimatedSleep,
      socialMediaHours,
      gamingHours,
      otherScreenTime,
      focusScore
    );
    
    const burnoutRisk = calculateBurnoutRisk(
      avgStudyHours,
      estimatedSleep,
      socialMediaHours + gamingHours,
      assignments.length
    );
    
    const studyPattern = analyzeStudyPattern(sessions);
    
    console.log(`✅ Generated ML insights for user ${userId}`);
    
    res.json({
      productivity,
      recommendations,
      burnoutRisk,
      studyPattern,
      metrics: {
        avgStudyHours: avgStudyHours.toFixed(1),
        totalScreenTime: totalScreenTime.toFixed(1),
        upcomingDeadlines: assignments.length,
        studySessions: sessions.length,
        estimatedSleep: estimatedSleep.toFixed(1),
        focusScore: focusScore.toFixed(1)
      }
    });
    
  } catch (error) {
    console.error('❌ ML insights error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Debug endpoint to see all tracking data
app.get('/api/debug/tracking/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const data = await WebsiteTracking.findAll({
      where: { user_id: userId },
      order: [['visit_date', 'DESC']]
    });
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Initialize database and start server
initializeDatabase().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🚀 Server running on http://0.0.0.0:${PORT}`);
    console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
    console.log(`🔍 Health check: http://localhost:${PORT}/api/health\n`);
    
    // Test email configuration
    testEmailConfig().then(isReady => {
      if (isReady) {
        // Initialize notification schedulers
        initializeSchedulers();
      } else {
        console.log('⚠️ Email not configured. Notifications will not be sent.');
        console.log('💡 To enable email notifications, add EMAIL_USER and EMAIL_PASSWORD to .env file');
      }
    });
  });
});
