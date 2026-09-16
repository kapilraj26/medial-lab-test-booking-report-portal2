import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function StaffFeedback() {

  const [feedbacks, setFeedbacks] = useState([]);
  const navigate = useNavigate();

  // ==========================================
  // GET ALL FEEDBACK
  // ==========================================

  useEffect(() => {
    getFeedbacks();
  }, []);

  const getFeedbacks = async () => {

    try {

      const response = await api.get(
        "/feedback/all"
      );

      console.log(
        "ALL FEEDBACK:",
        response.data
      );

      setFeedbacks(response.data);

    } catch (error) {

      console.error(
        "FEEDBACK ERROR:",
        error
      );

      if (
        error.response?.status === 401
      ) {

        alert(
          "Session expired. Please login again!"
        );

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

      } else if (
        error.response?.status === 403
      ) {

        alert(
          "Access denied. Staff/Admin only."
        );

        navigate("/");

      } else {

        alert(
          error.response?.data?.detail ||
          "Failed to load feedback"
        );

      }

    }

  };


  // ==========================================
  // UI
  // ==========================================

  return (

    <div className="container mt-5">

      <h2 className="text-center mb-4">
        Patient Feedback
      </h2>


      {/* NO FEEDBACK */}

      {feedbacks.length === 0 ? (

        <div className="alert alert-info text-center">

          No feedback available.

        </div>

      ) : (

        <div className="table-responsive">

          <table className="table table-bordered table-striped">

            <thead className="table-primary">

              <tr>

                <th>
                  Feedback ID
                </th>

                <th>
                  User ID
                </th>

                <th>
                  Booking ID
                </th>

                <th>
                  Rating
                </th>

                <th>
                  Comments
                </th>

              </tr>

            </thead>


            <tbody>

              {feedbacks.map(
                (feedback) => (

                  <tr
                    key={
                      feedback.feedback_id
                    }
                  >

                    <td>
                      {feedback.feedback_id}
                    </td>

                    <td>
                      {feedback.user_id}
                    </td>

                    <td>
                      {feedback.booking_id}
                    </td>

                    <td>
                      {"⭐".repeat(
                        feedback.rating
                      )}
                      {" "}
                      ({feedback.rating}/5)
                    </td>

                    <td>
                      {feedback.comments}
                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      )}

    </div>

  );

}

export default StaffFeedback;