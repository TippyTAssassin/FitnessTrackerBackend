const express = require('express');
const { getAllPublicRoutines} = require('../db');
const router = express.Router();

// GET /api/routines
router.get('/', async(req, res, next) => {
    try{
      const publicRoutines = await getAllPublicRoutines();
      res.send(publicRoutines);
    }catch(error){
     next(error);
    }
})

// POST /api/routines

// PATCH /api/routines/:routineId

// DELETE /api/routines/:routineId

// POST /api/routines/:routineId/activities

module.exports = router;
