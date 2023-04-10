const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { UnauthorizedDeleteError, UnauthorizedUpdateError } = require('../errors.js');
const { getRoutineActivityById, getRoutineById, destroyRoutineActivity, updateRoutineActivity, getUserById } = require('../db');
const {JWT_SECRET = "neverTell"} = process.env;

// PATCH /api/routine_activities/:routineActivityId
router.patch('/:routineActivityId', async(req, res, next) => {
    try{
     const authHeader = req.headers['authorization'];
     const token = authHeader.split(' ')[1];
     const userId = jwt.verify(token, JWT_SECRET)['id'];
     const user = await getUserById(userId);
     console.log("USER", user);
     const id = req.params['routineActivityId'];
     const routineActivity = await getRoutineActivityById(id)
     const routine = await getRoutineById(routineActivity.routineId);
     if(routine.creatorId !== userId) {
        res.status(403).send({
          "error": 'UnathorizedUpdateError',
          "message":`${UnauthorizedUpdateError(user.username, routine.name)}`,
          "name": `UnauthorizedUpdateError`
        })
      } else {
        const fields = req.body;
        const routineActUpdate = await updateRoutineActivity({id, ...fields});
        res.send(routineActUpdate) ;
      }
    }catch(error){
     next(error);
    }
  })
// DELETE /api/routine_activities/:routineActivityId
router.delete('/:routineActivityId', async(req, res, next) => {
    try {
     const authHeader = req.headers['authorization']
     const token = authHeader.split(' ')[1];
     const userId = jwt.verify(token, JWT_SECRET)["id"];
     const user =  await getUserById(userId);
     const id = req.params['routineActivityId'];
     const routineActivity = await getRoutineActivityById(id);
     const routine = await getRoutineById(routineActivity.routineId);
     if(userId !== routine.creatorId) {
       res.status(403).send({
         "error": 'UnathorizedDeleteError',
         "message": `${UnauthorizedDeleteError(user.username, routine.name)}`,
         "name": `UnauthorizedDeleteError`
       })
     } else {
       await destroyRoutineActivity(id);
       res.send(routineActivity);
     }
    }catch(error){
     next(error);
    }
  })
module.exports = router;
