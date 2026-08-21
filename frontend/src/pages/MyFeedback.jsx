import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function MyFeedback() {
  const [feedback, setFeedback] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getFeedback();
  }, []);

  const getFeedback = async () => {
    try {
      const response = await api.get(
        "/feedback/"
      );

      console.log(
        "MY FEEDBACK RESPONSE:",
        response.data
      );

      // Backend returns only the logged-in user's feedback
      setFeedback(response.data);

    } catch (error) {
      console.error(
        "FEEDBACK ERROR:",
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
          "SERVER RESPONSE:",
          error.response.data
        );

        alert(
          error.response.data.detail ||
          "Failed to load feedback"
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

                <tr
                  key={item.feedback_id}
                >

                  <td>
                    {item.feedback_id}
                  </td>

                  <td>
                    {item.booking_id}
                  </td>

                  <td>
                    {item.rating} / 5
                  </td>

                  <td>
                    {item.comments}
                  </td>

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