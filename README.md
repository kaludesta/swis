# SWIS - Student Workload Intelligence System

A comprehensive academic dashboard that helps students track their workload, analyze study patterns, and receive AI-powered insights to improve productivity and prevent burnout.

## Overview

SWIS is a full-stack web application that combines time tracking, assignment management, study session logging, and machine learning insights to help students manage their academic workload effectively.

## Project Structure

```
├── frontend/              # React + Vite frontend application
│   ├── src/
│   │   ├── app/          # Main application components
│   │   │   ├── components/  # Reusable UI components
│   │   │   │   ├── Navbar.tsx           # Navigation bar
│   │   │   │   ├── figma/               # Image components
│   │   │   │   └── ui/                  # Shadcn UI components
│   │   │   ├── pages/    # Application pages
│   │   │   │   ├── LoginPage.tsx        # User authentication
│   │   │   │   ├── RegisterPage.tsx     # User registration
│   │   │   │   ├── DashboardPage.tsx    # Main dashboard
│   │   │   │   ├── AssignmentsPage.tsx  # Assignment management
│   │   │   │   ├── StudySessionPage.tsx # Study session logging
│   │   │   │   ├── AnalyticsPage.tsx    # Browsing analytics
│   │   │   │   ├── InsightsPage.tsx     # ML-powered insights
│   │   │   │   └── SettingsPage.tsx     # User settings
│   │   │   └── App.tsx   # Main app component with routing
│   │   ├── styles/       # CSS styling files
│   │   └── db/           # Frontend database utilities
│   ├── index.html        # HTML entry point
│   ├── vite.config.ts    # Vite configuration
│   └── postcss.config.mjs # PostCSS configuration
│
├── server/               # Node.js + Express backend
│   ├── config/
│   │   └── database.js   # PostgreSQL connection config
│   ├── models/           # Sequelize ORM models
│   │   ├── User.js       # User model
│   │   ├── Assignment.js # Assignment model
│   │   ├── StudySession.js # Study session model
│   │   └── WebsiteTracking.js # Website tracking model
│   ├── db/
│   │   └── schema.sql    # Database schema
│   ├── ml/
│   │   └── predictor.py  # Python ML predictor
│   ├── index.js          # Main Express server
│   ├── ml-insights.js    # ML insights logic
│   ├── ml-service.js     # ML service wrapper
│   ├── email-service.js  # Email notification service
│   └── notification-scheduler.js # Scheduled notifications
│
├── extension/            # Browser extension for time tracking
│   ├── icons/            # Extension icons
│   ├── background.js     # Background service worker
│   ├── popup.html        # Extension popup UI
│   ├── popup.js          # Popup logic
│   └── manifest.json     # Extension configuration
│
├── package.json          # Project dependencies
├── .env                  # Environment variables
└── README.md             # This file
```

## Features

### 1. User Authentication
- **Registration**: Create new user accounts with email and password
- **Login**: Secure authentication with bcrypt password hashing
- **Session Management**: LocalStorage-based session persistence

### 2. Dashboard
- **Overview Cards**: Quick stats on assignments, study hours, and upcoming deadlines
- **Recent Activity**: View recent study sessions and assignments
- **Quick Actions**: Fast access to common tasks

### 3. Assignment Management
- **Create Assignments**: Add assignments with title, description, due date, and priority
- **Track Progress**: Mark assignments as pending, in progress, or completed
- **Blackboard Integration**: Sync assignments from Blackboard calendar (iCal feed)
- **Priority Levels**: Organize by low, medium, or high priority
- **Due Date Tracking**: Visual indicators for upcoming and overdue assignments

### 4. Study Session Tracking
- **Log Sessions**: Record study sessions with subject, duration, and notes
- **Session History**: View all past study sessions
- **Subject Analysis**: Track which subjects you study most
- **Time Statistics**: Calculate total study time and averages

