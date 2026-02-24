import React, { useState } from "react";
import axios from "../../api/axiosConfig";
import { toast } from "react-toastify";

export default function AdminReport() {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/admin/report/daily?date=${date}`);
      setReport(res.data);
    } catch (err) {
      toast.error(err.response?.data || "Không thể tải báo cáo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4" style={{ maxWidth: "1000px" }}>
      <h3 className="fw-bold text-center mb-4" style={{ color: "#2c3e50" }}>
        Báo Cáo Doanh Thu Hàng Ngày
      </h3>

      {/* Bộ lọc ngày */}
      <div
        className="d-flex justify-content-center align-items-center gap-3 mb-4"
        style={{
          background: "#f8f9fa",
          borderRadius: "12px",
          padding: "16px 20px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
        }}
      >
        <input
          type="date"
          className="form-control"
          style={{ maxWidth: "200px" }}
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button
          className="btn btn-primary px-4"
          onClick={fetchReport}
          disabled={loading}
        >
          {loading ? "Đang tải..." : "Xem báo cáo"}
        </button>
      </div>

      {report && (
        <div>
          {/* Tổng quan */}
          <div className="row mb-4">
            <div className="col-md-6 mb-3">
              <div
                className="card text-center shadow-sm border-0"
                style={{ background: "#e3f2fd" }}
              >
                <div className="card-body">
                  <h6 className="text-secondary mb-1">Tổng Số Khách Hàng</h6>
                  <h3 className="fw-bold text-primary">
                    {report.totalCustomers}
                  </h3>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <div
                className="card text-center shadow-sm border-0"
                style={{ background: "#fff3cd" }}
              >
                <div className="card-body">
                  <h6 className="text-secondary mb-1">Tổng doanh thu</h6>
                  <h3 className="fw-bold text-warning">
                    {Number(report.totalRevenue).toLocaleString("vi-VN")} ₫
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {/* Chi tiết từng đơn hàng */}
          <div className="d-flex flex-column gap-3">
            {report.orders && report.orders.length > 0 ? (
              report.orders.map((order, idx) => (
                <div
                  key={idx}
                  className="card border-0 shadow-sm"
                  style={{
                    borderRadius: "12px",
                    transition: "transform 0.2s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.01)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                >
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h6 className="fw-bold mb-0">
                         {order.customerName || "Khách vãng lai"}
                      </h6>
                      <span className="fw-semibold text-success">
                        Tổng:{" "}
                        {Number(order.totalAmount).toLocaleString("vi-VN")} ₫
                      </span>
                    </div>

                    <table className="table table-sm align-middle mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>#</th>
                          <th>Tên món</th>
                          <th className="text-center">Số lượng</th>
                          <th className="text-end">Giá (₫)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items.map((item, i) => (
                          <tr key={i}>
                            <td>{i + 1}</td>
                            <td>{item.name}</td>
                            <td className="text-center">{item.quantity}</td>
                            <td className="text-end">
                              {Number(item.price).toLocaleString("vi-VN")} ₫
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted">
                Không có đơn hàng nào trong ngày này.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
