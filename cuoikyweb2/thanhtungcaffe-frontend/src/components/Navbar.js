import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUserRole, isAuthenticated, logout, getUsername } from "../utils/auth";

export default function Navbar() {
  const navigate = useNavigate();
  const role = getUserRole();
  const auth = isAuthenticated();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">
          Coffee Shop
        </Link>

        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto">
            {/* USER thấy menu này */}
            {role === "USER" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/menu">
                    Menu
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/tables">
                    Tables
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/orders">
                    Orders
                  </Link>
                </li>
              </>
            )}

            {/* ADMIN thấy cả menu của USER và ADMIN */}
           {role === "ADMIN" && (
  <>
    {/* --- Chức năng như USER --- */}
    <li className="nav-item">
      <Link className="nav-link" to="/menu">
        Menu
      </Link>
    </li>
    <li className="nav-item">
      <Link className="nav-link" to="/tables">
        Tables
      </Link>
    </li>
    <li className="nav-item">
      <Link className="nav-link" to="/orders">
        Orders
      </Link>
    </li>

    {/* --- Chức năng quản trị --- */}
    <li className="nav-item">
      <Link className="nav-link" to="/admin/tables">
        Table AD
      </Link>
    </li>
    <li className="nav-item">
      <Link className="nav-link" to="/admin/orders">
        Orders AD
      </Link>
    </li>
    <li className="nav-item">
      <Link className="nav-link" to="/admin/menu">
        Menu AD
      </Link>
    </li>
    <li className="nav-item">
      <Link className="nav-link" to="/admin/report">
        Report AD
      </Link>
    </li>
  </>
)}

          </ul>

          <ul className="navbar-nav ms-auto">
            {auth ? (
              <>
                <li className="nav-item">
                  <span className="nav-link">Hi, {getUsername()}</span>
                </li>
                <li className="nav-item">
                  <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
