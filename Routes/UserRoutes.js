const express = require('express');
const { createUser, getUsers , loginUser ,createSurvey,getUserById ,updateUserById ,getSurveyById,getAllSurveys, createNewUser,googleLogin, deleteUser, sendRecoveryCode, resetPassword, saveProfilePic, logoutUser} = require('../Controllers/UserController');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const authMiddleware = require('../MIddleware/AuthMiddleWare')


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
router.post('/create', createUser); // Public route
router.post('/createNewUser', createNewUser); // Public route
router.post('/login', loginUser); // Public route
router.post('/auth/google', googleLogin); // Public route
router.post('/resetPassword', sendRecoveryCode); // Public route
router.post('/resetPassword/enterPassword', resetPassword); // Public route

// Protected Routes (Require Authentication Middleware)
router.get('/getAll', authMiddleware, getUsers); // Requires auth
router.post('/survey/create', authMiddleware, createSurvey); // Requires auth
router.get("/:userId", authMiddleware, getUserById); // Requires auth
router.put('/update/:userId', authMiddleware, updateUserById); // Requires auth
router.get('/survey/:userId', authMiddleware, getSurveyById); // Requires auth
router.get("/surveys/getAll", authMiddleware, getAllSurveys); // Requires auth
router.delete("/delete/:id", authMiddleware, deleteUser); // Requires auth
router.post('/profilePicSave', authMiddleware, saveProfilePic); // Requires auth
router.post('/logoutUser', authMiddleware, logoutUser); // Requires auth
module.exports = router;
