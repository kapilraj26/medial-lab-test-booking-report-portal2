import { useState } from "react";
import axios from "axios";

function Feedback() {
  const [formData, setFormData] = useState({
    booking_id: 10,
    rating: 5,
    comments: "",
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

      console.log("FEEDBACK TOKEN:", token);

      if (!token) {
        alert("Please login first!");
        return;
      }

      const response = await axios.post(
        "http://127.0.0.1:8000/feedback/",
        {
          booking_id: Number(formData.booking_id),
          rating: Number(formData.rating),
          comments: formData.comments,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("FEEDBACK RESPONSE:", response.data);

      alert("Feedback submitted successfully!");

      setFormData({
        ...formData,
        comments: "",
      });

    } catch (error) {
      console.error("FEEDBACK ERROR:", error);

      if (error.response) {
        console.log(
          "SERVER RESPONSE:",
          error.response.data
        );

        console.log(
          "STATUS:",
          error.response.status
        );

        if (error.response.status === 401) {
          alert("Session expired. Please login again.");

          localStorage.removeItem("access_token");
          localStorage.removeItem("user_id");
        } else {
          alert("Failed to submit feedback");
        }
      } else {
        alert("Unable to connect to backend");
      }
    }
  };

  return (
    <div className="container mt-5">

      <div className="row justify-content-center">

        <div className="col-md-6">

          <h2 className="text-center mb-4">
            Submit Feedback
          </h2>

          <form
            className="card p-4 shadow"
            onSubmit={handleSubmit}
          >

            <label className="mb-2">
              Booking ID
            </label>

            <input
              type="number"
              name="booking_id"
              className="form-control mb-3"
              value={formData.booking_id}
              onChange={handleChange}
              required
            />

            <label className="mb-2">
              Rating
            </label>

            <select
              name="rating"
              className="form-select mb-3"
              value={formData.rating}
              onChange={handleChange}
            >
              <option value="5">5 - Excellent</option>
              <option value="4">4 - Very Good</option>
              <option value="3">3 - Good</option>
              <option value="2">2 - Average</option>
              <option value="1">1 - Poor</option>
            </select>

            <label className="mb-2">
              Comments
            </label>

            <textarea
              name="comments"
              className="form-control mb-3"
              rows="4"
              value={formData.comments}
              onChange={handleChange}
              placeholder="Enter your feedback"
              required
            />

            <button
              type="submit"
              className="btn btn-primary w-100"
            >
              Submit Feedback
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}

export default Feedback;