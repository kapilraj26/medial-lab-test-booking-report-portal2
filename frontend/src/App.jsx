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
import Login from "./pages/login";
import Register from "./pages/Register";
import Booking from "./pages/Booking";
import MyBookings from "./pages/MyBookings";
import Reports from "./pages/Reports";
import Feedback from "./pages/Feedback";
import MyFeedback from "./pages/MyFeedback";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import StaffReports from "./pages/StaffReports";
import StaffBookings from "./pages/StaffBookings";
import AdminUsers from "./pages/AdminUsers";


// ==========================================
// HOME
// ==========================================

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


// ==========================================
// PROTECTED ROUTE
// LOGIN REQUIRED
// ==========================================

function ProtectedRoute({ children }) {

  const token = localStorage.getItem("access_token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}


// ==========================================
// ROLE PROTECTED ROUTE
// ==========================================
// Used for Staff / Admin / Admin-only pages
// ==========================================

function RoleProtectedRoute({
  children,
  allowedRoles
}) {

  const token = localStorage.getItem("access_token");
  const role = localStorage.getItem("role");

  // ========================================
  // NOT LOGGED IN
  // ========================================

  if (!token) {
    return <Navigate to="/login" replace />;
  }


  // ========================================
  // WRONG ROLE
  // ========================================

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/labtests" replace />;
  }


  return children;
}


// ==========================================
// NAVBAR
// ==========================================

function Navbar() {

  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("access_token")
  );

  const role = localStorage.getItem("role");


  // ========================================
  // CHECK LOGIN
  // ========================================

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


  // ========================================
  // LOGOUT
  // ========================================

  const logout = () => {

    localStorage.removeItem("access_token");

    localStorage.removeItem("user_id");

    localStorage.removeItem("role");

    setIsLoggedIn(false);

    alert("Logged out successfully!");

    navigate("/login");

  };


  // ========================================
  // NAVBAR UI
  // ========================================

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

          {/* =================================
              NOT LOGGED IN
          ================================= */}

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

              {/* =================================
                  COMMON FEATURE
              ================================= */}

              <Link
                to="/labtests"
                className="btn btn-light"
              >
                Lab Tests
              </Link>


              {/* =================================
                  PATIENT FEATURES
              ================================= */}

              {role === "Patient" && (

                <>

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

                </>

              )}


              {/* =================================
                  STAFF / ADMIN FEATURES
              ================================= */}

              {(role === "Staff" || role === "Admin") && (

                <>

                  <Link
                    to="/staff-bookings"
                    className="btn btn-info"
                  >
                    Booking Management
                  </Link>


                  <Link
                    to="/staff-reports"
                    className="btn btn-warning"
                  >
                    Upload Report
                  </Link>


                  <Link
                    to="/reports"
                    className="btn btn-light"
                  >
                    Reports
                  </Link>

                </>

              )}


              {/* =================================
                  ADMIN ONLY
              ================================= */}

              {role === "Admin" && (

                <Link
                  to="/admin-users"
                  className="btn btn-warning"
                >
                  User Management
                </Link>

              )}


              {/* =================================
                  PROFILE
              ================================= */}

              <Link
                to="/profile"
                className="btn btn-light"
              >
                My Profile
              </Link>


              {/* =================================
                  LOGOUT
              ================================= */}

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


// ==========================================
// APP
// ==========================================

function App() {

  return (

    <BrowserRouter>

      <Navbar />

      <Routes>

        {/* ==================================
            PUBLIC ROUTES
        ================================== */}

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


        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />


        {/* ==================================
            GENERAL PROTECTED ROUTES
        ================================== */}

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


        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />


        {/* ==================================
            STAFF / ADMIN
            BOOKING MANAGEMENT
        ================================== */}

        <Route
          path="/staff-bookings"
          element={
            <RoleProtectedRoute
              allowedRoles={[
                "Staff",
                "Admin"
              ]}
            >
              <StaffBookings />
            </RoleProtectedRoute>
          }
        />


        {/* ==================================
            STAFF / ADMIN
            UPLOAD MEDICAL REPORT
        ================================== */}

        <Route
          path="/staff-reports"
          element={
            <RoleProtectedRoute
              allowedRoles={[
                "Staff",
                "Admin"
              ]}
            >
              <StaffReports />
            </RoleProtectedRoute>
          }
        />


        {/* ==================================
            ADMIN ONLY
            USER MANAGEMENT
        ================================== */}

        <Route
          path="/admin-users"
          element={
            <RoleProtectedRoute
              allowedRoles={[
                "Admin"
              ]}
            >
              <AdminUsers />
            </RoleProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>

  );
}


export default App;