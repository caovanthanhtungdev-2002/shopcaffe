import React, { useEffect, useState } from "react";
import axios from "../../api/axiosConfig";
import { toast } from "react-toastify";

export default function AdminMenu() {
  const [menu, setMenu] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    price: "",
    image: null,
  });

  const [editingItem, setEditingItem] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    category: "",
    price: "",
    image: null,
  });

  useEffect(() => {
    fetchMenu();
    fetchCategories();
  }, []);

  const fetchMenu = async () => {
    try {
      const res = await axios.get("/menu");
      setMenu(res.data);
    } catch {
      toast.error("Lỗi tải menu");
    }
  };

  //Lấy danh mục có sẵn từ server
  const fetchCategories = async () => {
    try {
      const res = await axios.get("/menu/categories");
      setCategories(res.data);
    } catch {
      toast.error("Lỗi tải danh mục");
    }
  };

  //Thêm món mới
  const handleAdd = async () => {
    if (!newItem.name || !newItem.category || !newItem.price)
      return toast.warning("Nhập đủ thông tin");

    const formData = new FormData();
    const menuData = {
      name: newItem.name,
      category: newItem.category,
      price: newItem.price,
    };
    formData.append(
      "menu",
      new Blob([JSON.stringify(menuData)], { type: "application/json" })
    );
    if (newItem.image) formData.append("image", newItem.image);

    try {
      await axios.post("/menu", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Thêm món thành công");
      setNewItem({ name: "", category: "", price: "", image: null });
      fetchMenu();
    } catch (err) {
      console.error(err);
      toast.error("Không thể thêm món");
    }
  };

  //Xóa món
  const handleDelete = async (id) => {
    if (!window.confirm("Xóa món này?")) return;
    try {
      await axios.delete(`/menu/${id}`);
      toast.success("Đã xóa");
      fetchMenu();
    } catch {
      toast.error("Không thể xóa");
    }
  };

  const startEdit = (item) => {
    setEditingItem(item.id);
    setEditData({
      name: item.name,
      category: item.category,
      price: item.price,
      image: null,
    });
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setEditData({ name: "", category: "", price: "", image: null });
  };

  //Cập nhật món
  const handleUpdate = async (id) => {
    if (!editData.name || !editData.category || !editData.price)
      return toast.warning("Nhập đủ thông tin");

    const formData = new FormData();
    const menuData = {
      name: editData.name,
      category: editData.category,
      price: editData.price,
    };
    formData.append(
      "menu",
      new Blob([JSON.stringify(menuData)], { type: "application/json" })
    );
    if (editData.image) formData.append("image", editData.image);

    try {
      await axios.put(`/menu/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Cập nhật thành công");
      cancelEdit();
      fetchMenu();
    } catch (err) {
      console.error(err);
      toast.error("Không thể cập nhật món");
    }
  };

  return (
    <div className="container mt-4">
      <h3>Quản lý Menu</h3>

      {/* Thêm món mới */}
      <div className="card p-3 mb-3 shadow-sm">
        <div className="d-flex flex-wrap gap-2">
          <input
            className="form-control"
            placeholder="Tên món"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          />

          {/* Dropdown danh mục có sẵn */}
          <select
            className="form-control"
            value={newItem.category}
            onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
          >
            <option value="">-- Chọn danh mục --</option>
            {categories.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <input
            className="form-control"
            type="number"
            placeholder="Giá"
            value={newItem.price}
            onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
          />

          <input
            type="file"
            className="form-control"
            onChange={(e) =>
              setNewItem({ ...newItem, image: e.target.files[0] })
            }
          />

          <button className="btn btn-success" onClick={handleAdd}>
            Thêm món
          </button>
        </div>
      </div>

      {/* Danh sách món */}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Ảnh</th>
            <th>Tên món</th>
            <th>Danh mục</th>
            <th>Giá</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {menu.map((m) => (
            <tr key={m.id}>
              <td>{m.id}</td>
              <td>
                {m.image && (
                  <img
                    src={`http://localhost:8082/uploads/${m.image}`}
                    alt={m.name}
                    width="70"
                    height="50"
                    style={{ objectFit: "cover", borderRadius: "5px" }}
                  />
                )}
              </td>
              {editingItem === m.id ? (
                <>
                  <td>
                    <input
                      className="form-control"
                      value={editData.name}
                      onChange={(e) =>
                        setEditData({ ...editData, name: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    {/* Dropdown chọn danh mục khi sửa */}
                    <select
                      className="form-control"
                      value={editData.category}
                      onChange={(e) =>
                        setEditData({ ...editData, category: e.target.value })
                      }
                    >
                      <option value="">-- Chọn danh mục --</option>
                      {categories.map((cat, index) => (
                        <option key={index} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      className="form-control"
                      type="number"
                      value={editData.price}
                      onChange={(e) =>
                        setEditData({ ...editData, price: e.target.value })
                      }
                    />
                    <input
                      type="file"
                      className="form-control mt-1"
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          image: e.target.files[0],
                        })
                      }
                    />
                  </td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm me-2"
                      onClick={() => handleUpdate(m.id)}
                    >
                      Lưu
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={cancelEdit}
                    >
                      Hủy
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td>{m.name}</td>
                  <td>{m.category}</td>
                  <td>{m.price}đ</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => startEdit(m)}
                    >
                      Sửa
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(m.id)}
                    >
                      Xóa
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
