const Issue = require('../models/Issue');

// @desc    Get all issues
// @route   GET /api/issues
// @access  Public
const getIssues = async (req, res) => {
    try {
        const issues = await Issue.find().populate('author', 'username email').sort({ createdAt: -1 });
        res.status(200).json(issues);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single issue
// @route   GET /api/issues/:id
// @access  Public
const getIssueById = async (req, res) => {
    try {
        const issue = await Issue.findById(req.params.id)
            .populate('author', 'username email')
            .populate('comments.user', 'username');
            
        if (issue) {
            res.status(200).json(issue);
        } else {
            res.status(404).json({ message: 'Issue not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new issue
// @route   POST /api/issues
// @access  Private
const createIssue = async (req, res) => {
    try {
        const { title, description, category, location, imageUrl, lat, lng } = req.body;

        const issue = await Issue.create({
            title,
            description,
            category,
            location,
            lat,
            lng,
            imageUrl,
            author: req.user._id
        });

        res.status(201).json(issue);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update issue status
// @route   PUT /api/issues/:id/status
// @access  Private/Admin
const updateIssueStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const issue = await Issue.findById(req.params.id);

        if (issue) {
            issue.status = status;
            const updatedIssue = await issue.save();
            res.status(200).json(updatedIssue);
        } else {
            res.status(404).json({ message: 'Issue not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Upvote an issue
// @route   PUT /api/issues/:id/upvote
// @access  Private
const upvoteIssue = async (req, res) => {
    try {
        const issue = await Issue.findById(req.params.id);

        if (issue) {
            const alreadyUpvoted = issue.upvotes.includes(req.user._id);
            if (alreadyUpvoted) {
                // Optionally allow removing upvote
                issue.upvotes = issue.upvotes.filter(id => id.toString() !== req.user._id.toString());
            } else {
                issue.upvotes.push(req.user._id);
            }
            await issue.save();
            res.status(200).json(issue);
        } else {
            res.status(404).json({ message: 'Issue not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add comment to issue
// @route   POST /api/issues/:id/comments
// @access  Private
const addComment = async (req, res) => {
    try {
        const { text } = req.body;
        const issue = await Issue.findById(req.params.id);

        if (issue) {
            const comment = {
                user: req.user._id,
                text
            };
            issue.comments.push(comment);
            await issue.save();
            res.status(201).json(issue);
        } else {
            res.status(404).json({ message: 'Issue not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getIssues,
    getIssueById,
    createIssue,
    updateIssueStatus,
    upvoteIssue,
    addComment
};