### 5. Browser Time Tracking (Extension)
- **Automatic Tracking**: Tracks time spent on websites automatically
- **Real-time Sync**: Syncs data to server every 30 seconds
- **Local Storage**: Stores data locally before syncing
- **Domain Grouping**: Groups tracking by domain
- **Daily Reports**: Shows today's browsing activity in popup

### 6. Analytics Page
- **Time Visualization**: Bar charts showing time spent per website
- **Top Sites**: Ranked list of most visited websites
- **Session Statistics**: Total sessions, time tracked, and websites visited
- **Time Period Filters**: View data for today, last 7 days, or last 30 days
- **Detailed Breakdown**: Table with visit counts and average time per visit

### 7. ML-Powered Insights
- **Productivity Score**: AI calculates productivity level (0-100) based on:
  - Study hours
  - Sleep patterns
  - Screen time
  - Focus score
- **Burnout Risk Assessment**: Evaluates burnout risk based on:
  - Study workload
  - Sleep deprivation
  - Screen time
  - Upcoming deadlines
- **Personalized Recommendations**: AI-generated suggestions for:
  - Study schedule optimization
  - Break management
  - Sleep improvement
  - Focus enhancement
- **Study Pattern Analysis**: Analyzes study habits including:
  - Total sessions and hours
  - Average session duration
  - Most studied subjects
- **Confidence Levels**: Shows AI confidence in predictions (Low/Medium/High)

### 8. Settings
- **Notification Preferences**: Configure deadline reminders, workload alerts, and weekly summaries
- **Privacy Controls**: Manage data collection and analytics preferences
- **Calendar Integration**: Add Blackboard calendar URL for automatic assignment sync
- **Password Management**: Change account password
- **Account Deletion**: Permanently delete account and all data

## Technology Stack

### Frontend
- **React 18**: UI library for building interactive interfaces
- **TypeScript**: Type-safe JavaScript
- **Vite**: Fast build tool and dev server
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn UI**: Pre-built accessible components
- **Recharts**: Data visualization library
- **Lucide React**: Icon library

### Backend
- **Node.js**: JavaScript runtime
- **Express**: Web application framework
- **PostgreSQL**: Relational database
- **Sequelize**: ORM for database operations
- **bcrypt**: Password hashing
- **dotenv**: Environment variable management
- **node-cron**: Task scheduling
- **nodemailer**: Email notifications
- **node-ical**: iCal feed parsing for Blackboard integration

### Browser Extension
- **Chrome Extension API**: Manifest V3
- **Vanilla JavaScript**: No framework dependencies
- **Chrome Storage API**: Local data persistence
- **Chrome Tabs API**: Tab tracking
- **Chrome Notifications API**: User notifications

### Machine Learning
- **Python**: ML model implementation
- **JavaScript ML Logic**: Productivity and burnout algorithms

## How It Works

### Authentication Flow
1. User registers with email, name, and password
2. Password is hashed using bcrypt (10 salt rounds)
3. User credentials stored in PostgreSQL database
4. On login, password is verified against hash
5. User ID and name stored in localStorage for session management

### Assignment Tracking
1. Users manually create assignments OR sync from Blackboard
2. Blackboard sync fetches iCal feed and parses events
3. Assignments stored with user_id, title, description, due_date, priority, status
4. Users can update status (pending → in_progress → completed)
5. Dashboard shows upcoming deadlines and overdue assignments

### Study Session Logging
1. User logs study session with subject, duration (minutes), and optional notes
2. Data stored in study_sessions table with timestamp
3. Sessions displayed in chronological order
4. Statistics calculated: total hours, average session length, most studied subject

### Browser Time Tracking
1. Extension loads when browser starts
2. Detects active tab and starts timer
3. Tracks time spent on each domain
4. Every 10 seconds: saves current tab time locally
5. Every 30 seconds: syncs accumulated time to server
6. Server aggregates time by domain and date
7. Analytics page fetches and visualizes data

### ML Insights Generation
1. Backend fetches user data:
   - Study sessions (last 30 days)
   - Website tracking (last 7 days)
   - Pending assignments
