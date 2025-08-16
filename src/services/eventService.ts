import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import type { Event } from "../models/event";
import { uploadImage } from "./cloudinaryService";

// Type definition for creating a new event, omitting Firestore-generated fields.
export type NewEventData = Omit<Event, "id" | "imageUrl" | "ownerId" | "date"> & {
  date: Date; // Use JS Date for input, convert to Timestamp for Firestore
};

// Type definition for updating an event. All fields are optional.
export type UpdateEventData = Partial<NewEventData>;

/**
 * Creates a new event in Firestore and uploads an associated image.
 * @param eventData - The core data for the new event.
 * @param imageFile - The optional image file to be uploaded.
 * @param ownerId - The UID of the user creating the event.
 * @returns The newly created event object with its Firestore ID.
 */
export const createEvent = async (
  eventData: NewEventData,
  imageFile: File | undefined,
  ownerId: string,
): Promise<Event> => {
  let imageUrl: string | undefined = undefined;
  if (imageFile) {
    imageUrl = await uploadImage(imageFile);
  }

  const eventToSave = {
    ...eventData,
    date: Timestamp.fromDate(eventData.date), // Convert JS Date to Firestore Timestamp
    imageUrl,
    ownerId,
  };

  const docRef = await addDoc(collection(db, "events"), eventToSave);
  return { id: docRef.id, ...eventToSave };
};

/**
 * Fetches all events owned by a specific user.
 * @param userId - The UID of the user whose events to fetch.
 * @returns A promise that resolves to an array of Event objects.
 */
export const getEventsForUser = async (userId: string): Promise<Event[]> => {
  const eventsCollection = collection(db, "events");
  const q = query(eventsCollection, where("ownerId", "==", userId));
  const eventSnapshot = await getDocs(q);
  return eventSnapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as Event),
  );
};

/**
 * Fetches a single event by its document ID.
 * @param eventId - The ID of the event to fetch.
 * @returns The event object, or null if not found.
 */
export const getEventById = async (eventId: string): Promise<Event | null> => {
  const eventRef = doc(db, "events", eventId);
  const docSnap = await getDoc(eventRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Event;
  } else {
    console.warn(`No event found with ID: ${eventId}`);
    return null;
  }
};

/**
 * Updates an existing event document.
 * @param eventId - The ID of the event to update.
 * @param eventData - The data to update.
 * @param imageFile - An optional new image file to upload.
 */
export const updateEvent = async (
  eventId: string,
  eventData: UpdateEventData,
  imageFile: File | undefined,
): Promise<void> => {
  const dataToUpdate: { [key: string]: any } = { ...eventData };

  if (imageFile) {
    dataToUpdate.imageUrl = await uploadImage(imageFile);
  }

  if (eventData.date) {
    dataToUpdate.date = Timestamp.fromDate(eventData.date);
  }

  const eventRef = doc(db, "events", eventId);
  await updateDoc(eventRef, dataToUpdate);
};

/**
 * Deletes an event from Firestore.
 * @param eventId - The ID of the event to delete.
 */
export const deleteEvent = async (eventId: string): Promise<void> => {
  // Production Note: Deleting the image from Cloudinary requires a secure backend call.
  // A Cloud Function would be triggered on document deletion or called via an HTTPS request
  // to securely delete the image using Cloudinary's Admin API, preventing unauthorized deletions.
  // For this step, we only delete the Firestore record.
  const eventRef = doc(db, "events", eventId);
  await deleteDoc(eventRef);
};
