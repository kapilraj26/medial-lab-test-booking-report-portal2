import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
function AdminDashboard() {
  const navigate=useNavigate();
  const [dashboard, setDashboard]=useState(null);
  const [loading, setLoading]=useState(true);
  const [error, setError]=useState("");
  useEffect(() => {
    getDashboard();
  }, []);
  const getDashboard = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/admin/dashboard");
      console.log("ADMIN DASHBOARD:", response.data);
      setDashboard(response.data);
    } catch (error) {
      console.error("DASHBOARD ERROR:",error);
      if (error.response?.status===401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user_id" );
        localStorage.removeItem("role");
        alert("Session expired. Please login again.");
        navigate("/login");
      } else if (error.response?.status === 403) {
        setError("Access denied. Admin access required.");
      } else {
        setError(error.response?.data?.detail ||"Failed to load dashboard.");
      }
    } finally {
      setLoading(false);
    }
  };
  if(loading){
    return (
      <div className="container mt-5">
        <div className="alert alert-info text-center">
          Loading Admin Dashboard...
        </div>
      </div>
    );
  }
  if(error){
    return (
      <div className="container mt-5">
        <div className="alert alert-danger text-center">
          {error}
        </div>
      </div>
    );
  }
  if(!dashboard){
    return (
      <div className="container mt-5">
        <div className="alert alert-warning text-center">
          No dashboard data available.
        </div>
      </div>
    );
  }
  return (
    <div className="container mt-5">
      <h2 className="text-center mb-5">
        Admin Dashboard
      </h2>
      {/* ======================================
          USERS
      ====================================== */}
      <h4 className="mb-3">
        User Statistics
      </h4>
      <div className="row mb-5">
        <div className="col-md-3 mb-3">
          <div className="card shadow text-center p-3">
            <h5>Total Users</h5>
            <h2>
              {dashboard.users.total}
            </h2>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card shadow text-center p-3">
            <h5>Patients</h5>
            <h2>
              {dashboard.users.patients}
            </h2>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card shadow text-center p-3">
            <h5>Staff</h5>
            <h2>
              {dashboard.users.staff}
            </h2>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card shadow text-center p-3">
            <h5>Admins</h5>
            <h2>
              {dashboard.users.admins}
            </h2>
          </div>
        </div>
      </div>
      {/* ======================================
          BOOKINGS
      ====================================== */}
      <h4 className="mb-3">
        Booking Statistics
      </h4>
      <div className="row mb-5">
        <div className="col-md-3 mb-3">
          <div className="card shadow text-center p-3">
            <h5>Total</h5>
            <h2>
              {dashboard.bookings.total}
            </h2>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card shadow text-center p-3">
            <h5>Pending</h5>
            <h2>
              {dashboard.bookings.pending}
            </h2>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card shadow text-center p-3">
            <h5>Confirmed</h5>
            <h2>
              {dashboard.bookings.confirmed}
            </h2>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card shadow text-center p-3">
            <h5>Completed</h5>
            <h2>
              {dashboard.bookings.completed}
            </h2>
          </div>
        </div>
      </div>
      {/* ======================================
          CANCELLED
      ====================================== */}
      <div className="row mb-5">
        <div className="col-md-3 mb-3">
          <div className="card shadow text-center p-3">
            <h5>Cancelled</h5>
            <h2>
              {dashboard.bookings.cancelled}
            </h2>
          </div>
        </div>
      </div>
     {/* ======================================
          REPORTS & FEEDBACK
      ====================================== */}
      <h4 className="mb-3">
        Reports & Feedback
      </h4>
      <div className="row">
        <div className="col-md-6 mb-3">
          <div className="card shadow text-center p-4">
            <h5>Total Reports</h5>
            <h1>
              {dashboard.reports?.total || 0}
            </h1>
          </div>
        </div>
        <div className="col-md-6 mb-3">
          <div className="card shadow text-center p-4">
            <h5>Total Feedback</h5>
            <h1>
              {dashboard.feedback?.total || 0}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}
export default AdminDashboard;