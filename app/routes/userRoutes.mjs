import express from 'express';
import User from '../../models/userModel.mjs';

const route = express.Router();


//user loging
route.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user by username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    // Check password (plain text comparison here)
    if (user.password !== password) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    // If matched
    res.json({ message: 'Login successful', user: { username: user.username, id: user._id, profile:user.profile } });

  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});


//user sign up
route.post('/singup', async (req, res) => {
  const { username, fullname, password, gender, contactNumber,profile } = req.body;

  if (!username  || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const newUser = new User({
      username,
      fullname,
      gender,
      profile,
      contactNumber,
      password
    });

    await newUser.save();

    res.status(201).json({
      message: 'User created successfully',
      user: {
        username,
        fullname,
        gender,
        contactNumber,
        password
      }
    });
    
  } catch (error) {
    console.error(error); // This will log the actual error
    res.status(500).json({ error: 'Internal server error', details: error?.message || 'Unknown error' });
}
});


export default route;
