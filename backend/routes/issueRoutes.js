const express = require('express');
const router = express.Router();
const {
    getIssues,
    getIssueById,
    createIssue,
    updateIssueStatus,
    upvoteIssue,
    addComment
} = require('../controllers/issueController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(getIssues)
    .post(protect, createIssue);

router.route('/:id')
    .get(getIssueById);

router.route('/:id/status')
    .put(protect, admin, updateIssueStatus);

router.route('/:id/upvote')
    .put(protect, upvoteIssue);

router.route('/:id/comments')
    .post(protect, addComment);

module.exports = router;
