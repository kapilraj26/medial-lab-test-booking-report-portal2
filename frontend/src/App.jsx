import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate
} from "react-router-dom";

import Login from "./pages/login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

import LabTests from "./pages/LabTests";
import Booking from "./pages/Booking";
import MyBookings from "./pages/MyBookings";

import Reports from "./pages/Reports";
import Feedback from "./pages/Feedback";
import MyFeedback from "./pages/MyFeedback";

import Profile from "./pages/Profile";

import StaffBookings from "./pages/StaffBookings";
import StaffReports from "./pages/StaffReports";
import StaffFeedback from "./pages/StaffFeedback";

import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";

import "./App.css";


// ==========================================
// HOME PAGE
// ==========================================

function Home() {

  return (

    <div className="container mt-5 text-center">

      <h1>
        Medical Lab Test Booking & Report Portal
      </h1>

      <p className="mt-3">
        Book medical lab tests, manage bookings,
        and securely access laboratory reports.
      </p>

    </div>

  );

}


// ==========================================
// PROTECTED ROUTE
// ==========================================

function ProtectedRoute({ children }) {

  const token =
    localStorage.getItem("access_token");

  if (!token) {

    return <Login />;

  }

  return children;

}


// ==========================================
// ROLE PROTECTED ROUTE
// ==========================================

function RoleProtectedRoute({
  children,
  allowedRoles
}) {

  const token =
    localStorage.getItem("access_token");

  const role =
    localStorage.getItem("role");

  if (!token) {

    return <Login />;

  }

  if (!allowedRoles.includes(role)) {

    return (

      <div className="container mt-5">

        <div className="alert alert-danger text-center">

          <h4>
            Access Denied
          </h4>

          <p>
            You do not have permission to access
            this page.
          </p>

        </div>

      </div>

    );

  }

  return children;

}


// ==========================================
// NAVBAR
// ==========================================

function Navbar() {

  const navigate = useNavigate();

  const token =
    localStorage.getItem("access_token");

  const role =
    localStorage.getItem("role");


  // ========================================
  // LOGOUT
  // ========================================

  const logout = () => {

    localStorage.removeItem(
      "access_token"
    );

    localStorage.removeItem(
      "user_id"
    );

    localStorage.removeItem(
      "role"
    );

    navigate("/login");

  };


  return (

    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">

      <div className="container">

        <Link
          className="navbar-brand"
          to="/"
        >
          Medical Lab Portal
        </Link>


        <div className="navbar-nav ms-auto">


          {/* ==================================
              NOT LOGGED IN
          ================================== */}

          {!token && (

            <>

              <Link
                className="nav-link"
                to="/"
              >
                Home
              </Link>

              <Link
                className="nav-link"
                to="/login"
              >
                Login
              </Link>

              <Link
                className="nav-link"
                to="/register"
              >
                Register
              </Link>

            </>

          )}


          {/* ==================================
              LOGGED IN
          ================================== */}

          {token && (

            <>

              {/* COMMON */}

              <Link
                className="nav-link"
                to="/labtests"
              >
                Lab Tests
              </Link>


              {/* ==================================
                  PATIENT
              ================================== */}

              {role === "Patient" && (

                <>

                  <Link
                    className="nav-link"
                    to="/mybookings"
                  >
                    My Bookings
                  </Link>

                  <Link
                    className="nav-link"
                    to="/reports"
                  >
                    Reports
                  </Link>

                  <Link
                    className="nav-link"
                    to="/feedback"
                  >
                    Feedback
                  </Link>

                  <Link
                    className="nav-link"
                    to="/myfeedback"
                  >
                    My Feedback
                  </Link>

                </>

              )}


              {/* ==================================
                  STAFF / ADMIN
              ================================== */}

              {(role === "Staff" ||
                role === "Admin") && (

                <>

                  <Link
                    className="nav-link"
                    to="/staff-bookings"
                  >
                    Staff Bookings
                  </Link>

                  <Link
                    className="nav-link"
                    to="/staff-reports"
                  >
                    Upload Report
                  </Link>

                  <Link
                    className="nav-link"
                    to="/reports"
                  >
                    Reports
                  </Link>

                  <Link
                    className="nav-link"
                    to="/staff-feedback"
                  >
                    Feedback
                  </Link>

                </>

              )}


              {/* ==================================
                  ADMIN
              ================================== */}

              {role === "Admin" && (

                <>

                  <Link
                    className="nav-link"
                    to="/admin-dashboard"
                  >
                    Admin Dashboard
                  </Link>

                  <Link
                    className="nav-link"
                    to="/admin-users"
                  >
                    User Management
                  </Link>

                </>

              )}


              {/* ==================================
                  PROFILE
              ================================== */}

              <Link
                className="nav-link"
                to="/profile"
              >
                Profile
              </Link>


              {/* ==================================
                  LOGOUT
              ================================== */}

              <button
                className="btn btn-light btn-sm ms-2"
                onClick={logout}
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
            COMMON PROTECTED
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
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />


        {/* ==================================
            PATIENT ROUTES
        ================================== */}

        <Route
          path="/booking"
          element={
            <RoleProtectedRoute
              allowedRoles={["Patient"]}
            >
              <Booking />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/mybookings"
          element={
            <RoleProtectedRoute
              allowedRoles={["Patient"]}
            >
              <MyBookings />
            </RoleProtectedRoute>
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
            <RoleProtectedRoute
              allowedRoles={["Patient"]}
            >
              <Feedback />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/myfeedback"
          element={
            <RoleProtectedRoute
              allowedRoles={["Patient"]}
            >
              <MyFeedback />
            </RoleProtectedRoute>
          }
        />


        {/* ==================================
            STAFF / ADMIN ROUTES
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

        <Route
          path="/staff-feedback"
          element={
            <RoleProtectedRoute
              allowedRoles={[
                "Staff",
                "Admin"
              ]}
            >
              <StaffFeedback />
            </RoleProtectedRoute>
          }
        />


        {/* ==================================
            ADMIN ROUTES
        ================================== */}

        <Route
          path="/admin-dashboard"
          element={
            <RoleProtectedRoute
              allowedRoles={["Admin"]}
            >
              <AdminDashboard />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/admin-users"
          element={
            <RoleProtectedRoute
              allowedRoles={["Admin"]}
            >
              <AdminUsers />
            </RoleProtectedRoute>
          }
        />


        {/* ==================================
            FALLBACK
        ================================== */}

        <Route
          path="*"
          element={<Home />}
        />

      </Routes>

    </BrowserRouter>

  );

}

export default App;