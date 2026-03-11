import cron from 'node-cron';
import { Op } from 'sequelize';
import User from './models/User.js';
import Assignment from './models/Assignment.js';
import StudySession from './models/StudySession.js';
import WebsiteTracking from './models/WebsiteTracking.js';
import { sendEmail, emailTemplates } from './email-service.js';

// Check for deadline reminders (runs every hour)
export function scheduleDeadlineReminders() {
  cron.schedule('0 * * * *', async () => {
    console.log('🔔 Checking for deadline reminders...');
    
    try {
      // Get all users with deadline reminders enabled
      const users = await User.findAll({
        where: { notify_deadline_reminders: true }
      });
      
      // Check assignments due in 24 hours
      const tomorrow = new Date();
      tomorrow.setHours(tomorrow.getHours() + 24);
      const dayAfterTomorrow = new Date();
      dayAfterTomorrow.setHours(dayAfterTomorrow.getHours() + 25);
      
      for (const user of users) {
        const assignments = await Assignment.findAll({
          where: {
            user_id: user.id,
            status: { [Op.in]: ['pending', 'in_progress'] },
            due_date: {
              [Op.gte]: tomorrow,
              [Op.lt]: dayAfterTomorrow
            }
          }
        });
        
        // Send reminder for each assignment
        for (const assignment of assignments) {
          const template = emailTemplates.deadlineReminder(user.name, assignment);
          await sendEmail(user.email, template);
        }
        
        if (assignments.length > 0) {
          console.log(`✅ Sent ${assignments.length} deadline reminder(s) to ${user.email}`);
        }
      }
    } catch (error) {
      console.error('❌ Deadline reminder error:', error);
    }
  });
  
  console.log('✅ Deadline reminder scheduler started (runs hourly)');
}

// Check for workload alerts (runs every day at 6 PM)
export function scheduleWorkloadAlerts() {
  cron.schedule('0 18 * * *', async () => {
    console.log('🔔 Checking for workload alerts...');
    
    try {
      // Get all users with workload alerts enabled
      const users = await User.findAll({
        where: { notify_workload_alerts: true }
      });
      
      // Check weekly study time
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      for (const user of users) {
        const sessions = await StudySession.findAll({
          where: {
            user_id: user.id,
            created_at: { [Op.gte]: sevenDaysAgo }
          }
        });
        
        const totalMinutes = sessions.reduce((sum, s) => sum + s.duration, 0);
        const totalHours = totalMinutes / 60;
        
        // Alert if over 50 hours per week
        if (totalHours > 50) {
          const template = emailTemplates.workloadAlert(user.name, totalHours, sessions.length);
          await sendEmail(user.email, template);
          console.log(`✅ Sent workload alert to ${user.email} (${totalHours.toFixed(1)}h)`);
        }
      }
    } catch (error) {
      console.error('❌ Workload alert error:', error);
    }
  });
  
  console.log('✅ Workload alert scheduler started (runs daily at 6 PM)');
}

// Send weekly summaries (runs every Sunday at 8 PM)
export function scheduleWeeklySummaries() {
  cron.schedule('0 20 * * 0', async () => {
    console.log('🔔 Sending weekly summaries...');
    
    try {
      // Get all users with weekly summary enabled
      const users = await User.findAll({
        where: { notify_weekly_summary: true }
      });
      
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      for (const user of users) {
        // Get study sessions
        const sessions = await StudySession.findAll({
          where: {
            user_id: user.id,
            created_at: { [Op.gte]: sevenDaysAgo }
          }
        });
        
        const totalMinutes = sessions.reduce((sum, s) => sum + s.duration, 0);
        const totalHours = (totalMinutes / 60).toFixed(1);
        
        // Get screen time
        const tracking = await WebsiteTracking.findAll({
          where: {
            user_id: user.id,
            visit_date: { [Op.gte]: sevenDaysAgo.toISOString().split('T')[0] }
          }
        });
        
        const totalSeconds = tracking.reduce((sum, t) => sum + t.time_spent, 0);
        const screenTime = (totalSeconds / 3600).toFixed(1);
        
        // Get completed assignments
        const completedAssignments = await Assignment.count({
          where: {
            user_id: user.id,
            status: 'completed',
            updated_at: { [Op.gte]: sevenDaysAgo }
          }
        });
        
        // Get upcoming deadlines
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        
        const upcomingDeadlines = await Assignment.count({
          where: {
            user_id: user.id,
            status: { [Op.in]: ['pending', 'in_progress'] },
            due_date: {
              [Op.gte]: new Date(),
              [Op.lte]: nextWeek
            }
          }
        });
        
        const stats = {
          totalStudyHours: totalHours,
          studySessions: sessions.length,
          screenTime,
          completedAssignments,
          upcomingDeadlines
        };
        
        const template = emailTemplates.weeklySummary(user.name, stats);
        await sendEmail(user.email, template);
        console.log(`✅ Sent weekly summary to ${user.email}`);
      }
    } catch (error) {
      console.error('❌ Weekly summary error:', error);
    }
  });
  
  console.log('✅ Weekly summary scheduler started (runs Sundays at 8 PM)');
}

// Initialize all schedulers
export function initializeSchedulers() {
  scheduleDeadlineReminders();
  scheduleWorkloadAlerts();
  scheduleWeeklySummaries();
  console.log('📅 All notification schedulers initialized');
}
