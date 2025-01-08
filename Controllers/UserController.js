const { User , Survey} = require('../Models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { OAuth2Client } = require('google-auth-library');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

require('dotenv').config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);



// Create a new user
// const createUser = async (req, res) => {
//   try {
//     const { first_name, last_name, email, password, role } = req.body;
//     const user = await User.create({ first_name, last_name, email, password, role });
//     res.status(201).json(user);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// Fetch all users


const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



const createUser = async (req, res) => {
    try {
      const { first_name, last_name, email, password, role ,birthdate,nationality,phone,whatsapp,city} = req.body;

      const user = await User.create({ first_name, last_name, email, password, role,birthday:birthdate,nationality,phone,whatsapp,city });
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  


  const createNewUser = async (req, res) => {
    try {
      const { first_name, last_name, email, password, role ,birthday ,jobProfile,nationality,phone,whatsapp,city } = req.body;

      const user = await User.create({ first_name, last_name, email, password, role,birthday,jobProfile,nationality,phone,whatsapp,city });
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  
  const loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const user = await User.findOne({ where: { email } });
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Directly compare plain-text password
      if (user.password !== password) { // No bcrypt used
        return res.status(401).json({ error: 'Invalid password' });
      }
      // Generate JWT Token
      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' } // Token expires in 1 hour
      );

      res.cookie("token", token, {
        httpOnly: true,        // Prevent JavaScript access
        secure: process.env.NODE_ENV === "production", // Use HTTPS in production
        sameSite: "none",    // Prevent cross-site request forgery (CSRF) attacks
        maxAge: 1 * 60 * 60 * 1000, // 1 hour
      });
      
      
      // Send back user details with token
      res.status(200).json({
        id: user.userId,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
        token, // Include the token in the response
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };



  const googleLogin = async (req, res) => {
    try {
      const { token } = req.body;
  
      // Verify the token
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
  
      const payload = ticket.getPayload();
  
      // Check if user exists or create a new user
      let user = await User.findOne({ where: { email: payload.email } });
      if (!user) {
        user = await User.create({
          email: payload.email,
          first_name: payload.given_name,
          last_name: payload.family_name || '',
          password: payload.sub,
          role: 'user',
          nationality:null,
          phone:null,
          city:null,
          birthday:null,


        });
      }
      
      // Generate JWT
      const jwtToken = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );


      res.cookie("token", jwtToken, {
        httpOnly: true,        // Prevent JavaScript access
        secure: process.env.NODE_ENV === "production", // Use HTTPS in production
        sameSite: "strict",    // Prevent cross-site request forgery (CSRF) attacks
        maxAge: 1 * 60 * 60 * 1000, // 1 hour
      });
  
    
      res.status(200).json({
        success:true,
        token:jwtToken,
        id: user.userId,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
        token, // Include the token in the response
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Authentication failed' });
    }
  };
  


  const createSurvey = async (req, res) => {
    try {
      const surveyData = req.body;
  
      const survey = await Survey.create(surveyData);
      res.status(201).json(survey);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


  const getUserById = async (req, res) => {
    const { userId } = req.params; // Extract userId from the route parameter
  
    try {
      const user = await User.findByPk(userId); // Find the user by primary key
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      res.json(user); 
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Server error" });
    }
  };
  

  const updateUserById = async (req, res) => {
    const { userId } = req.params;  
    const { first_name, last_name, email, phone, whatsapp, birthday, city, nationality, jobProfile, password } = req.body;
    
    try {
        const user = await User.findByPk(userId); 
        console.log(user);
        if (!user) {
            return res.status(404).json({ error: 'User not found' }); 
        }

       
        const updateFields = {};

        if (first_name) updateFields.first_name = first_name;
        if (last_name) updateFields.last_name = last_name;
        if (email) updateFields.email = email;
        if (phone) updateFields.phone = phone;
        if (whatsapp) updateFields.whatsapp = whatsapp;
        if (birthday) updateFields.birthday = birthday;
        if (city) updateFields.city = city;
        if (nationality) updateFields.nationality = nationality;
        if (jobProfile) updateFields.jobProfile = jobProfile;
        if (password) updateFields.password = password;

        const updatedUser = await user.update(updateFields);  
        res.json(updatedUser);  
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: 'Server error' });  
    }
};



const getSurveyById = async (req, res) => {
    const { userId } = req.params;
    const { startDate, endDate } = req.query;
  
    try {
      const query = { userId };
  
      if (startDate) {
        query.createdAt = { ...query.createdAt, [Op.gte]: new Date(startDate) };
      }
  
      if (endDate) {
        query.createdAt = { ...query.createdAt, [Op.lte]: new Date(endDate) };
      }
  
      const surveys = await Survey.findAll({ where: query });
  
      if (!surveys.length) {
        return res.status(200).json({ message: "No surveys found for the given criteria" });
      }
  
      res.status(200).json(surveys);
    } catch (error) {
      console.error("Error fetching surveys:", error);
      res.status(500).json({ error: "Server error" });
    }
  };
  
  const getAllSurveys = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const query = {};
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt[Op.gte] = new Date(startDate);
            if (endDate) query.createdAt[Op.lte] = new Date(endDate);
        }

        console.log(query)

        const surveys = await Survey.findAll({ where: query });

        if (!surveys.length) {
            return res.status(200).json({ message: "No surveys found for the given criteria" });
        }

        res.status(200).json(surveys);
    } catch (error) {
        console.error("Error fetching surveys:", error);
        res.status(500).json({ error: "Failed to fetch surveys" });
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;
    const { deleteSurveys } = req.body;

    try {
        // Delete user by ID
        await User.destroy({ where: { userId: id } });

        // Optionally delete associated surveys if deleteSurveys is true
        if (deleteSurveys) {
            await Survey.destroy({ where: { userId: id } });
        }

        res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ success: false, message: "Failed to delete user" });
    }
};


const verificationCodes = {};
const sendRecoveryCode = async (req, res) => {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: 'Email is required' });

    try {
     
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(404).json({ message: 'User not found' });

       
        const code = crypto.randomInt(100000, 999999).toString();

      
        verificationCodes[email] = code;

       
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset Code',
            text: `Your password reset code is ${code}`,
        });

        res.json({ message: 'Code sent successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error sending code' });
    }
}



