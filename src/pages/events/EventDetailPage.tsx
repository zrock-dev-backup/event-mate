import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAuth } from "../../AuthContext";
import { useEvent } from "../../hooks/events/useEvent"; // Corrected import path

export default function EventDetailPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { event, isLoading, error, handleDeleteEvent } = useEvent(eventId);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!event) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning">Event not found or you do not have permission to view it.</Alert>
      </Container>
    );
  }

  const isOwner = currentUser?.uid === event.ownerId;

  const eventDate = event.date
    .toDate()
    .toLocaleString(undefined, { dateStyle: "full", timeStyle: "short" });

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ overflow: "hidden" }}>
        {event.imageUrl && (
          <Box
            component="img"
            src={event.imageUrl}
            alt={event.title}
            sx={{ width: "100%", height: "300px", objectFit: "cover" }}
          />
        )}
        <Box sx={{ p: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {event.title}
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            gutterBottom
            sx={{ fontWeight: "bold" }}
          >
            {event.category}
          </Typography>
          <Typography variant="h6" gutterBottom>
            When: {eventDate}
          </Typography>
          <Typography variant="h6" gutterBottom>
            Where: {event.location}
          </Typography>
          <Typography variant="body1" sx={{ mt: 2, whiteSpace: 'pre-wrap' }}>
            {event.description}
          </Typography>

          {isOwner && (
            <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={() => navigate(`/events/${event.id}/edit`)}
              >
                Edit
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleDeleteEvent}
              >
                Delete
              </Button>
            </Stack>
          )}
        </Box>
      </Paper>
    </Container>
  );
}
