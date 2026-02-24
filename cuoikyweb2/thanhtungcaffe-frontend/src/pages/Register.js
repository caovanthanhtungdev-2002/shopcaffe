import React, { useState } from "react";
import axios from "../api/axiosConfig";
import { toast } from "react-toastify";

export default function Register() {
  const [form, setForm] = useState({ username: "", password: "", fullName: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post("/auth/register", form);
      toast.success("Đăng ký thành công. Vui lòng đăng nhập.");
      window.location.href = "/login";
    } catch (err) {
      toast.error(err.response?.data || err.message || "Lỗi đăng ký");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 480 }}>
      <h3>Đăng ký</h3>
      <form onSubmit={submit}>
        <input className="form-control my-2" placeholder="Username" value={form.username}
               onChange={e => setForm({ ...form, username: e.target.value })} required />
        <input className="form-control my-2" placeholder="Full name (optional)" value={form.fullName}
               onChange={e => setForm({ ...form, fullName: e.target.value })} />
        <input className="form-control my-2" type="password" placeholder="Password" value={form.password}
               onChange={e => setForm({ ...form, password: e.target.value })} required />
        <button className="btn btn-success w-100" disabled={loading}>{loading ? "Đang..." : "Register"}</button>
      </form>
    </div>
  );
}
