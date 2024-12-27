const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { sequelize } = require('./Models');
const UserRoutes = require('./Routes/UserRoutes')
const ErorrHandler = require('./MIddleware/ErorrHandler');
const session = require('express-session');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;


const corsOptions = {
  origin: ['http://localhost:3000', 'https://www.stockangel.online'], 
  methods: ['GET', 'POST', 'PUT', 'DELETE','OPTIONS'], 
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  };

app.use(cors(corsOptions));
  

app.use(bodyParser.json());

// Routes
app.use('/api/users', UserRoutes);

// Error Handling
app.use(ErorrHandler);

app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false }, 
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
