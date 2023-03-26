<<<<<<< HEAD
const {client} = require("./client");

async function createRoutine({ creatorId, isPublic, name, goal }) {}
=======
const { client } = require("./client");

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
>>>>>>> a493ef615d7ed524e278b740eb8891d2ff955c02

async function getRoutineById(id) {}

async function getRoutinesWithoutActivities() {
  try {
    const { rows } = await client.query(`
    SELECT id, "creatorId", "isPublic", name, goal
    FROM routines;
    `)
    return rows;
  } catch (error) {
    console.log(error);
  }
}

async function getAllRoutines() {}

async function getAllPublicRoutines() {}

async function getAllRoutinesByUser({ username }) {}

async function getPublicRoutinesByUser({ username }) {}

async function getPublicRoutinesByActivity({ id }) {}

async function updateRoutine({ id, ...fields }) {}

async function destroyRoutine(id) {}

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
