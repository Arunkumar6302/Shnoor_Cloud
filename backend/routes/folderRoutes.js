const express = require('express');
const router = express.Router();
const { createFolder, getFolders } = require('../controllers/folderController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // protect all folder endpoints

router.get('/', getFolders);
router.post('/', createFolder);

module.exports = router;
