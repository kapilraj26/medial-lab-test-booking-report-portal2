import { useEffect, useState } from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
} from "react-router-dom";

import LabTests from "./pages/LabTests";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Booking from "./pages/Booking";
import MyBookings from "./pages/MyBookings";
import Reports from "./pages/Reports";
import Feedback from "./pages/Feedback";
import MyFeedback from "./pages/MyFeedback";


function Home() {
  return (
    <div className="container text-center mt-5">

      <h1>
        Medical Lab Test Booking & Report Portal
      </h1>

      <p className="lead mt-3">
        Book laboratory tests and access your medical reports easily.
      </p>

      <Link
        to="/login"
        className="btn btn-primary mt-3"
      >
        Get Started
      </Link>

    </div>
  );
}


// Protected Route
function ProtectedRoute({ children }) {

  const token = localStorage.getItem("access_token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}


// Navbar
function Navbar() {

  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("access_token")
  );


  useEffect(() => {

    const checkLogin = () => {

      setIsLoggedIn(
        !!localStorage.getItem("access_token")
      );

    };

    window.addEventListener(
      "storage",
      checkLogin
    );

    return () => {

      window.removeEventListener(
        "storage",
        checkLogin
      );

    };

  }, []);


  const logout = () => {

    localStorage.removeItem("access_token");

    localStorage.removeItem("user_id");

    setIsLoggedIn(false);

    alert("Logged out successfully!");

    navigate("/login");

  };


  return (

    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">

      <div className="container">

        <Link
          to="/"
          className="navbar-brand"
        >
          Medical Lab Portal
        </Link>


        <div className="d-flex gap-2 flex-wrap">

          {!isLoggedIn ? (

            <>
              <Link
                to="/login"
                className="btn btn-light"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="btn btn-success"
              >
                Register
              </Link>
            </>

          ) : (

            <>

              <Link
                to="/labtests"
                className="btn btn-light"
              >
                Lab Tests
              </Link>

              <Link
                to="/mybookings"
                className="btn btn-light"
              >
                My Bookings
              </Link>

              <Link
                to="/reports"
                className="btn btn-light"
              >
                Reports
              </Link>

              <Link
                to="/feedback"
                className="btn btn-light"
              >
                Feedback
              </Link>

              <Link
                to="/myfeedback"
                className="btn btn-light"
              >
                My Feedback
              </Link>

              <button
                onClick={logout}
                className="btn btn-danger"
              >
                Logout
              </button>

            </>

          )}

        </div>

      </div>

    </nav>

  );
}


// App
function App() {

  return (

    <BrowserRouter>

      <Navbar />

      <Routes>

        {/* Public routes */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* Protected routes */}

        <Route
          path="/labtests"
          element={
            <ProtectedRoute>
              <LabTests />
            </ProtectedRoute>
          }
        />

        <Route
          path="/booking"
          element={
            <ProtectedRoute>
              <Booking />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mybookings"
          element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />

        <Route
          path="/feedback"
          element={
            <ProtectedRoute>
              <Feedback />
            </ProtectedRoute>
          }
        />

        <Route
          path="/myfeedback"
          element={
            <ProtectedRoute>
              <MyFeedback />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>

  );
}

export default App;