const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  googleId: { type: String }, // for later oauth
  avatar: { type: String },
  storageUsed: { type: Number, default: 0 },
  storageLimit: { type: Number, default: 15 * 1024 * 1024 * 1024 }, // giving everyone 15gb for now
}, { timestamps: true });


schema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  if (this.password) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
});

schema.methods.matchPassword = async function (plainTextPassword) {
  if (!this.password) return false; // in case they registered via google
  return await bcrypt.compare(plainTextPassword, this.password);
};

module.exports = mongoose.model('User', schema);
