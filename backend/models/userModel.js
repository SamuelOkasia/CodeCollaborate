const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: { type: String, unique: true },
  githubId: { type: String, unique: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['admin', 'reviewer', 'contributor'], default: 'contributor' }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
