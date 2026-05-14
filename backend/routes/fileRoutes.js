const express = require('express');
const router = express.Router();
const { uploadFile, getFiles, deleteFile, updateFile } = require('../controllers/fileController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../config/upload');


router.use(protect);

router.get('/', getFiles);
router.post('/upload', upload.single('file'), uploadFile);

router.put('/:id', updateFile);
router.delete('/:id', deleteFile);

module.exports = router;
