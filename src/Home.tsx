import { Box, Stack, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  return (
    <>
      <Box
        sx={{
          width: "100%",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 3,
        }}
      >
        <Typography
          variant="h3"
          gutterBottom
          sx={{
            textAlign: "center",
            marginBottom: 4,
          }}
        >
          Welcome to EventMate! {/* Changed from Spoty */}
        </Typography>

        <Stack
          direction="row"
          spacing={2}
          sx={{
            marginTop: 2,
          }}
        >
          <Button
            variant="contained"
            onClick={() => navigate("/sign-up")}
            size="large"
          >
            Sign Up
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate("/sign-in")}
            size="large"
          >
            Sign In
          </Button>
        </Stack>
      </Box>
    </>
  );
}

export default HomePage;
