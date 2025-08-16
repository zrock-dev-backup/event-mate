import { useState, useEffect, useCallback } from "react";
import { getEventsForUser } from "../../services/eventService";
import type { Event } from "../../models/event";
import { useAuth } from "../../AuthContext";

/**
 * Custom hook to fetch and manage a list of events for the current user.
 * @returns An object containing the events list, loading state, and any errors.
 */
export const useEvents = () => {
  const { currentUser } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    if (!currentUser) {
      // This case is a safeguard; ProtectedRoute should prevent it.
      setError("You must be logged in to view events.");
      setIsLoading(false);
      setEvents([]);
      return;
    }

    try {
      setIsLoading(true);
      const fetchedEvents = await getEventsForUser(currentUser.uid);
      // Sort events by date, most recent first
      fetchedEvents.sort((a, b) => b.date.toMillis() - a.date.toMillis());
      setEvents(fetchedEvents);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch events:", err);
      setError("Could not load your events. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return { events, isLoading, error, refetchEvents: fetchEvents };
};
