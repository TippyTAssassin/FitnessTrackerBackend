const { client } = require("./client");
const { getRoutineById } = require("./routines")
async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
  try {
    const { rows: [ routineActivity ] } = await client.query(`
      INSERT INTO routine_activities("routineId", "activityId", count, duration)
      VALUES($1, $2, $3, $4)
      RETURNING *;
      `, [routineId, activityId, count, duration]);
      return routineActivity;
  } catch (error) {
    console.log(error);
  }
}
async function getRoutineActivityById(id) {
  try {
    const { rows: [ routineActivity ] } = await client.query(`
    SELECT *
    FROM routine_activities
    WHERE id = $1
    `, [id]);
    return routineActivity;
  } catch (error) {
    console.log(error);
  }
}
async function getRoutineActivitiesByRoutine({ id }) {
  try {
    const { rows } = await client.query(`
    SELECT *
    FROM routine_activities
    WHERE "routineId" = $1
    `, [id]);
    return rows;
  } catch (error) {
    console.log(error);
  }
}
async function updateRoutineActivity({ id, ...fields }) {
  const setString = Object.keys(fields).map(
    (key, index) => `"${ key }"=$${ index + 1 }`
  ).join(', ');
  if(setString.length === 0) {
    return;
  }
  try {
    const { rows: [routineActivity] } = await client.query(`
    UPDATE routine_activities
    SET ${ setString }
    WHERE id=${id}
    RETURNING *;
    `, Object.values(fields));
    return routineActivity;
  } catch (error) {
    console.log(error);
  }
}
async function destroyRoutineActivity(id) {
  try {
    const { rows: [routineActivity] } = await client.query(`
    DELETE FROM routine_activities
    WHERE id=${id}
    RETURNING *;
    `);
    return routineActivity;
  } catch (error) {
    console.log(error);
  }
}
async function canEditRoutineActivity(routineActivityId, userId) {
  const routAct = await getRoutineActivityById(routineActivityId);
  const routine = await getRoutineById(routAct.routineId);
  if(userId === routine.creatorId) {
    return true;
  } else {
    return false;
  }
}
module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
