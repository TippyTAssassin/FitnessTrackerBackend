const express = require('express');
const { getAllActivities, createActivity, getActivityByName, getPublicRoutinesByActivity, getActivityById, updateActivity } = require('../db');
const { ActivityExistsError, ActivityNotFoundError } = require('../errors.js');
const router = express.Router();

// GET /api/activities/:activityId/routines
router.get('/:activityId/routines', async (req, res, next) => {
  try {
      const activity = await getActivityById(req.params.activityId);
      if(!activity) {
          res.send({
              "error": 'ActivityNotFoundError',
              "message": `${ActivityNotFoundError(req.params.activityId)}`,
              "name": `ActivityNotFoundError`
          });
      } else {
          const routines = await getPublicRoutinesByActivity(activity);
          if(routines) res.send(routines);
      }
  } catch(error) {
      next(error);
  }
})
// GET /api/activities
router.get('/', async(req,res, next) => {
    try {
      const activities = await getAllActivities();
      res.send(activities);
    }catch(error){
     next(error);
    }
})
// POST /api/activities
router.post('/', async(req, res, next) => {
  try {
      const { name, description } = req.body;    
      const actCheck = await getActivityByName(name);
      if(actCheck) {
          res.send({
           "error": 'ActivityExistsError',
           "message": `${ActivityExistsError(name)}`,
           "name": `ActivityExistError`
      });
      } else {
          const activity = await createActivity({name, description});
          if(activity) res.send(activity);
      }
  } catch(error) {
      next(error);
  }
})
// PATCH /api/activities/:activityId
router.patch('/:activityId', async(req, res, next) => {
  try {
      const id = req.params['activityId'];
      const fields = req.body;
      const actCheck = await getActivityById(id);
      const nameCheck = await getActivityByName(fields.name);
      if(!actCheck){
        res.send({
          "error": 'ActivityNotFoundError',
          "message": `${ActivityNotFoundError(id)}`,
          "name": `ActivityNotFoundError`
        })
      }else if(nameCheck){
        res.send({
          "error": 'ActivityExistsError',
          "message": `${ActivityExistsError(fields.name)}`,
          "name": `ActivityExistError`
     });
      } else{
        const activityUpdate = await updateActivity({id, ...fields});
      res.send(activityUpdate)
      }  
  } catch(error) {
      next(error);
  }
})


module.exports = router;
