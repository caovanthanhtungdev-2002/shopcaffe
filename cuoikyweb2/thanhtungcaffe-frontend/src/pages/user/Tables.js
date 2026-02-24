import React, { useEffect, useState } from "react";
import axios from "../../api/axiosConfig";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getUserRole } from "../../utils/auth";

export default function Tables() {
  const [tables, setTables] = useState([]);
  const navigate = useNavigate();
  const role = getUserRole();

 useEffect(() => {
  if (role !== "USER" && role !== "ADMIN") {
    navigate("/login");
    return;
  }
  fetchTables();
}, [role, navigate]);



  const fetchTables = async () => {
    try {
      const res = await axios.get("/tables");
      const filtered = res.data.filter(t => ["AVAILABLE", "OCCUPIED", "PAID"].includes(t.status));
      const mapped = filtered.map(t => {
        if (t.status === "PAID") {
          return { ...t, displayStatus: "OCCUPIED" }; 
        }
        return { ...t, displayStatus: t.status };
      });
      setTables(mapped);
    } catch (err) {
      console.error(err);
    }
  };

  const selectTable = (t) => {
    if (t.displayStatus === "OCCUPIED") {
      toast.warning("Bàn này đang có người sử dụng");
      return;
    }

    // ✅ Lưu bàn vào localStorage
    localStorage.setItem("selectedTable", JSON.stringify(t));

    // Chuyển sang trang Orders
    navigate("/orders");
  };

  const selectedTable = localStorage.getItem("selectedTable")
    ? JSON.parse(localStorage.getItem("selectedTable"))
    : null;

  return (
    <div className="container mt-4">
      <h3>Chọn bàn để đặt món</h3>
      <div className="row">
        {tables.map(t => (
          <div key={t.id} className="col-md-4 mb-3">
            <div
              className={`card p-3 ${
                selectedTable && selectedTable.id === t.id ? "bg-danger text-white" : ""
              }`}
              style={{
                cursor: t.displayStatus === "AVAILABLE" ? "pointer" : "not-allowed"
              }}
              onClick={() => selectTable(t)}
            >
              <h5>{t.name}</h5>
              <p>Sức chứa: {t.capacity}</p>
              <p>Trạng thái: <strong>{t.displayStatus}</strong></p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
