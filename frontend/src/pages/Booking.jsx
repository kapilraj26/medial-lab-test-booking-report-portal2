import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";

function Booking() {
  const location = useLocation();
  const navigate = useNavigate();

  const selectedTest = location.state?.test;

  const [formData, setFormData] = useState({
    test_id: selectedTest?.test_id || 1,
    booking_date: "",
    booking_time: "",
    status: "Pending",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post(
        "/bookings/",
        {
          test_id: Number(formData.test_id),
          booking_date: formData.booking_date,
          booking_time: formData.booking_time,
          status: formData.status,
        }
      );

      console.log(
        "BOOKING RESPONSE:",
        response.data
      );

      alert("Booking successful!");

      navigate("/mybookings");

    } catch (error) {
      console.error(
        "BOOKING ERROR:",
        error
      );

      if (error.response?.status === 401) {
        alert(
          "Session expired. Please login again!"
        );

        localStorage.removeItem(
          "access_token"
        );

        localStorage.removeItem(
          "user_id"
        );

        navigate("/login");

      } else if (error.response) {
        console.log(
          "BACKEND RESPONSE:",
          error.response.data
        );

        alert(
          error.response.data.detail ||
          "Booking failed!"
        );

      } else {
        alert(
          "Unable to connect to backend"
        );
      }
    }
  };

  return (
    <div className="container mt-5">

      <div className="row justify-content-center">

        <div className="col-md-6">

          <h2 className="text-center mb-4">
            Book Lab Test
          </h2>

          <form
            className="card p-4 shadow"
            onSubmit={handleSubmit}
          >

            <label className="mb-2">
              Test ID
            </label>

            <input
              type="number"
              name="test_id"
              className="form-control mb-3"
              value={formData.test_id}
              readOnly
            />

            <label className="mb-2">
              Booking Date
            </label>

            <input
              type="date"
              name="booking_date"
              className="form-control mb-3"
              value={formData.booking_date}
              onChange={handleChange}
              required
            />

            <label className="mb-2">
              Booking Time
            </label>

            <input
              type="time"
              name="booking_time"
              className="form-control mb-3"
              value={formData.booking_time}
              onChange={handleChange}
              required
            />

            <button
              type="submit"
              className="btn btn-primary w-100"
            >
              Confirm Booking
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}

export default Booking;