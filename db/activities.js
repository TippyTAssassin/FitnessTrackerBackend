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
  const { rows: [ activities ] } = await client.query(`
   SELECT *
   FROM activities
   WHERE id=${id}
  `)

 return activities;
}catch(error){
 console.log(error);
}

}

async function getActivityByName(name) {
  try {
    const { rows: [ activity ] } = await client.query(`
    SELECT *
    FROM activities
    WHERE name=${name}
    `)

   return activity;
  }catch(error){
    console.log(error);
  }
}

// used as a helper inside db/routines.js
async function attachActivitiesToRoutines(routines) {}

async function updateActivity({ id, ...fields }) {
  // don't try to update the id
  // do update the name and description
  // return the updated activity
}

module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
};
