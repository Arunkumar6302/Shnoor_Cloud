const File = require('../models/File');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');
const { sendShareEmail } = require('../utils/mailService');

const uploadFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Hey, you forgot to attach a file!' });

    const newFile = await File.create({
      name: req.file.originalname,
      originalName: req.file.originalname,
      type: req.file.mimetype,
      size: req.file.size || 0,
      url: `/uploads/${req.file.filename}`,
      cloudinaryId: req.file.filename,
      owner: req.user._id,
      folder: req.body.folderId || null,
    });

    await User.findByIdAndUpdate(req.user._id, {
      $inc: { storageUsed: req.file.size || 0 }
    });

    
    req.io.emit('file_uploaded', newFile);

    res.status(201).json(newFile);
  } catch (err) {
    console.error("upload error:", err);
    res.status(500).json({ message: 'Something went wrong while uploading' });
  }
};

const getFiles = async (req, res) => {
  try {
    const { folder, isTrashed, isStarred, search } = req.query;
    
    let query = { owner: req.user._id };
    
    if (isTrashed === 'true') {
      query.isTrashed = true;
    } else {
      query.isTrashed = false;
      if (isStarred === 'true') query.isStarred = true;
      if (folder) query.folder = folder;
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const files = await File.find(query).sort({ updatedAt: -1 });
    return res.json(files);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Could not fetch your files' });
  }
};

const updateFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    
    if (!file) return res.status(404).json({ message: 'File not found' });
    
    if (file.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not allowed to edit this file' });
    }

    const { name, isStarred, isTrashed, folder, isPublic, accessLevel, emails } = req.body;
    
    const wasPublic = file.isPublic;
    const oldName = file.name;
    const wasTrashed = file.isTrashed;
    const wasStarred = file.isStarred;

    if (name !== undefined) file.name = name;
    if (isStarred !== undefined) file.isStarred = isStarred;
    if (isTrashed !== undefined) file.isTrashed = isTrashed;
    if (folder !== undefined) file.folder = folder;
    if (isPublic !== undefined) file.isPublic = isPublic;
    if (accessLevel !== undefined) file.accessLevel = accessLevel;

    if (emails && Array.isArray(emails)) {
      const users = await User.find({ email: { $in: emails } });
      file.sharedWith = users.map(u => ({
        user: u._id,
        permission: 'view'
      }));
      // Priority 1: Sharing
      req.io.emit('file_shared', file);

      // Send emails to everyone in the list
      for (const email of emails) {
        await sendShareEmail(email, file.name, file.url, req.user.name, file._id);
      }
    } else if (isPublic !== undefined && isPublic === true && !wasPublic) {
      // Priority 2: Public Link Enabled
      req.io.emit('file_shared', file);
    } else if (isTrashed !== undefined && isTrashed === true && !wasTrashed) {
      // Priority 3: Trashed
      req.io.emit('file_trashed', file);
    } else if (isStarred !== undefined && isStarred !== wasStarred) {
      // Priority 4: Starred
      req.io.emit('file_starred', file);
    } else if (name !== undefined && name !== oldName) {
      // Priority 5: Renamed
      req.io.emit('file_renamed', file);
    } else {
      // Default: General update
      req.io.emit('file_updated', file);
    }

    await file.save();
    return res.json(file);
  } catch (err) {
    res.status(500).json({ message: 'Error updating file' });
  }
};

const deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) return res.status(404).json({ message: 'File is missing' });
    if (file.owner.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Unauthorized action' });
    const filePath = path.join(__dirname, '..', 'uploads', file.cloudinaryId);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    await file.deleteOne();

    await User.findByIdAndUpdate(req.user._id, {
      $inc: { storageUsed: -(file.size || 0) }
    });

    req.io.emit('file_deleted', req.params.id);

    res.json({ message: 'File permanently deleted' });
  } catch (err) {
    console.error("delete error:", err);
    res.status(500).json({ message: 'Failed to delete file' });
  }
};

module.exports = {
  uploadFile,
  getFiles,
  updateFile,
  deleteFile
};
