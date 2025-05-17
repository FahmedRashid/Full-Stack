import React from "react";

interface Order {
  _id: string;
  customerName: string;
  productName: string;
  quantity: number;
  price: number;
  status: 'pending' | 'shipped' | 'delivered' | 'canceled';
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

interface InvoiceDetailsProps {
  orders: Order[]; // Taking array of orders
}

export const InvoiceDetails: React.FC<InvoiceDetailsProps> = ({ orders }) => {
  if (orders.length === 0) return <p>No orders available.</p>;

  const customerName = orders[0].customerName;
  const invoiceDate = new Date(orders[0].createdAt).toLocaleDateString();

  function formatWithEllipsis(value: number): string{
    const [intPart, decimalPart] = value.toString().split(".");
    if(!decimalPart || decimalPart.length <= 2){
      return value.toFixed(2); // Still show two decimals for constency
    }
    return `${intPart}.${decimalPart.slice(0, 2)}...`;
  }

  const grandTotal = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    
    return(
        <div className="invoice-container">
          <h2>Invoice</h2>
          <div className="invoice-header">
            <p><strong>Customer:</strong> {customerName}</p>
            <p><strong>Date:</strong> {invoiceDate}</p>
            <p><strong>Total Orders:</strong> {orders.length}</p>
          </div>
          <div className="invoice-table-wrapper">
          <table className="invoice-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Price (each)</th>
                <th>Subtotal</th>
                {/* <th>Status</th> */}
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={(order._id)}>
                  <td>{order.productName}</td>
                  <td>{(order.quantity)}</td>
                  <td>${formatWithEllipsis(order.price)}</td>
                  <td>${formatWithEllipsis(order.quantity * order.price)}</td>
                  {/* <td>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</td> */}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="invoice-total">
            <p><strong>Grand Total:</strong> ${formatWithEllipsis(grandTotal)}</p>
          </div>
          </div>
        </div>
    );
  };