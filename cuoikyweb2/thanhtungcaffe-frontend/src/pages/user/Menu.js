import React, { useEffect, useState } from "react";
import axios from "../../api/axiosConfig";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Menu() {
  const [menu, setMenu] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMenu();
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const fetchMenu = async () => {
    try {
      const res = await axios.get("/menu");
      setMenu(res.data);
      const uniqueCategories = [...new Set(res.data.map(item => item.category))];
      setCategories(uniqueCategories);
      setSelectedCategory(uniqueCategories[0] || null);
    } catch (err) {
      toast.error("Lỗi tải menu");
    }
  };

  // Khi click vào món ăn
  const handleCardClick = (item) => {
    if (!isLoggedIn) {
      toast.warning("Vui lòng đăng nhập để đặt món");
      navigate("/login");
      return;
    }

    //Lưu món tạm thời vào localStorage để chuyển sang Orders
    localStorage.setItem("selectedItem", JSON.stringify(item));
    navigate("/tables");
  };

  const filteredMenu = selectedCategory
    ? menu.filter(m => m.category === selectedCategory)
    : menu;

  return (
    <div className="container mt-4">
      <h3 className="mb-3">Menu</h3>

      <div className="d-flex">
        {/* Sidebar danh mục */}
        <div style={{ minWidth: "160px", marginRight: "20px" }}>
          {categories.map(cat => (
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

        {/* Menu món ăn */}
        <div className="flex-grow-1">
          <h5 className="mb-3">{selectedCategory}</h5>
          <div className="row">
            {filteredMenu.map(item => (
              <div key={item.id} className="col-md-4 mb-3">
                <div
                  className="card p-2 h-100 shadow-sm"
                  style={{
                    cursor: "pointer",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease"
                  }}
                  onClick={() => handleCardClick(item)}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = "scale(1.02)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 12px rgba(0,0,0,0.1)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                 {item.image && (
  <img
    src={
      item.image.startsWith("http")
        ? item.image
        : `http://localhost:8082/uploads/${item.image}`
    }
    alt={item.name}
    style={{
      width: "100%",
      height: "150px",
      objectFit: "cover",
      borderRadius: "5px"
    }}
    onError={(e) => {
      e.currentTarget.src = "/default-drink.jpg"; 
    }}
  />
)}

                  <div className="mt-2">
                    <strong>{item.name}</strong>
                  </div>
                  <div>{item.price}đ</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
