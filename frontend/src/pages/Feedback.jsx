import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Feedback() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    booking_id: "",
    rating: "5",
    comments: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ==========================================
  // LOAD BOOKINGS
  // ==========================================

  useEffect(() => {
    getBookings();
  }, []);

  const getBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/bookings/");

      console.log("MY BOOKINGS:", response.data);

      // Only allow feedback for completed bookings
      const completedBookings = response.data.filter(
        (booking) => booking.status === "Completed"
      );

      setBookings(completedBookings);

    } catch (error) {
      console.error("BOOKINGS ERROR:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user_id");
        localStorage.removeItem("role");

        alert("Session expired. Please login again!");

        navigate("/login");
      } else {
        setError(
          error.response?.data?.detail ||
          "Failed to load bookings."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ==========================================
  // SUBMIT FEEDBACK
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!formData.booking_id) {
      setError("Please select a booking.");
      return;
    }

    if (!formData.comments.trim()) {
      setError("Please enter your comments.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await api.post("/feedback/", {
        booking_id: Number(formData.booking_id),
        rating: Number(formData.rating),
        comments: formData.comments.trim(),
      });

      console.log("FEEDBACK RESPONSE:", response.data);

      setMessage("Feedback submitted successfully!");

      setFormData({
        booking_id: "",
        rating: "5",
        comments: "",
      });

      // Reload bookings
      await getBookings();

    } catch (error) {
      console.error("FEEDBACK ERROR:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user_id");
        localStorage.removeItem("role");

        alert("Session expired. Please login again!");

        navigate("/login");

      } else if (error.response?.status === 403) {
        setError(
          error.response?.data?.detail ||
          "You cannot submit feedback for this booking."
        );

      } else if (error.response?.status === 400) {
        setError(
          error.response?.data?.detail ||
          "Feedback already submitted."
        );

      } else {
        setError(
          error.response?.data?.detail ||
          "Failed to submit feedback."
        );
      }

    } finally {
      setSubmitting(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="alert alert-info text-center">
          Loading your completed bookings...
        </div>
      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="container mt-5">

      <div className="row justify-content-center">

        <div className="col-md-6">

          <h2 className="text-center mb-4">
            Submit Feedback
          </h2>

          {/* SUCCESS */}

          {message && (
            <div className="alert alert-success">
              {message}
            </div>
          )}

          {/* ERROR */}

          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}

          {/* NO BOOKINGS */}

          {bookings.length === 0 ? (

            <div className="alert alert-info text-center">

              No completed bookings available for feedback.

            </div>

          ) : (

            <form
              className="card p-4 shadow"
              onSubmit={handleSubmit}
            >

              {/* BOOKING */}

              <div className="mb-3">

                <label className="form-label">
                  Select Completed Booking
                </label>

                <select
                  name="booking_id"
                  className="form-select"
                  value={formData.booking_id}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    -- Select Booking --
                  </option>

                  {bookings.map((booking) => (

                    <option
                      key={booking.booking_id}
                      value={booking.booking_id}
                    >

                      Booking #{booking.booking_id}
                      {" - "}
                      Test #{booking.test_id}
                      {" - "}
                      {booking.status}

                    </option>

                  ))}

                </select>

              </div>

              {/* RATING */}

              <div className="mb-3">

                <label className="form-label">
                  Rating
                </label>

                <select
                  name="rating"
                  className="form-select"
                  value={formData.rating}
                  onChange={handleChange}
                  required
                >

                  <option value="5">
                    5 - Excellent
                  </option>

                  <option value="4">
                    4 - Very Good
                  </option>

                  <option value="3">
                    3 - Good
                  </option>

                  <option value="2">
                    2 - Average
                  </option>

                  <option value="1">
                    1 - Poor
                  </option>

                </select>

              </div>

              {/* COMMENTS */}

              <div className="mb-3">

                <label className="form-label">
                  Comments
                </label>

                <textarea
                  name="comments"
                  className="form-control"
                  rows="4"
                  placeholder="Enter your feedback"
                  value={formData.comments}
                  onChange={handleChange}
                  maxLength="255"
                  required
                />

                <small className="text-muted">
                  Maximum 255 characters
                </small>

              </div>

              {/* SUBMIT */}

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={submitting}
              >

                {submitting
                  ? "Submitting..."
                  : "Submit Feedback"}

              </button>

            </form>

          )}

        </div>

      </div>

    </div>
  );
}

export default Feedback;