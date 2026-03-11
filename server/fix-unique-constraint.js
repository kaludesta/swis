import sequelize from './config/database.js';

async function fixUniqueConstraint() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to database');
    
    // Drop the old unique constraint on blackboard_id
    await sequelize.query(`
      ALTER TABLE assignments 
      DROP CONSTRAINT IF EXISTS "assignments_blackboard_id_key";
    `);
    
    console.log('✅ Dropped old unique constraint on blackboard_id');
    
    // Create new composite unique constraint
    await sequelize.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS unique_user_blackboard_assignment 
      ON assignments (user_id, blackboard_id) 
      WHERE blackboard_id IS NOT NULL;
    `);
    
    console.log('✅ Created new composite unique constraint (user_id + blackboard_id)');
    console.log('✅ Migration complete!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  }
}

fixUniqueConstraint();
