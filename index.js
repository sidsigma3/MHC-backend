const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { sequelize } = require('./Models');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middleware/ErorrHandler');
const session = require('express-session');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;


const corsOptions = {
  origin: ['http://localhost:3000', 'https://mhc-frontend.vercel.app'], // Allow these origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  credentials: true,
  };
app.use(cors(corsOptions));
  

app.use(bodyParser.json());

// Routes
app.use('/api/users', userRoutes);

// Error Handling
app.use(errorHandler);

app.use(
    session({
      secret: process.env.SESSION_SECRET, // Store in .env file
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false }, // Use `true` if HTTPS is enabled
    })
  );

// Sync Database
sequelize.sync({ force: false }).then(() => {
  console.log('Database synchronized');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
