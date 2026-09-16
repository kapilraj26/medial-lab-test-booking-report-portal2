import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Reports() {

  const [reports, setReports] = useState([]);
  const navigate = useNavigate();

  // ==========================================
  // GET PATIENT REPORTS
  // ==========================================

  useEffect(() => {
    getReports();
  }, []);

  const getReports = async () => {

    try {

      const response = await api.get(
        "/reports/"
      );

      console.log(
        "REPORTS RESPONSE:",
        response.data
      );

      setReports(response.data);

    } catch (error) {

      console.error(
        "REPORTS ERROR:",
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

      } else {

        alert(
          error.response?.data?.detail ||
          "Failed to load reports"
        );

      }

    }

  };


  // ==========================================
  // GET PDF FILENAME
  // ==========================================

  const getFileName = (filePath) => {

    if (!filePath) {
      return "";
    }

    return filePath
      .split("/")
      .pop();

  };


  // ==========================================
  // VIEW PDF
  // ==========================================

  const viewPdf = async (filePath) => {

    try {

      const fileName =
        getFileName(filePath);

      if (!fileName) {

        alert(
          "Report file not available"
        );

        return;

      }

      const response = await api.get(
        `/reports/file/${encodeURIComponent(fileName)}`,
        {
          responseType: "blob"
        }
      );

      const pdfBlob = new Blob(
        [response.data],
        {
          type: "application/pdf"
        }
      );

      const pdfUrl =
        window.URL.createObjectURL(
          pdfBlob
        );

      window.open(
        pdfUrl,
        "_blank"
      );

    } catch (error) {

      console.error(
        "VIEW PDF ERROR:",
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
          "You are not allowed to access this report."
        );

      } else {

        alert(
          "Failed to open PDF report."
        );

      }

    }

  };


  // ==========================================
  // DOWNLOAD PDF
  // ==========================================

  const downloadPdf = async (filePath) => {

    try {

      const fileName =
        getFileName(filePath);

      if (!fileName) {

        alert(
          "Report file not available"
        );

        return;

      }

      const response = await api.get(
        `/reports/file/${encodeURIComponent(fileName)}`,
        {
          responseType: "blob"
        }
      );

      const pdfBlob = new Blob(
        [response.data],
        {
          type: "application/pdf"
        }
      );

      const pdfUrl =
        window.URL.createObjectURL(
          pdfBlob
        );

      const link =
        document.createElement("a");

      link.href = pdfUrl;

      link.download = fileName;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      window.URL.revokeObjectURL(
        pdfUrl
      );

    } catch (error) {

      console.error(
        "DOWNLOAD PDF ERROR:",
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
          "You are not allowed to download this report."
        );

      } else {

        alert(
          "Failed to download PDF report."
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
        Medical Reports
      </h2>


      {/* NO REPORTS */}

      {reports.length === 0 ? (

        <div className="alert alert-info text-center">

          No medical reports available.

        </div>

      ) : (

        <div className="table-responsive">

          <table className="table table-bordered table-striped">

            <thead className="table-primary">

              <tr>

                <th>
                  Report ID
                </th>

                <th>
                  Booking ID
                </th>

                <th>
                  Result
                </th>

                <th>
                  Report Date
                </th>

                <th>
                  Actions
                </th>

              </tr>

            </thead>


            <tbody>

              {reports.map((report) => (

                <tr
                  key={report.report_id}
                >

                  {/* REPORT ID */}

                  <td>
                    {report.report_id}
                  </td>


                  {/* BOOKING ID */}

                  <td>
                    {report.booking_id}
                  </td>


                  {/* RESULT */}

                  <td>
                    {report.result}
                  </td>


                  {/* REPORT DATE */}

                  <td>
                    {report.report_date}
                  </td>


                  {/* PDF ACTIONS */}

                  <td>

                    <button
                      className="btn btn-primary btn-sm me-2"
                      onClick={() =>
                        viewPdf(
                          report.report_file
                        )
                      }
                    >
                      View PDF
                    </button>


                    <button
                      className="btn btn-success btn-sm"
                      onClick={() =>
                        downloadPdf(
                          report.report_file
                        )
                      }
                    >
                      Download
                    </button>

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

export default Reports;