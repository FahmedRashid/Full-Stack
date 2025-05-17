import { useEffect } from "react";
import { useOrdersContext } from "../hooks/useOrdersContext";
// components
import { OrderDetails } from "../components/Order/OrderDetails";
import { OrderForm } from "../components/Order/OrderForm";
import { InvoiceDetails } from "../components/Order/InvoiceDetails";

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

export const Orders = () => {
  const { state, dispatch } = useOrdersContext();
  const { orders } = state;

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await fetch("/api/orders");
      const json = (await response.json()) as Order[]; //json response from /api/orders is guaranteed to match the Order[] shape, but if it might vary, casting it as Order[] is extra safe
      if (response.ok) {
        dispatch({ type: "SET_ORDERS", payload: json });
      }
    };
    fetchOrders();
  }, [dispatch]);

  return (
    <main className="home">
      {/* Main Container */}
      <div className="container-flex">
        {/* Order Form */}
        <div className="">
          <OrderForm />
        </div>

        {/* Order List */}
        <div className="order-details">
          <h3>Order List</h3>
          <div className="orders">
            {orders && orders.length > 0 ? (
              orders.map((order: Order) => (
                <OrderDetails key={order._id} order={order} />
              ))
            ) : (
              <div className="no-orders-message">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="50"
                  width="50"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-13c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z" />
                </svg>
                <img
                  src="https://media.giphy.com/media/3og0IPxMM0erATueVW/giphy.gif"
                  alt="No orders GIF"
                  style={{ width: "50%", height: "auto", objectFit: "cover" }}
                />
              </div>
            )}
          </div>
        </div>
        <div>
          {orders && orders.length > 0 ? (
            <InvoiceDetails orders={orders} />
          ) : (
            <div className="no-invoice-message">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="50"
                width="50"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-13c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z" />
              </svg>
              <img
                src="https://media.giphy.com/media/xT0xeJpnrWC4XWblEk/giphy.gif"
                alt="No invoice GIF"
                style={{ width: "40%", height: "auto", objectFit: "cover" }}
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
};
