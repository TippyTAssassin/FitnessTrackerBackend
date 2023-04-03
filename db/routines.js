const { client } = require("./client");
const {attachActivitiesToRoutines} = require("./activities.js");
const {getUserByUsername} = require("./users.js");

async function createRoutine({ 
  creatorId, 
  isPublic, 
  name, 
  goal 
}) {
  try {
    const { rows: [ routine ] } = await client.query(`
    INSERT INTO routines("creatorId", "isPublic", name, goal)
    VALUES($1, $2, $3, $4)
    RETURNING *;
    `, [creatorId, isPublic, name, goal]);

    return routine;
  } catch (error) {
    console.log(error);
  }
}

async function getRoutineById(id) {
  try {
    const { rows: [routine] } = await client.query(`
    SELECT *
    FROM routines
    WHERE id = $1
    `, [id]); 

   return routine; 
  }catch(error){
   console.log(error);
  }
}

async function getRoutinesWithoutActivities() {
  try {
    const { rows } = await client.query(`
    SELECT id, "creatorId", "isPublic", name, goal
    FROM routines
    `);

    return rows;
  } catch (error) {
    console.log(error);
  }
}

async function getAllRoutines() {
  try {
    
    const { rows: routines } = await client.query(`
    SELECT routines.*, users.username AS "creatorName"
    FROM routines
    JOIN users
    ON routines."creatorId" = users.id
    `);
    
    const routinesWithActivities = await attachActivitiesToRoutines(routines);
   return routinesWithActivities;
  }catch(error){
   console.log(error);
  }
}

async function getAllPublicRoutines() {
  try {
    const { rows:  routines  } = await client.query(`
    SELECT routines.*, users.username AS "creatorName"
    FROM routines
    JOIN users
    ON routines."creatorId" = users.id
    WHERE "isPublic" = true
    `);
    const publicRoutinesWithActivities = await attachActivitiesToRoutines(routines);
   return publicRoutinesWithActivities
  }catch(error){
   console.log(error)
  }
}

async function getAllRoutinesByUser({ username }) {
  const user = await getUserByUsername(username);
try {
  const { rows: routines} = await client.query(`
  SELECT routines.*, users.username AS "creatorName"
  FROM routines
  JOIN users
  ON routines."creatorId" = users.id
  WHERE routines."creatorId" = ${user.id}
  `)
  const userRoutines = await attachActivitiesToRoutines(routines);
 return userRoutines
}catch(error){
 console.log(error);
}

}

async function getPublicRoutinesByUser({ username }) {
  const user = await getUserByUsername(username);

  try {
    const { rows: routines } = await client.query(`
      SELECT routines.*, users.username AS "creatorName"
      FROM routines
      JOIN users
      ON routines."creatorId" = users.id
      WHERE routines."creatorId" = ${user.id}
      AND "isPublic" = true
    `);

    const userRoutines = await attachActivitiesToRoutines(routines);

    return userRoutines;
  }catch(error){
   console.log(error);
  }
}

async function getPublicRoutinesByActivity({ id }) {
  
  try {
    const { rows: routines} = await client.query(`
    SELECT routines.*, users.username AS "creatorName"
    FROM routines
    JOIN users
    ON routines."creatorId" = users.id
    JOIN routine_activities 
    ON routines.id = "routineId"
    WHERE "activityId" = ${id}
    AND "isPublic" = true
    `)
    const routinesWithActivities = await attachActivitiesToRoutines(routines);
    return routinesWithActivities
  } catch(error){
    console.log(error);
  }
}

async function updateRoutine({ id, ...fields }) {
  const setString = Object.keys(fields).map(
    (key, index) => `"${ key }"=$${ index + 1}`
  ).join(', ');

  if(setString.length === 0) {
    return;
  }

  try {
    const { rows: [ routine ] } = await client.query(`
    UPDATE routines
    SET ${ setString }
    WHERE id = ${ id }
    RETURNING *;
    `, Object.values(fields))

    return routine;
  }catch(error){
   console.log(error);
  }
}

async function destroyRoutine(id) {
  try {
    await client.query(`
      DELETE FROM routine_activities WHERE "routineId" = ${id};
      DELETE FROM routines WHERE id = ${id};
    `);

    return;
  } catch (error) {
    console.log(error);
  }
}


module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
};
