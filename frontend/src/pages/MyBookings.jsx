import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getBookings();
  }, []);

  const getBookings = async () => {
    try {
      const response = await api.get(
        "/bookings/"
      );

      console.log(
        "MY BOOKINGS RESPONSE:",
        response.data
      );

      // Backend already returns only
      // the authenticated user's bookings
      setBookings(response.data);

    } catch (error) {
      console.error(
        "MY BOOKINGS ERROR:",
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
          "Failed to load bookings"
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
        My Bookings
      </h2>

      {bookings.length === 0 ? (

        <p className="text-center">
          No bookings found.
        </p>

      ) : (

        <div className="table-responsive">

          <table className="table table-bordered table-striped">

            <thead className="table-primary">

              <tr>
                <th>Booking ID</th>
                <th>User ID</th>
                <th>Test ID</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
              </tr>

            </thead>

            <tbody>

              {bookings.map((booking) => (

                <tr
                  key={booking.booking_id}
                >

                  <td>
                    {booking.booking_id}
                  </td>

                  <td>
                    {booking.user_id}
                  </td>

                  <td>
                    {booking.test_id}
                  </td>

                  <td>
                    {booking.booking_date}
                  </td>

                  <td>
                    {booking.booking_time}
                  </td>

                  <td>
                    {booking.status}
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

export default MyBookings;