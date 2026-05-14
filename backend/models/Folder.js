const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder', default: null }, // null means root folder
  color: { type: String, default: 'bg-violet-500' }, // UI color tag
  isStarred: { type: Boolean, default: false },
  isTrashed: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Folder', schema);
