import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Feedback() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    booking_id: "",
    rating: 5,
    comments: "",
  });

  // ==========================================
  // LOAD PATIENT BOOKINGS
  // ==========================================

  useEffect(() => {
    getBookings();
  }, []);

  const getBookings = async () => {
    try {
      const response = await api.get("/bookings/");

      console.log(
        "MY BOOKINGS:",
        response.data
      );

      setBookings(response.data);

    } catch (error) {
      console.error(
        "BOOKINGS ERROR:",
        error
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user_id");
        localStorage.removeItem("role");

        alert(
          "Session expired. Please login again!"
        );

        navigate("/login");

      } else {
        alert(
          error.response?.data?.detail ||
          "Failed to load bookings"
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

    if (!formData.booking_id) {
      alert("Please select a booking.");
      return;
    }

    try {

      const response = await api.post(
        "/feedback/",
        {
          booking_id: Number(
            formData.booking_id
          ),

          rating: Number(
            formData.rating
          ),

          comments:
            formData.comments,
        }
      );

      console.log(
        "FEEDBACK RESPONSE:",
        response.data
      );

      alert(
        "Feedback submitted successfully!"
      );

      setFormData({
        booking_id: "",
        rating: 5,
        comments: "",
      });

      // Reload bookings
      getBookings();

    } catch (error) {

      console.error(
        "FEEDBACK ERROR:",
        error
      );

      if (error.response?.status === 401) {

        localStorage.removeItem(
          "access_token"
        );

        localStorage.removeItem(
          "user_id"
        );

        localStorage.removeItem(
          "role"
        );

        alert(
          "Session expired. Please login again!"
        );

        navigate("/login");

      } else {

        alert(
          error.response?.data?.detail ||
          "Failed to submit feedback"
        );

      }

    }
  };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (
      <div className="container mt-5">

        <div className="text-center">

          <h4>
            Loading your bookings...
          </h4>

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


          {bookings.length === 0 ? (

            <div className="alert alert-info text-center">

              You don't have any bookings
              available for feedback.

            </div>

          ) : (

            <form
              className="card p-4 shadow"
              onSubmit={handleSubmit}
            >

              {/* BOOKING */}

              <label className="mb-2">

                Select Booking

              </label>

              <select
                name="booking_id"
                className="form-select mb-3"
                value={formData.booking_id}
                onChange={handleChange}
                required
              >

                <option value="">
                  -- Select Booking --
                </option>

                {bookings.map(
                  (booking) => (

                    <option
                      key={
                        booking.booking_id
                      }
                      value={
                        booking.booking_id
                      }
                    >

                      Booking #
                      {booking.booking_id}
                      {" - Test ID: "}
                      {booking.test_id}
                      {" - "}
                      {booking.status}

                    </option>

                  )
                )}

              </select>


              {/* RATING */}

              <label className="mb-2">

                Rating

              </label>

              <select
                name="rating"
                className="form-select mb-3"
                value={formData.rating}
                onChange={handleChange}
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


              {/* COMMENTS */}

              <label className="mb-2">

                Comments

              </label>

              <textarea
                name="comments"
                className="form-control mb-3"
                rows="4"
                value={
                  formData.comments
                }
                onChange={handleChange}
                placeholder="Enter your feedback"
                required
              />


              {/* SUBMIT */}

              <button
                type="submit"
                className="btn btn-primary w-100"
              >

                Submit Feedback

              </button>

            </form>

          )}

        </div>

      </div>

    </div>

  );
}

export default Feedback;