const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../Model/User');
const authMiddleware = require('../middleware/authMiddleware');

// Middleware for input validation
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};


// GET /api/users
router.get('/users', authMiddleware, async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await Users.find().select('-password'); // Exclude password field from the response
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});


// POST /api/register
router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('dateOfBirth', 'Date of birth is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
  ],
  validate,
  async (req, res) => {
    const { name, dateOfBirth, email, password } = req.body;

    try {
      // Check if user already exists
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      user = new User({
        name,
        dateOfBirth,
        email,
        password: hashedPassword
      });

      // Save the user to the database
      await user.save();

      // Generate JWT token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.status(201).json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  }
);

// POST /api/login
router.post(
  '/login',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('password', 'Password is required').exists()
  ],
  validate,
  async (req, res) => {
    const { name, password } = req.body;

    try {
      // Find user by username
      const user = await User.findOne({ name });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Validate password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Generate JWT token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  }
);


module.exports = router;
