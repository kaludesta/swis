import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Email templates
export const emailTemplates = {
  deadlineReminder: (userName, assignment) => ({
    subject: `⏰ Reminder: ${assignment.title} due tomorrow`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Assignment Deadline Reminder</h2>
        <p>Hi ${userName},</p>
        <p>This is a friendly reminder that your assignment is due soon:</p>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #1f2937;">${assignment.title}</h3>
          ${assignment.course_name ? `<p style="margin: 5px 0;"><strong>Course:</strong> ${assignment.course_name}</p>` : ''}
          <p style="margin: 5px 0;"><strong>Due:</strong> ${new Date(assignment.due_date).toLocaleString()}</p>
          <p style="margin: 5px 0;"><strong>Priority:</strong> <span style="color: ${assignment.priority === 'high' ? '#dc2626' : assignment.priority === 'medium' ? '#f59e0b' : '#10b981'};">${assignment.priority}</span></p>
          ${assignment.description ? `<p style="margin: 10px 0 0 0;">${assignment.description}</p>` : ''}
        </div>
        <p>Good luck with your assignment!</p>
        <p style="color: #6b7280; font-size: 12px; margin-top: 30px;">
          You're receiving this because you enabled deadline reminders in your SWIS settings.
        </p>
      </div>
    `
  }),

  workloadAlert: (userName, weeklyHours, studySessions) => ({
    subject: '⚠️ High Workload Alert - Take Care of Yourself',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #f59e0b;">Workload Alert</h2>
        <p>Hi ${userName},</p>
        <p>We noticed your weekly workload is quite high:</p>
        <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
          <h3 style="margin: 0 0 10px 0; color: #92400e;">Weekly Study Time: ${weeklyHours.toFixed(1)} hours</h3>
          <p style="margin: 5px 0;">Total sessions: ${studySessions}</p>
        </div>
        <p><strong>Remember to:</strong></p>
        <ul style="color: #374151;">
          <li>Take regular breaks (Pomodoro technique: 25min work, 5min break)</li>
          <li>Get 7-9 hours of sleep</li>
          <li>Stay hydrated and eat well</li>
          <li>Take time for physical activity</li>
          <li>Reach out for support if feeling overwhelmed</li>
        </ul>
        <p>Your health and wellbeing are important. Consider adjusting your schedule if possible.</p>
        <p style="color: #6b7280; font-size: 12px; margin-top: 30px;">
          You're receiving this because you enabled workload alerts in your SWIS settings.
        </p>
      </div>
    `
  }),

  weeklySummary: (userName, stats) => ({
    subject: '📊 Your Weekly Productivity Summary',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Weekly Summary</h2>
        <p>Hi ${userName},</p>
        <p>Here's your productivity summary for the past week:</p>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 15px 0; color: #1f2937;">Study Statistics</h3>
          <div style="display: grid; gap: 10px;">
            <div style="background: white; padding: 15px; border-radius: 6px;">
              <p style="margin: 0; color: #6b7280; font-size: 14px;">Total Study Time</p>
              <p style="margin: 5px 0 0 0; font-size: 24px; font-weight: bold; color: #2563eb;">${stats.totalStudyHours}h</p>
            </div>
            <div style="background: white; padding: 15px; border-radius: 6px;">
              <p style="margin: 0; color: #6b7280; font-size: 14px;">Study Sessions</p>
              <p style="margin: 5px 0 0 0; font-size: 24px; font-weight: bold; color: #7c3aed;">${stats.studySessions}</p>
            </div>
            <div style="background: white; padding: 15px; border-radius: 6px;">
              <p style="margin: 0; color: #6b7280; font-size: 14px;">Screen Time</p>
              <p style="margin: 5px 0 0 0; font-size: 24px; font-weight: bold; color: #10b981;">${stats.screenTime}h</p>
            </div>
            <div style="background: white; padding: 15px; border-radius: 6px;">
              <p style="margin: 0; color: #6b7280; font-size: 14px;">Assignments Completed</p>
              <p style="margin: 5px 0 0 0; font-size: 24px; font-weight: bold; color: #16a34a;">${stats.completedAssignments}</p>
            </div>
          </div>
        </div>

        ${stats.upcomingDeadlines > 0 ? `
        <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
          <p style="margin: 0; font-weight: bold; color: #92400e;">⚠️ ${stats.upcomingDeadlines} assignment${stats.upcomingDeadlines > 1 ? 's' : ''} due this week</p>
        </div>
        ` : ''}

        <p>Keep up the great work! 🎉</p>
        
        <p style="color: #6b7280; font-size: 12px; margin-top: 30px;">
          You're receiving this because you enabled weekly summaries in your SWIS settings.
        </p>
      </div>
    `
  })
};

// Send email function
export async function sendEmail(to, template) {
  try {
    // Check if email is configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.log('⚠️ Email not configured. Skipping email send.');
      return { success: false, error: 'Email not configured' };
    }

    const mailOptions = {
      from: `"SWIS - Student Wellness & Insights" <${process.env.EMAIL_USER}>`,
      to,
      subject: template.subject,
      html: template.html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}: ${template.subject}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email send error:', error.message);
    return { success: false, error: error.message };
  }
}

// Test email configuration
export async function testEmailConfig() {
  try {
    await transporter.verify();
    console.log('✅ Email service is ready');
    return true;
  } catch (error) {
    console.error('❌ Email service error:', error.message);
    return false;
  }
}
