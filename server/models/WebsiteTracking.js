import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';

const WebsiteTracking = sequelize.define('WebsiteTracking', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  domain: {
    type: DataTypes.STRING,
    allowNull: false
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING
  },
  time_spent: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Time in seconds'
  },
  visit_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  last_updated: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'website_tracking',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'domain', 'visit_date']
    },
    {
      fields: ['user_id', 'visit_date']
    }
  ]
});

// Define relationship
WebsiteTracking.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(WebsiteTracking, { foreignKey: 'user_id' });

export default WebsiteTracking;
