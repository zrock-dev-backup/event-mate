import type { Timestamp } from "firebase/firestore";

/**
 * Represents a single event in the EventMate application.
 * This is the core data entity that users create and manage.
 */
export interface Event {
  id: string;
  title: string;
  description: string;
  date: Timestamp;
  location: string;
  category: string;
  imageUrl?: string; // Optional URL for the event's featured image
  ownerId: string; // The UID of the user who created the event
}
