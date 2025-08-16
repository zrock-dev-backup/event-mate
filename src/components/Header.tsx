import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useAuth } from "../AuthContext";

export default function Header() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth(); // Keep isAdmin for potential future use

  const handleSignOut = () => {
    signOut(auth).then(() => navigate("/"));
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, cursor: "pointer" }}
          onClick={() => navigate("/events")} // Navigate to the new events dashboard
        >
          EventMate {/* Changed from Spoty */}
        </Typography>
        <Button color="inherit" onClick={() => navigate("/events")}>
          My Events {/* Changed from Genres */}
        </Button>
        <Button color="inherit" onClick={() => navigate("/profile")}>
          Profile
        </Button>
        {/* The Admin button can remain for future admin features */}
        {isAdmin && (
          <Button color="inherit" onClick={() => navigate("/admin")}>
            Admin
          </Button>
        )}
        <Button color="inherit" onClick={handleSignOut}>
          Sign Out
        </Button>
      </Toolbar>
    </AppBar>
  );
}
