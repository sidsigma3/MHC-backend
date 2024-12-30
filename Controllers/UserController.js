const { User , Survey} = require('../Models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
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
      const { first_name, last_name, email, password, role } = req.body;

      const user = await User.create({ first_name, last_name, email, password, role });
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
    const { userId } = req.params;  // Extract userId from route parameters
    const { first_name, last_name, email, phone, whatsapp, birthday, city, nationality, jobProfile,password } = req.body;
    
    try {
        const user = await User.findByPk(userId);  // Find user by userId
        console.log(user)
        if (!user) {
            return res.status(404).json({ error: 'User not found' });  // Handle user not found case
        }

       
        const updatedUser = await user.update({
            first_name,
            last_name,
            email,
            phone,
            whatsapp,
            birthday,
            city,
            nationality,
            jobProfile,
            password
        });

        res.json(updatedUser);  
        } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: 'Server error' });  // Handle server errors
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
        return res.status(404).json({ message: "No surveys found for the given criteria" });
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
            return res.status(404).json({ message: "No surveys found for the given criteria" });
        }

        res.status(200).json(surveys);
    } catch (error) {
        console.error("Error fetching surveys:", error);
        res.status(500).json({ error: "Failed to fetch surveys" });
    }
};



module.exports = { createUser, getUsers ,loginUser ,createSurvey ,getUserById ,updateUserById,getSurveyById,getAllSurveys,createNewUser};
