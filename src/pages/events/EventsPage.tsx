import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Stack,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useEvents } from "../../hooks/events/useEvents"; // Corrected import path
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";
import EventCard from "../../components/events/EventCard";

export default function EventsPage() {
  const navigate = useNavigate();
  const { events, isLoading, error } = useEvents(); // Using the real hook

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Typography variant="h4" component="h1">
          My Events
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/events/new")}
        >
          Create Event
        </Button>
      </Stack>

      {events.length > 0 ? (
        <Grid container spacing={4}>
          {events.map((event) => (
            <Grid item key={event.id} xs={12} sm={6} md={4}>
              <EventCard
                event={event} // No longer need 'as any'
                onClick={() => navigate(`/events/${event.id}`)}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ textAlign: "center", mt: 8 }}>
          <Typography variant="h6" color="text.secondary">
            You haven't created any events yet.
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Click "Create Event" to get started!
          </Typography>
        </Box>
      )}
    </Container>
  );
}
