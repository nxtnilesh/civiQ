const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, upload.single('image'), (req, res) => {
    if (req.file) {
        res.send(`/${req.file.path.replace(/\\/g, '/')}`);
    } else {
        res.status(400).send('No image uploaded');
    }
});

module.exports = router;
