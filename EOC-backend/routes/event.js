import { Router } from 'express';
import { protect } from "../middlewares/authMiddleware.js";
import  {authorizeRole } from "../middlewares/roleMiddleware.js";
import {
  getAllEvents,
  getEventById,
  createEvent,
  editEvent,
  deleteEvent,
  getEventRegistrations,
  registerEvent,
  removeUserRegistration,
} from "../controllers/event.js";

const eventRoutes = Router();

/**
 * Public/Authenticated Routes
 */

// Get all events (filter by query if needed: upcoming, completed)
eventRoutes.get("/", getAllEvents);

// Get specific event by ID
eventRoutes.get("/:eventId", getEventById);

/**
 * Coordinator/Admin Routes
 */

// Create new event
eventRoutes.post("/", protect, authorizeRole(["coordinator", "admin"]), createEvent);

// Update/edit an event
eventRoutes.put("/:eventId", protect, authorizeRole(["coordinator", "admin"]), editEvent);
eventRoutes.patch("/:eventId", protect, authorizeRole(["coordinator", "admin"]), editEvent);

// Delete an event
eventRoutes.delete("/:eventId", protect, authorizeRole(["coordinator", "admin"]), deleteEvent);

// Get list of users registered for an event
eventRoutes.get("/:eventId/registrations", protect, authorizeRole(["coordinator", "admin"]), getEventRegistrations);

// Remove a user's registration from an event
eventRoutes.delete("/:eventId/registrations/:userId", protect, authorizeRole(["coordinator", "admin"]), removeUserRegistration);

/**
 * Student Routes
 */

// Register user for an event
eventRoutes.post("/:eventId/register", protect, authorizeRole(["student"]), registerEvent);

export default eventRoutes;
