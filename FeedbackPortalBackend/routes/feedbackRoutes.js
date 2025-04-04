
import express from 'express';
const router = express.Router();
import mongoose from 'mongoose';
import Feedback from '../models/feedback.js';
import User from '../models/User.js';
import Company from '../models/Company.js';


const validateUserId = async (req, res, next) => {
    const { userId } = req.body;

    try {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: 'Invalid userId: Not a valid ObjectId.' });
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ error: 'Invalid userId: User not found.' });
        }
        req.user = user;
        next();
    } catch (err) {
        console.error('Error validating userId:', err);
        return res.status(500).json({ error: 'Error validating user.', details: err.message });
    }
};

const validateCompanyId = async (req, res, next) => {
    const { companyId } = req.body;

    try {
        if (!mongoose.Types.ObjectId.isValid(companyId)) {
            return res.status(400).json({ error: 'Invalid companyId: Not a valid ObjectId.' });
        }
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(400).json({ error: 'Invalid companyId: Company not found.' });
        }
        req.company = company;
        next();
    } catch (err) {
        console.error('Error validating companyId:', err);
        return res.status(500).json({ error: 'Error validating company.', details: err.message });
    }
};


router.post('/', validateUserId, validateCompanyId, async (req, res) => {
    try {
        const {
            name,
            rollNumber,
            department,
            companyName,
            companyLocation,
            role,
            placementType,
            totalRounds,
            rounds,
            additionalDetails,
            tips,
            month,
            year,
            preparationTime,
            skillsUsed,
            privacyAgreement,
            companyId, // Get companyId from request body
        } = req.body;

        const newFeedback = new Feedback({
            userId: req.user._id,
            companyId: req.company._id, // Set companyId for the feedback
            name,
            rollNumber,
            department,
            companyName,
            companyLocation,
            role,
            placementType,
            totalRounds,
            rounds,
            additionalDetails,
            tips,
            month,
            year,
            preparationTime,
            skillsUsed,
            privacyAgreement,
        });

        const savedFeedback = await newFeedback.save();

        console.log('Feedback saved successfully:', savedFeedback);
        res.status(201).json({ message: 'Feedback submitted successfully!', feedbackId: savedFeedback._id });
    } catch (error) {
        console.error('Error saving feedback:', error);
        if (error.name === 'ValidationError') { //Mongoose validation error
            return res.status(400).json({ error: 'Validation failed', details: error.errors }); //400 for bad request
        }
        res.status(500).json({ error: 'Failed to save feedback.', details: error.message, stack: error.stack }); //Include error stack for debugging
    }
});


router.get('/', async (req, res) => {
    try {
        const userId = req.query.userId;
        const companyId = req.query.companyId; // Get companyId from query params
        let query = {};

        if (userId) {
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                 return res.status(400).json({ error: 'Invalid userId: Not a valid ObjectId.' });
            }
            query.userId = userId;
        }
        if (companyId) {
             if (!mongoose.Types.ObjectId.isValid(companyId)) {
                 return res.status(400).json({ error: 'Invalid companyId: Not a valid ObjectId.' });
            }
            query.companyId = companyId; // Filter by companyId if provided
        }

        const allFeedback = await Feedback.find(query).populate('userId', 'username email');
        res.status(200).json(allFeedback);
    } catch (error) {
        console.error('Error fetching feedback:', error);
        res.status(500).json({ error: 'Failed to fetch feedback.', details: error.message, stack: error.stack });
    }
});


router.get('/:id', async (req, res) => {
    try {
        const feedbackId = req.params.id;
         if (!mongoose.Types.ObjectId.isValid(feedbackId)) {
                 return res.status(400).json({ error: 'Invalid feedbackId: Not a valid ObjectId.' });
            }
        const feedback = await Feedback.findById(feedbackId);
        if (!feedback) {
            return res.status(404).json({ error: "Feedback not found" });
        }
        res.status(200).json(feedback);
    } catch (error) {
        console.error("Error getting feedback:", error);
         if (error.name === 'CastError') {
                return res.status(400).json({ error: 'Invalid feedbackId: Malformed ObjectId' });
            }
        res.status(500).json({ error: 'Failed to fetch feedback.', details: error.message, stack: error.stack });
    }
})



router.put('/:id', async (req, res) => {
    try {
        const feedbackId = req.params.id;
        const {
            name,
            rollNumber,
            department,
            companyName,
            companyLocation,
            role,
            placementType,
            totalRounds,
            rounds,
            additionalDetails,
            tips,
            month,
            year,
            preparationTime,
            skillsUsed,
            privacyAgreement,
        } = req.body;

        // Find the feedback by ID and update it
        const updatedFeedback = await Feedback.findByIdAndUpdate(
            feedbackId,
            {
                name,
                rollNumber,
                department,
                companyName,
                companyLocation,
                role,
                placementType,
                totalRounds,
                rounds,
                additionalDetails,
                tips,
                month,
                year,
                preparationTime,
                skillsUsed,
                privacyAgreement,
            },
            { new: true, runValidators: true } //  new: true to return the updated document and runValidators: true to ensure validation during the update.
        );

        if (!updatedFeedback) {
            return res.status(404).json({ error: 'Feedback not found' });
        }

        console.log('Feedback updated successfully:', updatedFeedback);
        res.status(200).json({ message: 'Feedback updated successfully!', feedback: updatedFeedback });

    } catch (error) {
        console.error('Error updating feedback:', error);
        res.status(500).json({ error: 'Failed to update feedback.', details: error.message });
    }
});
export default router;