import Event from '../models/Event.js';
import User from '../models/User.js'; // assuming you have a User model

// List all events (optionally filter by query like ?status=upcoming)
export const getAllEvents = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const events = await Event.find(filter);
    res.json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get event by ID
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    res.json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create event (Coordinator/Admin)
export const createEvent = async (req, res) => {
  console.log('Trying in backend',req.body);
  try {
    const event = new Event({ ...req.body, createdBy: req.user.id });
    await event.save();
    res.status(201).json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update event (Coordinator/Admin)
export const editEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    Object.assign(event, req.body);
    await event.save();
    res.json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete event (Coordinator/Admin)
// Backend controller example
export const deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    
    console.log('Attempting to delete event with ID:', eventId);
    
    // First, try to find the event
    const event = await Event.findById(eventId);
    console.log('Found event:', event);
    
    if (!event) {
      console.log('Event not found in database');
      return res.status(404).json({ 
        success: false, 
        message: 'Event not found' 
      });
    }
    
    // Now delete it
    await Event.findByIdAndDelete(eventId);
    
    console.log('Event deleted successfully');
    res.status(200).json({ 
      success: true, 
      message: 'Event deleted successfully' 
    });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};


// Get registrations for event (Coordinator/Admin)
export const getEventRegistrations = async (req, res) => {
  try {
    // Assuming you have a registration system — example below
    // Fetch users registered for event
    const event = await Event.findById(req.params.eventId).populate('registeredUsers', 'name email');
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    res.json({ success: true, data: event.registeredUsers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Register user to event (Authenticated User)
export const registerEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    // Add registration logic:
    // e.g. event.registeredUsers.push(req.user._id);
    // await event.save();
    res.json({ success: true, message: 'Registered for the event' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Remove user registration (Coordinator/Admin)
export const removeUserRegistration = async (req, res) => {
  try {
    const { eventId, userId } = req.params;
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

    // Remove user from registeredUsers
    event.registeredUsers = event.registeredUsers.filter(uid => uid.toString() !== userId);
    await event.save();

    res.json({ success: true, message: 'User registration removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
