const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', { title: 1, author: 1 });
  response.json(users);
});

usersRouter.get('/:id', async (request, response) => {
  const user = await User.findById(request.params.id);
  if (user){
    response.json(user);
  } else {
    response.status(404).end();
  }
});

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body;

  if (password.length < 3) {
    return response.status(400).json({ error: 'Password must be at least 3 characters long.' });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save();

  response.status(201).json(savedUser);
});

usersRouter.put('/:id', async (request, response) => {
  const { id } = request.params;
  const { username, name, password } = request.body;

  try {
    // Find the user by ID
    const user = await User.findById(id);

    if (!user) {
      return response.status(404).json({ error: 'User not found' });
    }

    // Update properties of the user
    user.username = username || user.username;
    user.name = name || user.name;

    // If a new password is provided, hash and update the password
    if (password) {
      if (password.length < 3) {
        return response.status(400).json({ error: 'Password must be at least 3 characters long.' });
      }
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);
      user.passwordHash = passwordHash;
    }

    // Save the updated user
    const updatedUser = await user.save();

    response.json(updatedUser);
  } catch (error) {
    response.status(400).json({ error: 'Invalid request' });
  }
});

usersRouter.delete('/:id', async (request, response) => {
  await User.findByIdAndRemove(request.params.id);
  response.status(204).end();
});


module.exports = usersRouter;