2. Calculates metrics:
   - Average study hours per day
   - Total screen time
   - Focus score (based on study consistency)
   - Estimated sleep (default 7 hours)
3. ML algorithms process metrics:
   - **Productivity Prediction**: Uses study hours, sleep, screen time, focus score
   - **Burnout Risk**: Analyzes workload, sleep, distractions, deadlines
   - **Recommendations**: Rule-based system generates personalized advice
4. Results sent to frontend with confidence levels

### Blackboard Calendar Integration
1. User provides Blackboard calendar URL (iCal format)
2. Server fetches and parses iCal feed using node-ical
3. Extracts events: title, due date, description, location (course name)
4. Creates/updates assignments in database
5. Removes assignments no longer in calendar
6. Sync can be manual or scheduled

## API Endpoints

### Authentication
- `POST /api/register` - Create new user account
- `POST /api/login` - Authenticate user

### Assignments
- `POST /api/assignments` - Create new assignment
- `GET /api/assignments/:userId` - Get user's assignments
- `PATCH /api/assignments/:assignmentId` - Update assignment
- `DELETE /api/assignments/:assignmentId` - Delete assignment

### Study Sessions
- `POST /api/study-sessions` - Log study session
- `GET /api/study-sessions/:userId` - Get user's study sessions

### Website Tracking
- `POST /api/tracking` - Save tracking data from extension
- `GET /api/tracking/:userId` - Get tracking data with optional date range
- `GET /api/tracking/:userId/top` - Get top websites by time spent

### Calendar Integration
- `POST /api/user/:userId/calendar-url` - Save Blackboard calendar URL
- `GET /api/user/:userId/calendar-url` - Get saved calendar URL
- `POST /api/user/:userId/sync-calendar` - Sync assignments from Blackboard

### ML Insights
- `POST /api/ml/insights/:userId` - Generate ML insights

### User Settings
- `GET /api/user/:userId/preferences` - Get user preferences
- `PATCH /api/user/:userId/preferences` - Update preferences
- `POST /api/user/:userId/change-password` - Change password
- `DELETE /api/user/:userId` - Delete account

### Health Check
- `GET /api/health` - Check server and database status

## Database Schema

### Users Table
- `id` (Primary Key)
- `email` (Unique)
- `password_hash`
- `name`
- `blackboard_calendar_url`
- `last_calendar_sync`
- Notification preferences (boolean flags)
- Privacy preferences (boolean flags)
- `created_at`, `updated_at`

### Assignments Table
- `id` (Primary Key)
- `user_id` (Foreign Key → Users)
- `title`
- `description`
- `due_date`
- `status` (pending, in_progress, completed)
- `priority` (low, medium, high)
- `source` (manual, blackboard)
- `blackboard_id` (Unique identifier from Blackboard)
- `course_name`
- `created_at`, `updated_at`

### Study Sessions Table
- `id` (Primary Key)
- `user_id` (Foreign Key → Users)
- `subject`
- `duration` (minutes)
- `notes`
- `created_at`

### Website Tracking Table
- `id` (Primary Key)
- `user_id` (Foreign Key → Users)
- `domain`
- `url`
- `title`
- `time_spent` (seconds)
- `visit_date`
- `last_updated`

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### 1. Clone Repository
```bash
git clone <repository-url>
cd project_dummy
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory:
```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/database_name

# Email (Optional - for notifications)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

### 4. Setup Database
```bash
# Create PostgreSQL database
createdb academic_dashboard

# Tables will be created automatically on first run
```

### 5. Run Application
```bash
# Start both frontend and backend
npm run dev:all

# Or run separately:
npm run dev      # Frontend only (http://localhost:5173)
npm run server   # Backend only (http://localhost:3000)
```

### 6. Install Browser Extension
1. Open Chrome/Edge
2. Go to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked"
5. Select the `extension` folder
6. Extension icon will appear in toolbar

### 7. Setup Extension
1. Open the dashboard at http://localhost:5173
2. Register/Login to your account
3. Extension will automatically detect your login
4. Start browsing - tracking begins automatically

