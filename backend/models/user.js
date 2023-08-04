const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const noSpacesValidator = (value) => {
  if (value.includes(' ')) {
    throw new Error('Username must not contain spaces');
  }
};

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    minLength: 3,
    required: true,
    unique: true,
    validate: [noSpacesValidator, 'Username must not contain spaces'],
  },
  name: String,
  passwordHash: String,
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ],
})

userSchema.plugin(uniqueValidator);

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash
  }
})

const User = mongoose.model('User', userSchema);

module.exports = User;