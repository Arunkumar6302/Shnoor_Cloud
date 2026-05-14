const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  originalName: { type: String, required: true },
  type: { type: String, required: true }, // like image/png etc
  size: { type: Number, required: true },
  url: { type: String, required: true },
  cloudinaryId: { type: String, required: true }, // kinda legacy name, we use it for local filename now
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  folder: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder', default: null },
  isStarred: { type: Boolean, default: false },
  isTrashed: { type: Boolean, default: false },
  sharedWith: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    permission: { type: String, enum: ['view', 'edit'], default: 'view' }
  }],
  publicLink: { type: String },
  isPublic: { type: Boolean, default: false },
  accessLevel: { type: String, enum: ['restricted', 'public'], default: 'restricted' },
}, { timestamps: true });

module.exports = mongoose.model('File', schema);
