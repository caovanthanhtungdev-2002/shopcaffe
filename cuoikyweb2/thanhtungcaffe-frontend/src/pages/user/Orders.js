import React, { useEffect, useState } from "react";
import axios from "../../api/axiosConfig";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getUserRole } from "../../utils/auth";

export default function Orders() {
  const navigate = useNavigate();
  const role = getUserRole();

  const [tables, setTables] = useState([]);
  const [menu, setMenu] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [tableId, setTableId] = useState(null);
  const [cart, setCart] = useState([]);

  //Base URL ảnh
  const imageBaseUrl = "http://localhost:8082/uploads/";

  //Load từ localStorage
  useEffect(() => {
    const savedTable = localStorage.getItem("selectedTable");
    if (savedTable) {
      const t = JSON.parse(savedTable);
      setTableId(t.id);
    }

    const savedItem = localStorage.getItem("selectedItem");
    if (savedItem) {
      const item = JSON.parse(savedItem);
      setCart([{ menuItemId: item.id, quantity: 1 }]);
      localStorage.removeItem("selectedItem");
    }
  }, []);

  // Kiểm tra quyền & load dữ liệu
  useEffect(() => {
  if (role !== "USER" && role !== "ADMIN") {
    navigate("/login");
    return;
  }
  fetchTables();
  fetchMenu();
}, [role, navigate]);


  const fetchTables = async () => {
    try {
      const res = await axios.get("/tables");
      const filtered = res.data.map((t) =>
        t.status === "PAID" ? { ...t, status: "AVAILABLE" } : t
      );
      setTables(filtered);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMenu = async () => {
    try {
      const res = await axios.get("/menu");
      setMenu(res.data);
      const uniqueCategories = [...new Set(res.data.map((i) => i.category))];
      setCategories(uniqueCategories);
      setSelectedCategory(uniqueCategories[0] || null);
    } catch (err) {
      console.error(err);
    }
  };

  //Giỏ hàng
  const addToCart = (item) => {
    setCart((prev) => {
      const exist = prev.find((c) => c.menuItemId === item.id);
      if (exist) {
        return prev.map((c) =>
          c.menuItemId === item.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      } else {
        return [...prev, { menuItemId: item.id, quantity: 1 }];
      }
    });
  };

  const decreaseQuantity = (menuItemId) => {
    setCart((prev) =>
      prev
        .map((c) =>
          c.menuItemId === menuItemId
            ? { ...c, quantity: c.quantity - 1 }
            : c
        )
        .filter((c) => c.quantity > 0)
    );
  };

  const removeFromCart = (menuItemId) => {
    setCart((prev) => prev.filter((c) => c.menuItemId !== menuItemId));
  };

  //Đặt món
  const createOrder = async () => {
    if (!tableId) {
      toast.error("Chọn bàn trước khi đặt món");
      return;
    }
    if (!cart.length) {
      toast.warning("Giỏ hàng trống");
      return;
    }

    const selectedTable = tables.find((t) => t.id === tableId);
    if (!selectedTable) {
      toast.error("Bàn không hợp lệ");
      return;
    }
    if (selectedTable.status === "OCCUPIED") {
      toast.warning("Bàn đang có người sử dụng");
      return;
    }

    try {
      const payload = {
        tableId,
        items: cart.map((c) => ({
          menuItemId: c.menuItemId,
          quantity: c.quantity,
        })),
      };
      await axios.post("/orders", payload);
      toast.success("Đặt món thành công");

      setCart([]);
      fetchTables();
      localStorage.removeItem("selectedTable");
      navigate("/menu");
    } catch (err) {
      toast.error(err.response?.data || "Lỗi đặt món");
    }
  };

  //Tính tổng
  const totalAmount = cart.reduce((sum, c) => {
    const item = menu.find((m) => m.id === c.menuItemId);
    return sum + (item?.price || 0) * c.quantity;
  }, 0);

  const filteredMenu = menu.filter((m) => m.category === selectedCategory);

  return (
    <div className="container mt-4">
      {/* --- Chọn bàn --- */}
      <div className="card p-3 mb-3 shadow-sm rounded">
        <div className="d-flex flex-wrap gap-2 mb-2">
          {tables.map((t) => (
            <button
              key={t.id}
              className={`btn ${
                tableId === t.id ? "btn-primary" : "btn-outline-primary"
              } ${t.status === "OCCUPIED" ? "btn-danger disabled" : ""}`}
              onClick={() => t.status !== "OCCUPIED" && setTableId(t.id)}
              style={{
                width: "120px",
                height: "50px",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                overflow: "hidden",
              }}
            >
              {t.name} {t.status === "OCCUPIED" ? "(Đang sử dụng)" : ""}
            </button>
          ))}
        </div>
      </div>

      {/* --- Danh mục và menu --- */}
      <div className="d-flex">
        {/* Sidebar category */}
        <div style={{ minWidth: "150px", marginRight: "20px" }}>
          {categories.map((cat) => (
            <div
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`p-2 mb-2 border text-center ${
                selectedCategory === cat ? "bg-primary text-white" : ""
              }`}
              style={{ cursor: "pointer", borderRadius: "5px" }}
            >
              {cat}
            </div>
          ))}
        </div>

        {/* Menu items */}
        <div className="flex-grow-1">
          <h3>{selectedCategory}</h3>
          <div className="row">
            {filteredMenu.map((m) => (
              <div key={m.id} className="col-md-4 mb-3">
                <div className="card p-2 h-100 shadow-sm border-0">
                  {m.image && (
                    <img
                      src={`${imageBaseUrl}${m.image}`}
                      alt={m.name}
                      style={{
                        width: "100%",
                        height: "150px",
                        objectFit: "cover",
                        borderRadius: "5px",
                      }}
                    />
                  )}
                  <div className="mt-2">
                    <strong>{m.name}</strong>
                  </div>
                  <div className="text-muted mb-2">{m.price}đ</div>
                  <button
                    className="btn btn-sm btn-primary mt-auto w-100"
                    onClick={() => addToCart(m)}
                  >
                    Thêm
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- Giỏ hàng  --- */}
      <div className="card mt-4 shadow-lg border-0 p-4 rounded-4 w-100">
        {cart.length === 0 ? (
          <div className="text-center text-muted py-3">
            Chưa có món nào được chọn.
          </div>
        ) : (
          <>
            <div
              className="list-group mb-3"
              style={{ maxHeight: "400px", overflowY: "auto" }}
            >
              {cart.map((ci) => {
                const item = menu.find((m) => m.id === ci.menuItemId);
                if (!item) return null;
                return (
                  <div
                    key={ci.menuItemId}
                    className="list-group-item d-flex justify-content-between align-items-center border-0 border-bottom py-3"
                  >
                    <div className="d-flex align-items-center">
                      {item.image && (
                        <img
                          src={`${imageBaseUrl}${item.image}`}
                          alt={item.name}
                          style={{
                            width: "60px",
                            height: "60px",
                            borderRadius: "8px",
                            objectFit: "cover",
                            marginRight: "12px",
                          }}
                        />
                      )}
                      <div>
                        <div className="fw-semibold">{item.name}</div>
                        <div className="text-muted small">
                          {item.price}đ / món
                        </div>
                      </div>
                    </div>

                    <div className="d-flex align-items-center">
                      <button
                        className="btn btn-sm btn-outline-secondary me-2 rounded-circle"
                        onClick={() => decreaseQuantity(ci.menuItemId)}
                      >
                        -
                      </button>
                      <span className="mx-2 fw-bold">{ci.quantity}</span>
                      <button
                        className="btn btn-sm btn-outline-secondary me-3 rounded-circle"
                        onClick={() => addToCart(item)}
                      >
                        +
                      </button>
                      <span className="me-3 fw-semibold">
                        {item.price * ci.quantity}đ
                      </span>
                      <button
                        className="btn btn-sm btn-outline-danger rounded-circle"
                        onClick={() => removeFromCart(ci.menuItemId)}
                      >
                        🗑
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="d-flex justify-content-between align-items-center border-top pt-3">
              <h5 className="fw-bold mb-0 text-primary">
                Tổng cộng: {totalAmount.toLocaleString()}đ
              </h5>
              <button className="btn btn-success px-4" onClick={createOrder}>
                Đặt món
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
