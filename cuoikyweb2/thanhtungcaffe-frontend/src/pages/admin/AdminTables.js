import React, { useEffect, useState } from "react";
import axios from "../../api/axiosConfig";
import { toast } from "react-toastify";

export default function AdminTables() {
  const [tables, setTables] = useState([]);
  const [newTable, setNewTable] = useState({ name: "", capacity: "" });
  const [editingTable, setEditingTable] = useState(null); 

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const res = await axios.get("/tables");
      setTables(res.data);
    } catch {
      toast.error("Không tải được danh sách bàn");
    }
  };

  // Thêm bàn mới
  const handleAdd = async () => {
    if (!newTable.name || !newTable.capacity)
      return toast.warning("Nhập đủ thông tin");
    try {
      await axios.post("/tables", { ...newTable, status: "AVAILABLE" });
      toast.success("Thêm bàn thành công");
      setNewTable({ name: "", capacity: "" });
      fetchTables();
    } catch {
      toast.error("Lỗi khi thêm bàn");
    }
  };

  // 🗑️ Xóa bàn
  const handleDelete = async (id) => {
    if (!window.confirm("Xóa bàn này?")) return;
    try {
      await axios.delete(`/tables/${id}`);
      toast.success("Xóa thành công");
      fetchTables();
    } catch {
      toast.error("Không thể xóa bàn (có thể bàn đang được sử dụng)");
    }
  };

  // Chọn bàn để sửa
  const startEdit = (table) => {
    setEditingTable({ ...table });
  };

  // Lưu bàn sau khi chỉnh sửa
  const handleSaveEdit = async () => {
    if (!editingTable.name || !editingTable.capacity)
      return toast.warning("Vui lòng nhập đủ thông tin");

    try {
      await axios.put(`/tables/${editingTable.id}`, {
        name: editingTable.name,
        capacity: editingTable.capacity,
        status: editingTable.status,
      });
      toast.success("Cập nhật thành công");
      setEditingTable(null);
      fetchTables();
    } catch {
      toast.error("Lỗi khi cập nhật bàn");
    }
  };

  //Hủy chỉnh sửa
  const cancelEdit = () => {
    setEditingTable(null);
  };

  return (
    <div className="container mt-4">
      <h3>Quản lý bàn</h3>

      {/* Thêm bàn mới */}
      <div className="card p-3 mb-3 shadow-sm">
        <h5>Thêm bàn mới</h5>
        <div className="d-flex gap-2">
          <input
            className="form-control"
            placeholder="Tên bàn"
            value={newTable.name}
            onChange={(e) =>
              setNewTable({ ...newTable, name: e.target.value })
            }
          />
          <input
            className="form-control"
            type="number"
            placeholder="Sức chứa"
            value={newTable.capacity}
            onChange={(e) =>
              setNewTable({ ...newTable, capacity: e.target.value })
            }
          />
          <button className="btn btn-success" onClick={handleAdd}>
            Thêm
          </button>
        </div>
      </div>

      {/* Danh sách bàn */}
      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>Tên bàn</th>
            <th>Sức chứa</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {tables.map((t) => (
            <tr key={t.id}>
              <td>{t.id}</td>
              <td>{t.name}</td>
              <td>{t.capacity}</td>
              <td>{t.status}</td>
              <td className="d-flex gap-2">
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => startEdit(t)}
                >
                  Sửa
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(t.id)}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal sửa bàn */}
      {editingTable && (
        <div className="modal fade show" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content shadow-lg">
              <div className="modal-header">
                <h5 className="modal-title">Chỉnh sửa bàn #{editingTable.id}</h5>
                <button className="btn-close" onClick={cancelEdit}></button>
              </div>
              <div className="modal-body">
                <label>Tên bàn</label>
                <input
                  className="form-control mb-2"
                  value={editingTable.name}
                  onChange={(e) =>
                    setEditingTable({
                      ...editingTable,
                      name: e.target.value,
                    })
                  }
                />
                <label>Sức chứa</label>
                <input
                  className="form-control mb-2"
                  type="number"
                  value={editingTable.capacity}
                  onChange={(e) =>
                    setEditingTable({
                      ...editingTable,
                      capacity: e.target.value,
                    })
                  }
                />
                <label>Trạng thái</label>
                <select
                  className="form-select"
                  value={editingTable.status}
                  onChange={(e) =>
                    setEditingTable({
                      ...editingTable,
                      status: e.target.value,
                    })
                  }
                >
                  <option value="AVAILABLE">AVAILABLE</option>
                  <option value="OCCUPIED">OCCUPIED</option>
                  <option value="PAID">PAID</option>
                </select>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={cancelEdit}>
                  Hủy
                </button>
                <button className="btn btn-success" onClick={handleSaveEdit}>
                  Lưu thay đổi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
