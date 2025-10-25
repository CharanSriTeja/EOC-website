import { Router } from 'express';
import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRole } from "../middlewares/roleMiddleware.js";
import {
  getAllEvents,
  getEventById,
  createEvent,
  editEvent,
  deleteEvent,
  getEventRegistrations,
  registerEvent,
  unregisterEvent, // ADD THIS
  removeUserRegistration,
} from "../controllers/event.js";

const eventRoutes = Router();

/**
 * Public Routes (No authentication required)
 */

// Get all events (filter by query if needed: ?status=upcoming)
eventRoutes.get("/", getAllEvents);

// Get specific event by ID
eventRoutes.get("/:eventId", getEventById);

/**
 * Student Routes (Authentication required)
 */

// Register for an event
eventRoutes.post("/:eventId/register", protect, authorizeRole(["student"]), registerEvent);

// Unregister from an event (ADD THIS)
eventRoutes.delete("/:eventId/register", protect, authorizeRole(["student"]), unregisterEvent);

/**
 * Coordinator/Admin Routes
 */

// Create new event
eventRoutes.post("/", protect, authorizeRole(["coordinator", "admin"]), createEvent);

// Update/edit an event (using PATCH only, removed PUT)
eventRoutes.patch("/:eventId", protect, authorizeRole(["coordinator", "admin"]), editEvent);

// Delete an event
eventRoutes.delete("/:eventId", protect, authorizeRole(["coordinator", "admin"]), deleteEvent);

// Get list of users registered for an event
eventRoutes.get("/:eventId/registrations", protect, authorizeRole(["coordinator", "admin"]), getEventRegistrations);

// Remove a user's registration from an event (coordinator removing a student)
eventRoutes.delete("/:eventId/registrations/:userId", protect, authorizeRole(["coordinator", "admin"]), removeUserRegistration);

export default eventRoutes;