## Usage Guide

### Getting Started
1. **Register**: Create an account with email and password
2. **Login**: Access your dashboard
3. **Install Extension**: Load the browser extension for automatic time tracking

### Managing Assignments
1. Go to "Assignments" page
2. Click "Add Assignment" to create manually
3. OR add Blackboard calendar URL in Settings and click "Sync"
4. Update status as you work on assignments
5. View upcoming deadlines on Dashboard

### Logging Study Sessions
1. Go to "Study Sessions" page
2. Enter subject, duration, and optional notes
3. Click "Log Session"
4. View session history and statistics

### Viewing Analytics
1. Go to "Analytics" page
2. Extension must be installed and tracking
3. View time spent on different websites
4. Filter by Today, Last 7 Days, or Last 30 Days
5. See detailed breakdown with visit counts

### Getting ML Insights
1. Go to "Insights" page
2. System analyzes your data automatically
3. View productivity score and burnout risk
4. Read personalized recommendations
5. Check study pattern analysis

### Configuring Settings
1. Go to "Settings" page
2. Enable/disable notifications
3. Manage privacy preferences
4. Add Blackboard calendar URL
5. Change password or delete account

## ML Algorithms Explained

### Productivity Score Calculation
```
Base Score = (study_hours / 8) * 100
Sleep Adjustment = sleep_hours >= 7 ? +10 : -15
Screen Time Penalty = screen_time > 6 ? -20 : 0
Focus Bonus = focus_score > 70 ? +15 : 0

Final Score = Clamp(Base + Adjustments, 0, 100)
```

### Burnout Risk Calculation
```
Study Stress = study_hours > 8 ? 30 : (study_hours / 8) * 20
Sleep Deprivation = sleep_hours < 6 ? 25 : 0
Distraction Factor = (social_media + gaming) > 4 ? 20 : 10
Deadline Pressure = upcoming_deadlines > 5 ? 25 : (deadlines * 3)

Burnout Risk = Study Stress + Sleep Deprivation + Distraction + Deadline Pressure
```

### Recommendation Engine
Rule-based system that checks:
- Study hours (too high/low)
- Sleep hours (insufficient)
- Screen time (excessive)
- Social media usage (high)
- Gaming time (high)
- Focus score (low)

Generates specific, actionable recommendations based on detected issues.

## Troubleshooting

### Extension Not Tracking
- Ensure you're logged in to the dashboard
- Check extension popup shows "Tracking active for [your name]"
- Refresh dashboard page to trigger auto-detection
- Click "Sync All to Server" in extension popup

### Analytics Page Shows No Data
- Extension must be installed and tracking
- Wait 30 seconds for auto-sync
- Click "Refresh Data" button
- Check browser console for errors

### Blackboard Sync Not Working
- Verify calendar URL is correct (should be .ics format)
- Check URL is publicly accessible
- Look for error messages in sync response
- Try manual sync from Settings page

### Database Connection Errors
- Ensure PostgreSQL is running
- Verify DATABASE_URL in .env is correct
- Check database exists and user has permissions
- Look at server logs for specific error

## Security Considerations

- Passwords hashed with bcrypt (10 salt rounds)
- No plain text password storage
- Session data stored in localStorage (client-side only)
- CORS enabled for localhost development
- SQL injection prevented by Sequelize ORM
- Input validation on all API endpoints

## Future Enhancements

- Real-time notifications using WebSockets
- Mobile app for iOS/Android
- Advanced ML models using TensorFlow
- Pomodoro timer integration
- Study group collaboration features
- Calendar view for assignments
- Export data to CSV/PDF
- Dark mode theme
- Multi-language support

## Contributing

This is an academic project. For improvements or bug fixes, please follow standard Git workflow:
1. Fork the repository
2. Create feature branch
3. Make changes
4. Submit pull request

## License

This project is for educational purposes.

## Support

For issues or questions, please check the troubleshooting section or review the code documentation.
