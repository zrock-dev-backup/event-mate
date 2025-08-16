import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./Home.tsx";
import SignUpPage from "./pages/SignUpPage.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import ProtectedRoute from "./ProtectedRoute.tsx";
import SignInPage from "./pages/SignInPage.tsx";
import Layout from "./Layout.tsx";

// Import new Event pages
import EventsPage from "./pages/events/EventsPage.tsx";
import EventDetailPage from "./pages/events/EventDetailPage.tsx";
import EventFormPage from "./pages/events/EventFormPage.tsx";

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/sign-up" element={<SignUpPage />} />
      <Route path="/sign-in" element={<SignInPage />} />

      {/* Protected routes for EventMate users */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        {/* Default route for authenticated users */}
        <Route index element={<Navigate to="/events" replace />} />

        {/* Event CRUD Routes */}
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/new" element={<EventFormPage />} />
        <Route path="/events/:eventId" element={<EventDetailPage />} />
        <Route path="/events/:eventId/edit" element={<EventFormPage />} />

        {/* User Profile Route */}
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
    </Routes>
  );
}

export default App;