const resetPassword = async (req, res) => {
const { email, code, newPassword } = req.body;

if (!email || !code || !newPassword)
    return res.status(400).json({ message: 'All fields are required' });

try {
    // Verify the code
    if (verificationCodes[email] !== code)
        return res.status(400).json({ message: 'Invalid or expired code' });


    await User.update({ password: newPassword }, { where: { email } });

    // Remove the used code
    delete verificationCodes[email];

    res.json({ message: 'Password reset successfully' });
} catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error resetting password' });
}
};


const saveProfilePic = async (req, res) => {
  try {
    const { userId, base64Image } = req.body;

    if (!userId || !base64Image) {
      return res.status(400).json({ message: "User ID and base64 image are required." });
    }

    // Extract the format from the base64 metadata
    const formatMatch = base64Image.match(/^data:image\/(\w+);base64,/);
    if (!formatMatch) {
      return res.status(400).json({ message: "Invalid image format." });
    }
    const imageFormat = formatMatch[1]; // Extract format (e.g., png, jpeg)
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, ""); // Remove Base64 metadata

    const imageBuffer = Buffer.from(base64Data, "base64"); // Decode Base64 to binary

    // Update the user's profile picture and format in the database
    await User.update(
      { profilePicture: imageBuffer, profilePictureFormat: imageFormat },
      { where: { userId } }
    );

    res.status(200).json({ message: "Profile picture updated successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const logoutUser = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
};






module.exports = {logoutUser,saveProfilePic,resetPassword,sendRecoveryCode,deleteUser, createUser, getUsers ,loginUser ,createSurvey ,getUserById ,updateUserById,getSurveyById,getAllSurveys,createNewUser,googleLogin};
