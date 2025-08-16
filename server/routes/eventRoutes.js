const express = require('express');
const Event = require('../models/Event');
const router = express.Router();

// GET all events (with status filtering)
router.get('/', async (req, res) => {
  try {
    const { status, category, priority, limit } = req.query;
    let filter = {};

    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;

    let query = Event.find(filter)
      .sort({ priority: -1, submittedAt: -1 }) // Featured events first, then by submission date
      .select('-__v'); // Exclude version field

    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const events = await query;

    res.json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch events',
      error: error.message
    });
  }
});

// GET single event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch event',
      error: error.message
    });
  }
});

// POST create new event (automatically set to pending)
router.post('/', async (req, res) => {
  try {
    // Extract form data
    const {
      eventName,
      description,
      address,
      date,
      time,
      category,
      image,
      organizer
    } = req.body;

    // Validate required fields
    if (!eventName || !description || !address || !date || !time || !category) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
        required: ['eventName', 'description', 'address', 'date', 'time', 'category']
      });
    }

    // Create new event with pending status
    const newEvent = new Event({
      eventName: eventName.trim(),
      description: description.trim(),
      address: address.trim(),
      date: new Date(date),
      time: time.trim(),
      category,
      image: image || null,
      organizer: organizer || { name: 'Anonymous' },
      status: 'pending' // Always pending when submitted
    });

    // Save to database
    const savedEvent = await newEvent.save();

    res.status(201).json({
      success: true,
      message: 'Event submitted successfully! It will be reviewed by admin.',
      data: savedEvent
    });
  } catch (error) {
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create event',
      error: error.message
    });
  }
});

// PUT update event status (admin only)
router.put('/:id/status', async (req, res) => {
  try {
    const { status, reviewedBy, rejectionReason, priority } = req.body;

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be: approved, rejected, or pending'
      });
    }

    // If approving, priority is required
    if (status === 'approved' && !priority) {
      return res.status(400).json({
        success: false,
        message: 'Priority is required when approving an event. Must be: recommended or featured'
      });
    }

    // Validate priority if provided
    if (priority && !['recommended', 'featured'].includes(priority)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid priority. Must be: recommended or featured'
      });
    }

    const updateData = {
      status,
      reviewedAt: new Date(),
      reviewedBy: reviewedBy || 'Admin'
    };

    // Set priority only for approved events
    if (status === 'approved') {
      updateData.priority = priority;
    } else if (status === 'rejected') {
      // Clear priority for rejected events and set rejection reason
      updateData.priority = null;
      if (rejectionReason) {
        updateData.rejectionReason = rejectionReason;
      }
    }

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      message: `Event ${status} successfully`,
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update event status',
      error: error.message
    });
  }
});

// DELETE event
router.delete('/:id', async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete event',
      error: error.message
    });
  }
});

// GET pending events count (for admin dashboard)
router.get('/admin/stats', async (req, res) => {
  try {
    const stats = await Event.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const result = {
      pending: 0,
      approved: 0,
      rejected: 0,
      total: 0
    };

    stats.forEach(stat => {
      result[stat._id] = stat.count;
      result.total += stat.count;
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message
    });
  }
});

module.exports = router;
