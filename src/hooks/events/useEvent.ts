import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  type NewEventData,
  type UpdateEventData,
} from "../../services/eventService";
import type { Event } from "../../models/event";
import { useAuth } from "../../AuthContext";

/**
 * Manages state and actions for a single event.
 * - Fetches an event if eventId is provided.
 * - Provides handlers for saving (create/update) and deleting an event.
 * @param eventId The ID of the event to manage. If undefined, operates in "create" mode.
 */
export const useEvent = (eventId?: string) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) {
        setIsLoading(false);
        setEvent(null); // Ensure event is null for create mode
        return;
      }

      try {
        setIsLoading(true);
        const fetchedEvent = await getEventById(eventId);
        if (fetchedEvent) {
          if (currentUser && fetchedEvent.ownerId !== currentUser.uid) {
            setError("You do not have permission to view this event.");
            setEvent(null);
          } else {
            setEvent(fetchedEvent);
            setError(null);
          }
        } else {
          setError("Event not found.");
          setEvent(null);
        }
      } catch (err) {
        console.error(`Failed to fetch event ${eventId}:`, err);
        setError("Could not load the event details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [eventId, currentUser]);

  const handleSaveEvent = async (
    data: NewEventData | UpdateEventData,
    imageFile?: File,
  ) => {
    if (!currentUser) {
      setError("Authentication error. Please sign in again.");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      if (eventId && event) { // Edit mode
        await updateEvent(eventId, data, imageFile);
        navigate(`/events/${eventId}`);
      } else { // Create mode
        const newEvent = await createEvent(
          data as NewEventData,
          imageFile,
          currentUser.uid,
        );
        navigate(`/events/${newEvent.id}`);
      }
    } catch (err) {
      console.error("Failed to save event:", err);
      setError("Failed to save the event. Please try again.");
      setIsSaving(false); // Ensure saving state is reset on error
    }
  };

  const handleDeleteEvent = async () => {
    if (!eventId || !currentUser || !event) return;
    if (event.ownerId !== currentUser.uid) {
      setError("You do not have permission to delete this event.");
      return;
    }

    if (window.confirm("Are you sure you want to permanently delete this event?")) {
      try {
        await deleteEvent(eventId);
        navigate("/events");
      } catch (err) {
        console.error("Failed to delete event:", err);
        setError("Failed to delete the event. Please try again.");
      }
    }
  };

  return { event, isLoading, isSaving, error, handleSaveEvent, handleDeleteEvent };
};
