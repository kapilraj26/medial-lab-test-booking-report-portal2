import { useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

function Booking() {
  const location = useLocation();

  const selectedTest = location.state?.test;

 const [formData, setFormData] = useState({
  user_id: Number(localStorage.getItem("user_id")),
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
      const token = localStorage.getItem("access_token");

      const response = await axios.post(
        "http://127.0.0.1:8000/bookings/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Booking successful!");
      console.log(response.data);
    } catch (error) {
      console.error(error);
      alert("Booking failed!");
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