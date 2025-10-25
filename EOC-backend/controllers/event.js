import Event from '../models/Event.js';
import User from '../models/User.js';

/**
 * PUBLIC ROUTES
 */

// Get all events (optionally filter by query like ?status=upcoming)
export const getAllEvents = async (req, res) => {
  try {
    const filter = {};
    
    // Optional query filters
    if (req.query.status) {
      filter.status = req.query.status;
    }
    
    if (req.query.category) {
      filter.category = req.query.category;
    }

    // Populate participants if needed
    const events = await Event.find(filter)
      .populate('createdBy', 'name email')
      .sort({ date: -1 }); // Sort by date, newest first

    res.status(200).json({ 
      success: true, 
      data: events 
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Get event by ID
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId)
      .populate('createdBy', 'name email')
      .populate('participants', 'name email year');

    if (!event) {
      return res.status(404).json({ 
        success: false, 
        message: 'Event not found' 
      });
    }

    res.status(200).json({ 
      success: true, 
      data: event 
    });
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

/**
 * STUDENT ROUTES (Authentication required)
 */

// Register for an event
export const registerEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id; // From protect middleware

    console.log('Registration attempt - EventId:', eventId, 'UserId:', userId);

    // Find event
    const event = await Event.findById(eventId);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if registration is required
    if (!event.registrationRequired) {
      return res.status(400).json({
        success: false,
        message: 'Registration is not required for this event'
      });
    }

    // Check if event date has passed or is completed
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventDate = new Date(event.date);
    eventDate.setHours(0, 0, 0, 0);

    if (eventDate < today || event.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Registration is closed for this event'
      });
    }

    // Check if already registered
    const isAlreadyRegistered = event.participants.some(
      participantId => participantId.toString() === userId.toString()
    );

    if (isAlreadyRegistered) {
      return res.status(400).json({
        success: false,
        message: 'You are already registered for this event'
      });
    }

    // Add user to event participants
    event.participants.push(userId);
    await event.save();

    // Add event to user's registered events
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!user.registeredEvents) {
      user.registeredEvents = [];
    }
    
    const isEventInUserList = user.registeredEvents.some(
      eventIdInList => eventIdInList.toString() === eventId.toString()
    );
    
    if (!isEventInUserList) {
      user.registeredEvents.push(eventId);
      await user.save();
    }

    console.log('Registration successful');

    res.status(200).json({
      success: true,
      message: 'Successfully registered for event',
      data: event
    });

  } catch (error) {
    console.error('Error registering for event:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register for event',
      error: error.message
    });
  }
};

// Unregister from an event
export const unregisterEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;

    console.log('Unregister attempt - EventId:', eventId, 'UserId:', userId);

    // Find event
    const event = await Event.findById(eventId);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if event date has passed or is completed
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventDate = new Date(event.date);
    eventDate.setHours(0, 0, 0, 0);

    if (eventDate < today || event.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot unregister from past or completed events'
      });
    }

    // Check if user is registered
    const isRegistered = event.participants.some(
      participantId => participantId.toString() === userId.toString()
    );

    if (!isRegistered) {
      return res.status(400).json({
        success: false,
        message: 'You are not registered for this event'
      });
    }

    // Remove user from event participants
    event.participants = event.participants.filter(
      participantId => participantId.toString() !== userId.toString()
    );
    await event.save();

    // Remove event from user's registered events
    const user = await User.findById(userId);
    if (user && user.registeredEvents) {
      user.registeredEvents = user.registeredEvents.filter(
        eventIdInList => eventIdInList.toString() !== eventId.toString()
      );
      await user.save();
    }

    console.log('Unregistration successful');

    res.status(200).json({
      success: true,
      message: 'Successfully unregistered from event',
      data: event
    });

  } catch (error) {
    console.error('Error unregistering from event:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to unregister from event',
      error: error.message
    });
  }
};

/**
 * COORDINATOR/ADMIN ROUTES
 */

// Create event
export const createEvent = async (req, res) => {
  try {
    console.log('Creating event with data:', req.body);
    console.log('User ID:', req.user.id);

    const eventData = {
      ...req.body,
      createdBy: req.user.id
    };

    const event = new Event(eventData);
    await event.save();

    console.log('Event created successfully:', event._id);

    res.status(201).json({ 
      success: true, 
      data: event,
      message: 'Event created successfully'
    });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Update/Edit event
export const editEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    
    console.log('Updating event:', eventId);
    console.log('Update data:', req.body);

    const event = await Event.findById(eventId);
    
    if (!event) {
      return res.status(404).json({ 
        success: false, 
        message: 'Event not found' 
      });
    }

    // Check if user is the creator (optional security check)
    if (event.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to edit this event'
      });
    }

    // Update event fields
    Object.assign(event, req.body);
    await event.save();

    console.log('Event updated successfully');

    res.status(200).json({ 
      success: true, 
      data: event,
      message: 'Event updated successfully'
    });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Delete event
export const deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    
    console.log('Attempting to delete event with ID:', eventId);
    
    // Find the event first
    const event = await Event.findById(eventId);
    
    if (!event) {
      console.log('Event not found in database');
      return res.status(404).json({ 
        success: false, 
        message: 'Event not found' 
      });
    }

    // Optional: Check if user is the creator
    if (event.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this event'
      });
    }

    // Remove event from all registered users
    if (event.participants && event.participants.length > 0) {
      await User.updateMany(
        { _id: { $in: event.participants } },
        { $pull: { registeredEvents: eventId } }
      );
    }
    
    // Delete the event
    await Event.findByIdAndDelete(eventId);
    
    console.log('Event deleted successfully');
    
    res.status(200).json({ 
      success: true, 
      message: 'Event deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Get registrations/participants for an event
export const getEventRegistrations = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId)
      .populate('participants', 'name email year');
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.status(200).json({
      success: true,
      data: event.participants,
      count: event.participants.length
    });

  } catch (error) {
    console.error('Error fetching registrations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch registrations',
      error: error.message
    });
  }
};

// Remove a user's registration (Coordinator removing a student)
export const removeUserRegistration = async (req, res) => {
  try {
    const { eventId, userId } = req.params;

    console.log('Removing user registration - EventId:', eventId, 'UserId:', userId);

    // Find event
    const event = await Event.findById(eventId);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user is registered
    const isRegistered = event.participants.some(
      participantId => participantId.toString() === userId.toString()
    );

    if (!isRegistered) {
      return res.status(400).json({
        success: false,
        message: 'User is not registered for this event'
      });
    }

    // Remove user from event participants
    event.participants = event.participants.filter(
      participantId => participantId.toString() !== userId.toString()
    );
    await event.save();

    // Remove event from user's registered events
    const user = await User.findById(userId);
    if (user && user.registeredEvents) {
      user.registeredEvents = user.registeredEvents.filter(
        eventIdInList => eventIdInList.toString() !== eventId.toString()
      );
      await user.save();
    }

    console.log('User registration removed successfully');

    res.status(200).json({
      success: true,
      message: 'User registration removed successfully'
    });

  } catch (error) {
    console.error('Error removing registration:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove registration',
      error: error.message
    });
  }
};
