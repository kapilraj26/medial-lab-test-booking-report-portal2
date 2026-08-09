import { useState } from "react";
import axios from "axios";

function Feedback() {
  const [formData, setFormData] = useState({
    user_id: Number(localStorage.getItem("user_id")),
    booking_id: 9,
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

      const response = await axios.post(
        "http://127.0.0.1:8000/feedback/",
        {
          ...formData,
          user_id: Number(formData.user_id),
          booking_id: Number(formData.booking_id),
          rating: Number(formData.rating),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Feedback submitted successfully!");
      console.log(response.data);

      setFormData({
        ...formData,
        comments: "",
      });

    } catch (error) {
      console.error(error);
      alert("Failed to submit feedback");
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