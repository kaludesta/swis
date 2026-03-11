import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';

const StudySession = sequelize.define('StudySession', {
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
  subject: {
    type: DataTypes.STRING,
    allowNull: false
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Duration in minutes'
  },
  notes: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'study_sessions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
  indexes: [
    {
      fields: ['user_id', 'created_at']
    }
  ]
});

StudySession.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(StudySession, { foreignKey: 'user_id' });

export default StudySession;
