import { useEffect, useState } from "react";
import axios from "axios";

function MyBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    getBookings();
  }, []);

  const getBookings = async () => {
    try {
      const token = localStorage.getItem("access_token");

      const response = await axios.get(
        "http://127.0.0.1:8000/bookings/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const userId = Number(localStorage.getItem("user_id"));

      const myBookings = response.data.filter(
        (booking) => booking.user_id === userId);

      setBookings(myBookings);
    } catch (error) {
      console.error(error);
      alert("Failed to load bookings");
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
                <tr key={booking.booking_id}>
                  <td>{booking.booking_id}</td>
                  <td>{booking.user_id}</td>
                  <td>{booking.test_id}</td>
                  <td>{booking.booking_date}</td>
                  <td>{booking.booking_time}</td>
                  <td>{booking.status}</td>
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