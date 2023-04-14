const express = require('express');
const router = express.Router();
const path = require('path');

// GET /api/health
router.get('/health', async (req, res, next) => {
    res.status(200).send({
        "message": "All Gucci!"
    });
});

router.get('/', (req, res, next) => res.sendFile(path.join(__dirname, '../index.html')));

router.use('/dist', express.static(path.join(__dirname, '../dist')));

// ROUTER: /api/users
const usersRouter = require('./users');
router.use('/users', usersRouter);

// ROUTER: /api/activities
const activitiesRouter = require('./activities');
router.use('/activities', activitiesRouter);

// ROUTER: /api/routines
const routinesRouter = require('./routines');
router.use('/routines', routinesRouter);

// ROUTER: /api/routine_activities
const routineActivitiesRouter = require('./routineActivities');
router.use('/routine_activities', routineActivitiesRouter);

module.exports = router;
