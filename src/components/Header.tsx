import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";

export default function Header() {
  const navigate = useNavigate();

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
          onClick={() => navigate("/events")}
        >
          EventMate
        </Typography>
        <Button color="inherit" onClick={() => navigate("/events")}>
          My Events
        </Button>
        <Button color="inherit" onClick={() => navigate("/profile")}>
          Profile
        </Button>
        {/* Admin button removed as the feature slice has been deleted. */}
        <Button color="inherit" onClick={handleSignOut}>
          Sign Out
        </Button>
      </Toolbar>
    </AppBar>
  );
}
