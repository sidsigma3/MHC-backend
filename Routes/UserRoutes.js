const express = require('express');
const { createUser, getUsers , loginUser ,createSurvey,getUserById ,updateUserById ,getSurveyById,getAllSurveys, createNewUser} = require('../Controllers/UserController');




const router = express.Router();

// User Routes
router.post('/create', createUser);
router.post('/createNewUser', createNewUser);
router.get('/getAll', getUsers);
router.post('/login', loginUser);
router.post('/survey/create',createSurvey)
router.get("/:userId", getUserById); 
router.put('/update/:userId', updateUserById);
router.get('/survey/:userId',getSurveyById)
router.get("/surveys/getAll", getAllSurveys);

module.exports = router;
