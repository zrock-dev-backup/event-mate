import { useEffect, useState, type FormEvent } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  TextField,
} from "@mui/material";
import type { Event } from "../../models/event";
import type { NewEventData, UpdateEventData } from "../../services/eventService";

interface EventFormProps {
  eventToEdit?: Event | null;
  onSubmit: (
    data: NewEventData | UpdateEventData,
    imageFile?: File,
  ) => Promise<void>;
  isSaving: boolean;
}

/**
 * A controlled form for creating and editing events.
 * Populates fields if `eventToEdit` is provided.
 * Manages form state and delegates submission logic via props.
 */
export default function EventForm({
  eventToEdit,
  onSubmit,
  isSaving,
}: EventFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(""); // Stored as 'YYYY-MM-DDTHH:mm' for input compatibility
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);

  useEffect(() => {
    if (eventToEdit) {
      setTitle(eventToEdit.title);
      setDescription(eventToEdit.description);
      setLocation(eventToEdit.location);
      setCategory(eventToEdit.category);

      // Convert Firestore Timestamp to a string compatible with 'datetime-local' input
      const jsDate = eventToEdit.date.toDate();
      // Adjust for timezone offset to display correctly in the user's local time
      const timezoneOffset = jsDate.getTimezoneOffset() * 60000;
      const localDate = new Date(jsDate.getTime() - timezoneOffset);
      setDate(localDate.toISOString().slice(0, 16));
    } else {
      // Reset form for creation
      setTitle("");
      setDescription("");
      setDate("");
      setLocation("");
      setCategory("");
      setImageFile(undefined);
    }
  }, [eventToEdit]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title || !date || !location || !category) {
      alert("Please fill in all required fields.");
      return;
    }

    const eventData = {
      title,
      description,
      date: new Date(date), // Convert string back to JS Date object for the service
      location,
      category,
    };

    onSubmit(eventData, imageFile);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Stack spacing={3}>
        <TextField
          label="Event Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          fullWidth
          disabled={isSaving}
        />
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
          rows={4}
          fullWidth
          disabled={isSaving}
        />
        <TextField
          label="Date and Time"
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          fullWidth
          InputLabelProps={{ shrink: true }}
          disabled={isSaving}
        />
        <TextField
          label="Location (e.g., '123 Main St' or 'Zoom Link')"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
          fullWidth
          disabled={isSaving}
        />
        <TextField
          label="Category (e.g., 'Academic', 'Social')"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          fullWidth
          disabled={isSaving}
        />
        <Button variant="outlined" component="label" disabled={isSaving}>
          {imageFile ? `Image: ${imageFile.name}` : "Upload Featured Image"}
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={(e) => e.target.files && setImageFile(e.target.files[0])}
          />
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isSaving}
          sx={{ height: 40 }}
        >
          {isSaving ? (
            <CircularProgress size={24} />
          ) : eventToEdit ? (
            "Save Changes"
          ) : (
            "Create Event"
          )}
        </Button>
      </Stack>
    </Box>
  );
}
