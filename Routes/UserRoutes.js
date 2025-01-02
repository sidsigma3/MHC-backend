const express = require('express');
const { createUser, getUsers , loginUser ,createSurvey,getUserById ,updateUserById ,getSurveyById,getAllSurveys, createNewUser,googleLogin, deleteUser, sendRecoveryCode, resetPassword, saveProfilePic} = require('../Controllers/UserController');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadsDir = path.join(__dirname, '/Upload');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => { 
        cb(null, `${Date.now()}-${file.originalname}`); 
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
