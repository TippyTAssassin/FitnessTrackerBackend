const { client } = require('./client');

// database functions
async function createActivity({ name, description }) {
  // return the new activity
  try {
    const { rows: [ activity ] } = await client.query(`
      INSERT INTO activities(name, description)
      VALUES($1, $2)
      RETURNING *;
      `, [name, description]);

    return activity;
  } catch (error) {
    console.log(error);
  }
}

async function getAllActivities() {
  // select and return an array of all activities
  try {
    const { rows } = await client.query(`
    SELECT id, name, description
    FROM activities;
    `)
    return rows;
  } catch (error) {
    console.log(error);
  }
}

async function getActivityById(id) {
  try {
  const { rows: [ activity ] } = await client.query(`
   SELECT *
   FROM activities
   WHERE id = $1
  `, [id])

 return activity;
}catch(error){
 console.log(error);
}

}

async function getActivityByName(name) {
  try {
    const { rows: [ activity ] } = await client.query(`
    SELECT *
    FROM activities
    WHERE name = $1
    `, [name])

   return activity;
  }catch(error){
    console.log(error);
  }
}

// used as a helper inside db/routines.js
async function attachActivitiesToRoutines(routines) {

 for(let i = 0; i < routines.length; i++) {
  
   const routine = routines[i]
   try {
     const { rows: activities } = await client.query(`
     SELECT activities.*, routine_activities.count, routine_activities.duration, routine_activities.id AS "routineActivityId", routine_activities."routineId"
     FROM activities
     JOIN routine_activities 
     ON activities.id = routine_activities."activityId"
     WHERE routine_activities."routineId" = ${routine.id}
     `)
     routine.activities = activities
     
   }catch(error){
    console.log(error);
   }
 }
 return routines;
}

async function updateActivity({ id, ...fields }) {
  const setString = Object.keys(fields).map(
    (key, index) => `"${ key }"=$${ index + 1}`
  ).join(', ');

  if(setString.length === 0) {
    return;
  }

  try {
    const { rows: [activity] } = await client.query(`
    UPDATE activities
    SET ${ setString }
    WHERE id=${id}
    RETURNING *;
    `, Object.values(fields));
    
   return activity; 
  }catch(error){
   console.log(error);
  }
}

module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
};
