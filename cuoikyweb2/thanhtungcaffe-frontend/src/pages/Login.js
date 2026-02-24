import React, { useState } from "react";
import axios from "../api/axiosConfig";
import { saveToken } from "../utils/auth";
import { toast } from "react-toastify";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post("/auth/login", form);

      const token = res.data.token || res.data.accessToken;
      if (!token) {
        console.error("Login response:", res.data);
        toast.error("Không nhận được token từ server");
        setLoading(false);
        return;
      }

      saveToken(token);
      toast.success("Đăng nhập thành công");
      window.location.href = "/";
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Lỗi đăng nhập");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 420 }}>
      <h3>Đăng nhập</h3>
      <form onSubmit={submit}>
        <input
          className="form-control my-2"
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
        />
        <input
          className="form-control my-2"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <button className="btn btn-primary w-100" disabled={loading}>
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </form>
    </div>
  );
}
