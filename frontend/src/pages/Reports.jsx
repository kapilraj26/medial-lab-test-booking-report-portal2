import { useEffect, useState } from "react";
import axios from "axios";

function Reports() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    getReports();
  }, []);

  const getReports = async () => {
    try {
      const token = localStorage.getItem("access_token");

      const response = await axios.get(
        "http://127.0.0.1:8000/reports/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setReports(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to load reports");
    }
  };

  return (
    <div className="container mt-5">

      <h2 className="text-center mb-4">
        Medical Reports
      </h2>

      {reports.length === 0 ? (
        <div className="alert alert-info text-center">
          No medical reports available.
        </div>
      ) : (
        <div className="table-responsive">

          <table className="table table-bordered table-striped">

            <thead className="table-primary">
              <tr>
                <th>Report ID</th>
                <th>Booking ID</th>
                <th>Result</th>
                <th>Report Date</th>
                <th>Report File</th>
              </tr>
            </thead>

            <tbody>
              {reports.map((report) => (
                <tr key={report.report_id}>
                  <td>{report.report_id}</td>
                  <td>{report.booking_id}</td>
                  <td>{report.result}</td>
                  <td>{report.report_date}</td>
                  <td>{report.report_file}</td>
                </tr>
              ))}
            </tbody>

          </table>

        </div>
      )}

    </div>
  );
}

export default Reports;