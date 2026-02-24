import React, { useEffect, useState } from "react";
import axios from "../../api/axiosConfig";
import { toast } from "react-toastify";
import { Modal, Button, Table, Spinner, Form } from "react-bootstrap";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [addingItem, setAddingItem] = useState(false);
  const [newItem, setNewItem] = useState({ menuItemId: "", quantity: 1 });
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    fetchOrders();
    fetchMenu();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/orders");
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const fetchMenu = async () => {
    try {
      const res = await axios.get("/menu");
      setMenu(res.data);
    } catch {
      toast.error("Không thể tải menu!");
    }
  };

  const handleView = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handlePay = async (orderId) => {
    if (!window.confirm("Xác nhận thanh toán đơn hàng này?")) return;
    try {
      await axios.put(`/orders/${orderId}/pay`);
      toast.success("Thanh toán thành công!");
      fetchOrders();
    } catch {
      toast.error("Lỗi khi thanh toán đơn hàng");
    }
  };

  const handleCancel = async (orderId) => {
    if (!window.confirm("Bạn có chắc muốn hủy đơn hàng này không?")) return;
    try {
      await axios.put(`/orders/${orderId}/cancel`);
      toast.info("Đã hủy đơn hàng!");
      fetchOrders();
    } catch (err) {
  console.error(err);
  if (err.response?.status === 403) {
    toast.error("Bạn không có quyền hủy đơn này!");
  } else {
    toast.error("Không thể hủy đơn hàng!");
  }
}

  };

  const handleDelete = async (orderId) => {
    if (!window.confirm("Bạn có chắc muốn xóa đơn hàng này không?")) return;
    try {
      await axios.delete(`/orders/${orderId}`);
      toast.success("Đã xóa đơn hàng!");
      fetchOrders();
    } catch {
      toast.error("Không thể xóa đơn hàng!");
    }
  };

  const handleAddItem = async () => {
    if (!newItem.menuItemId || newItem.quantity < 1) {
      toast.warning("Vui lòng chọn món và số lượng hợp lệ!");
      return;
    }
    setAddingItem(true);
    try {
      await axios.post(`/orders/${selectedOrder.id}/add-item`, newItem);
      toast.success("Đã thêm món!");
      const updated = await axios.get(`/orders/${selectedOrder.id}`);
      setSelectedOrder(updated.data);
      fetchOrders();
      setNewItem({ menuItemId: "", quantity: 1 });
    } catch (err) {
      console.error(err);
      toast.error("Không thể thêm món!");
    } finally {
      setAddingItem(false);
    }
  };

  // Sửa endpoint cho đúng với backend
  const handleRemoveItem = async (itemId) => {
    if (!window.confirm("Xác nhận hủy món này khỏi đơn?")) return;
    try {
      await axios.delete(`/orders/${selectedOrder.id}/remove-item/${itemId}`);
      toast.info("Đã hủy món!");
      const updated = await axios.get(`/orders/${selectedOrder.id}`);
      setSelectedOrder(updated.data);
      fetchOrders();
    } catch (err) {
      console.error(err);
      toast.error("Không thể hủy món!");
    }
  };

  const renderBadge = (status) => {
    const map = {
      NEW: "secondary",
      IN_PROGRESS: "info",
      COMPLETED: "success",
      PAID: "dark",
      CANCELLED: "danger", // backend dùng CANCELLED (2 L)
    };
    return (
      <span className={`badge text-bg-${map[status] || "secondary"}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-3 fw-bold">📋 Quản lý Đơn hàng</h3>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Table striped bordered hover responsive className="align-middle">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Bàn</th>
              <th>Số món</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Thời gian</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center">
                  Không có đơn hàng nào
                </td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr key={o.id}>
                  <td>{o.id}</td>
                  <td>{o.table?.name}</td>
                  <td>{o.items?.length || 0}</td>
                  <td>{o.totalAmount?.toLocaleString()}đ</td>
                  <td>{renderBadge(o.status)}</td>
                  <td>{new Date(o.createdAt).toLocaleString()}</td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleView(o)}
                    >
                      Xem
                    </Button>{" "}
                    {o.status !== "PAID" && o.status !== "CANCELLED" && (
                      <>
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handlePay(o.id)}
                        >
                          Thanh toán
                        </Button>{" "}
                        <Button
                          variant="warning"
                          size="sm"
                          onClick={() => handleCancel(o.id)}
                        >
                          Hủy đơn
                        </Button>{" "}
                      </>
                    )}
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(o.id)}
                    >
                      Xóa
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      )}

      {/* MODAL CHI TIẾT */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết đơn hàng #{selectedOrder?.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder ? (
            <>
              <p>
                <strong>Bàn:</strong> {selectedOrder.table?.name}
              </p>
              <p>
                <strong>Khách hàng:</strong> {selectedOrder.user?.fullName}
              </p>
              <p>
                <strong>Trạng thái:</strong> {renderBadge(selectedOrder.status)}
              </p>
              <p>
                <strong>Thời gian:</strong>{" "}
                {new Date(selectedOrder.createdAt).toLocaleString()}
              </p>

              <h5 className="mt-3">Danh sách món</h5>
              <Table bordered hover>
                <thead>
                  <tr>
                    <th>Tên món</th>
                    <th>Số lượng</th>
                    <th>Giá</th>
                    <th>Thành tiền</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((it) => (
                    <tr key={it.id}>
                      <td>{it.menuItem?.name}</td>
                      <td>{it.quantity}</td>
                      <td>{it.price.toLocaleString()}đ</td>
                      <td>
                        {(it.price * it.quantity).toLocaleString()}đ
                      </td>
                      <td>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleRemoveItem(it.id)}
                        >
                          Hủy món
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {/* THÊM MÓN */}
              <div className="mt-4">
                <h6>➕ Thêm món mới</h6>
                <div className="d-flex gap-2">
                  <Form.Select
                    value={newItem.menuItemId}
                    onChange={(e) =>
                      setNewItem({ ...newItem, menuItemId: e.target.value })
                    }
                    style={{ maxWidth: 250 }}
                  >
                    <option value="">-- Chọn món --</option>
                    {menu.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.price.toLocaleString()}đ)
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control
                    type="number"
                    min="1"
                    style={{ width: 80 }}
                    value={newItem.quantity}
                    onChange={(e) =>
                      setNewItem({
                        ...newItem,
                        quantity: Number(e.target.value),
                      })
                    }
                  />
                  <Button
                    variant="primary"
                    disabled={addingItem}
                    onClick={handleAddItem}
                  >
                    {addingItem ? "Đang thêm..." : "Thêm"}
                  </Button>
                </div>
              </div>

              <div className="text-end fw-bold fs-5 mt-4">
                Tổng cộng: {selectedOrder.totalAmount.toLocaleString()}đ
              </div>
            </>
          ) : (
            <p>Không có dữ liệu đơn hàng.</p>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}
