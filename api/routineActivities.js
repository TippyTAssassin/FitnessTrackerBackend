const express = require('express');
const router = express.Router();

// PATCH /api/routine_activities/:routineActivityId
router.patch('/', async(req, res, next) => {
    try {
     const { updateRoutineActivity } = req.params;
     const fields = req.body;
     const updatedRoutineActivityData = { updateRoutineActivity, fields }
     const routineUpdate = await updateRoutineActivity(updatedRoutineActivityData);
     res.send(routineUpdate)
    }catch(error){
     next(error);
    }
})
// DELETE /api/routine_activities/:routineActivityId

module.exports = router;
