import { useEffect, useState } from "react";
import axios from "axios";

function MyFeedback() {
  const [feedback, setFeedback] = useState([]);

  useEffect(() => {
    getFeedback();
  }, []);

  const getFeedback = async () => {
    try {
      const token = localStorage.getItem("access_token");

      const response = await axios.get(
        "http://127.0.0.1:8000/feedback/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("MY FEEDBACK RESPONSE:", response.data);

      // Backend already returns only the logged-in user's feedback
      setFeedback(response.data);

    } catch (error) {
      console.error("Feedback error:", error);

      if (error.response) {
        console.log(
          "Server response:",
          error.response.data
        );
      }

      alert("Failed to load feedback");
    }
  };

  return (
    <div className="container mt-5">

      <h2 className="text-center mb-4">
        My Feedback
      </h2>

      {feedback.length === 0 ? (
        <div className="alert alert-info text-center">
          No feedback submitted yet.
        </div>
      ) : (
        <div className="table-responsive">

          <table className="table table-bordered table-striped">

            <thead className="table-primary">
              <tr>
                <th>Feedback ID</th>
                <th>Booking ID</th>
                <th>Rating</th>
                <th>Comments</th>
              </tr>
            </thead>

            <tbody>
              {feedback.map((item) => (
                <tr key={item.feedback_id}>
                  <td>{item.feedback_id}</td>
                  <td>{item.booking_id}</td>
                  <td>{item.rating} / 5</td>
                  <td>{item.comments}</td>
                </tr>
              ))}
            </tbody>

          </table>

        </div>
      )}

    </div>
  );
}

export default MyFeedback;