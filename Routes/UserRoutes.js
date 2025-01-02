const express = require('express');
const { createUser, getUsers , loginUser ,createSurvey,getUserById ,updateUserById ,getSurveyById,getAllSurveys, createNewUser,googleLogin, deleteUser, sendRecoveryCode, resetPassword, saveProfilePic} = require('../Controllers/UserController');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/profile_pictures'); // Store files in this directory
    },
    filename: (req, file, cb) => {
      cb(null, `${req.body.userId}-${Date.now()}-${file.originalname}`); // Unique file name
    }
  });
  
const upload = multer({ storage });

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
router.post('/auth/google', googleLogin);
router.delete("/delete/:id", deleteUser);
router.post('/resetPassword',sendRecoveryCode)
router.post('/resetPassword/enterPassword',resetPassword)
router.post('/profilePicSave', upload.single('profilePicture'), saveProfilePic);
module.exports = router;
