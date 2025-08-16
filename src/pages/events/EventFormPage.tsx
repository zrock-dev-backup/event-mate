import { useParams } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import EventForm from "../../components/events/EventForm";
import { useEvent } from "../../hooks/events/useEvent"; // Corrected import path

export default function EventFormPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const isEditMode = !!eventId;

  const { event, isLoading, error, handleSaveEvent, isSaving } = useEvent(eventId);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // In edit mode, if there's an error (e.g., not found, permission denied), show it.
  if (isEditMode && error) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {isEditMode ? "Edit Event" : "Create New Event"}
        </Typography>
        {/* Show a specific error from saving if it occurs */}
        {!isEditMode && error && <Alert severity="error" sx={{mb: 2}}>{error}</Alert>}
        <EventForm
          eventToEdit={event}
          onSubmit={handleSaveEvent}
          isSaving={isSaving}
        />
      </Paper>
    </Container>
  );
}
