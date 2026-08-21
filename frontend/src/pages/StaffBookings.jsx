import { useEffect, useState } from "react";
import api from "../api/axios";

function StaffBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const getBookings = async () => {
    try {
      setLoading(true);

      const response = await api.get("/bookings/all");

      console.log("ALL BOOKINGS:", response.data);

      setBookings(response.data);
    } catch (error) {
      console.error("BOOKINGS ERROR:", error);

      setError(
        error.response?.data?.detail ||
        "Failed to load bookings."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBookings();
  }, []);

  const updateStatus = async (bookingId, newStatus) => {
    try {
      setMessage("");
      setError("");

      const response = await api.put(
        `/bookings/${bookingId}/status`,
        null,
        {
          params: {
            new_status: newStatus,
          },
        }
      );

      console.log(
        "STATUS UPDATED:",
        response.data
      );

      setMessage(
        `Booking #${bookingId} updated to ${newStatus}`
      );

      getBookings();

    } catch (error) {
      console.error(
        "STATUS UPDATE ERROR:",
        error
      );

      setError(
        error.response?.data?.detail ||
        "Failed to update booking status."
      );
    }
  };

  return (
    <div className="container mt-5">

      <h2 className="text-center mb-4">
        Booking Management
      </h2>

      {message && (
        <div className="alert alert-success">
          {message}
        </div>
      )}

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {loading ? (

        <div className="text-center">
          Loading bookings...
        </div>

      ) : bookings.length === 0 ? (

        <div className="alert alert-info text-center">
          No bookings available.
        </div>

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
                <th>Update Status</th>
              </tr>

            </thead>

            <tbody>

              {bookings.map((booking) => (

                <tr key={booking.booking_id}>

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
                    <strong>
                      {booking.status}
                    </strong>
                  </td>

                  <td>

                    <select
                      className="form-select"
                      value={booking.status}
                      onChange={(e) =>
                        updateStatus(
                          booking.booking_id,
                          e.target.value
                        )
                      }
                    >

                      <option value="Pending">
                        Pending
                      </option>

                      <option value="Confirmed">
                        Confirmed
                      </option>

                      <option value="Completed">
                        Completed
                      </option>

                      <option value="Cancelled">
                        Cancelled
                      </option>

                    </select>

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

export default StaffBookings;