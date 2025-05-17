import { useState } from "react";
import { useOrdersContext } from "../../hooks/useOrdersContext";
import { ConfirmModal } from "../Extras/ConfirmModal";
import { formatDistanceToNow } from "date-fns";
import { OrderForm } from "./OrderForm";
import { Modal } from "../Extras/Modal";
interface Order {
  _id: string;
  customerName: string;
  productName: string;
  quantity: number;
  price: number;
  status: "pending" | "shipped" | "delivered" | "canceled";
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}
interface OrderDetailsProps {
  order: Order;
}
export const OrderDetails: React.FC<OrderDetailsProps> = ({ order }) => {
  const { dispatch } = useOrdersContext();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isEditing, setEditing] = useState(false);

  const handleDelete = async () => {
    // delete Order
    setShowConfirm(false); // Close modal after deletion
    const response = await fetch("/api/orders/" + order._id, {
      method: "DELETE",
    });
    const json = await response.json();
    if (response.ok) {
      dispatch({ type: "DELETE_ORDER", payload: json });
    }
  };

  return (
    <div className="order-details">
      <div className="order-actions">
        <button
          className="order_delete"
          onClick={() => setShowConfirm(true)}
          aria-label="Delete Order"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="20"
            width="20"
            viewBox="0 0 24 24"
            fill="white"
          >
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
          </svg>
        </button>

        <button
          className="order_update"
          onClick={() => setEditing(true)}
          aria-label="Update Order"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="20"
            width="20"
            viewBox="0 0 24 24"
            fill="white"
          >
            <path d="M3 17.25V21h3.75l11.06-11.06-3.75-3.75L3 17.25zm17.71-10.04a1.003 1.003 0 0 0 0-1.42l-2.5-2.5a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.92-1.66z" />
          </svg>
        </button>
      </div>
      <h4>{order.customerName}</h4>
      <p>Product Name: {order.productName}</p>
      <p>Quantity: {order.quantity}</p>
      {/* <p>Price: {order.price}</p> */}
      <p>Status: {order.status}</p>
      {/* <p>Total Price: {order.totalPrice} $</p> */}
      <p className="order-date">
        {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
      </p>{" "}
      {/*formatted date and time and show mins or days */}
      {showConfirm && (
        <ConfirmModal
          message="Are you sure you want to delete this order?"
          onConfirm={handleDelete}
          onCancel={() => setShowConfirm(false)}
        />
      )}
      {isEditing && (
        <Modal onClose={() => setEditing(false)}>
          <OrderForm
            mode="update"
            selectedOrder={order}
            onFinish={() => setEditing(false)}
          />
        </Modal>
      )}
    </div>
  );
};
