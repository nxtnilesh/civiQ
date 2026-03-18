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
            .populate('assignedTo', 'username email')
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
        const { title, description, category, subCategory, location, imageUrl, lat, lng } = req.body;

        const issue = await Issue.create({
            title,
            description,
            category,
            subCategory,
            location: location || 'Location Not Specified',
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
        const { status, assignedTo } = req.body;
        const issue = await Issue.findById(req.params.id);

        if (issue) {
            const isAdmin = req.user && req.user.role === 'authority';
            const isAssigned = issue.assignedTo && req.user && issue.assignedTo.toString() === req.user._id.toString();

            if (!isAdmin && !isAssigned) {
                return res.status(401).json({ message: 'Not authorized to update this issue status' });
            }

            if (status) issue.status = status;
            
            if (assignedTo !== undefined && isAdmin) {
                issue.assignedTo = assignedTo || null;
            }

            const updatedIssue = await issue.save();
            
            // Return fully populated issue to reflect the changes immediately
            const populatedIssue = await Issue.findById(updatedIssue._id)
                .populate('author', 'username email')
                .populate('assignedTo', 'username email')
                .populate('comments.user', 'username');

            res.status(200).json(populatedIssue);
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

// @desc    Get logged in user issues
// @route   GET /api/issues/my
// @access  Private
const getUserIssues = async (req, res) => {
    try {
        const issues = await Issue.find({ author: req.user._id }).populate('author', 'username email').sort({ createdAt: -1 });
        res.status(200).json(issues);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Review a resolved issue
// @route   POST /api/issues/:id/review
// @access  Private
const reviewIssue = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const issue = await Issue.findById(req.params.id);

        if (!issue) return res.status(404).json({ message: 'Issue not found' });
        
        if (issue.author.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized to review this issue' });
        }

        if (issue.status !== 'Resolved') {
            return res.status(400).json({ message: 'Issue must be resolved before reviewing' });
        }

        if (issue.resolutionReview && issue.resolutionReview.rating) {
             return res.status(400).json({ message: 'Issue already reviewed' });
        }

        issue.resolutionReview = {
            rating: Number(rating),
            comment,
            createdAt: Date.now()
        };

        const updatedIssue = await issue.save();
        res.status(201).json(updatedIssue);
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
    addComment,
    getUserIssues,
    reviewIssue
};
