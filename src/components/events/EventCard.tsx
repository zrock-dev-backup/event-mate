import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Box,
} from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import type { Event } from "../../models/event";

interface EventCardProps {
  event: Event;
  onClick: () => void;
}

/**
 * A card component to display a summary of an event.
 * Shows the event's image, title, and date.
 * Provides a fallback icon if no image is available.
 */
export default function EventCard({ event, onClick }: EventCardProps) {
  // Convert Firestore Timestamp to a readable local date and time string.
  const eventDate = event.date.toDate().toLocaleString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Card sx={{ maxWidth: 345, width: "100%" }}>
      <CardActionArea onClick={onClick}>
        {event.imageUrl ? (
          <CardMedia
            component="img"
            height="160"
            image={event.imageUrl}
            alt={event.title}
            sx={{ objectFit: "cover" }}
          />
        ) : (
          // Fallback view when no image is provided
          <Box
            sx={{
              height: 160,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "grey.200",
            }}
          >
            <EventIcon sx={{ fontSize: 60, color: "grey.500" }} />
          </Box>
        )}
        <CardContent>
          <Typography gutterBottom variant="h6" component="div" noWrap>
            {event.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {eventDate}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
