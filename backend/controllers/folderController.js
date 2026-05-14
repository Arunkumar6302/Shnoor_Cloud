const Folder = require('../models/Folder');

const createFolder = async (req, res) => {
  try {
    const { name, parentId, color } = req.body;

    const folder = await Folder.create({
      name,
      owner: req.user._id,
      parent: parentId || null,
      color: color || 'bg-violet-500'
    });

    res.status(201).json(folder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getFolders = async (req, res) => {
  try {
    const { parent } = req.query;
    const query = { owner: req.user._id, isTrashed: false };
    
    if (parent) {
      query.parent = parent;
    } else {
      query.parent = null;
    }

    const folders = await Folder.find(query);
    res.json(folders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createFolder, getFolders };
