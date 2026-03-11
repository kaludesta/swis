import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  blackboard_calendar_url: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  last_calendar_sync: {
    type: DataTypes.DATE,
    allowNull: true
  },
  // Notification preferences
  notify_deadline_reminders: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  notify_workload_alerts: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  notify_weekly_summary: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  // Privacy preferences
  privacy_data_collection: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  privacy_analytics: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  privacy_email_notifications: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

export default User;
