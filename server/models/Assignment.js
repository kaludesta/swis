import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';

const Assignment = sequelize.define('Assignment', {
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
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  due_date: {
    type: DataTypes.DATE
  },
  status: {
    type: DataTypes.ENUM('pending', 'in_progress', 'completed', 'overdue'),
    defaultValue: 'pending'
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    defaultValue: 'medium'
  },
  source: {
    type: DataTypes.ENUM('manual', 'blackboard'),
    defaultValue: 'manual'
  },
  blackboard_id: {
    type: DataTypes.STRING,
    allowNull: true
  },
  course_name: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'assignments',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
  indexes: [
    {
      fields: ['user_id', 'due_date']
    },
    {
      fields: ['user_id', 'status']
    },
    {
      unique: true,
      fields: ['user_id', 'blackboard_id'],
      name: 'unique_user_blackboard_assignment'
    }
  ]
});

Assignment.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Assignment, { foreignKey: 'user_id' });

export default Assignment;
