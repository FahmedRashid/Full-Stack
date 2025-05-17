import React, { useEffect, useState } from "react";
import { useOrdersContext } from "../../hooks/useOrdersContext";

interface OrderFormProps {
  selectedOrder?: {
    _id?: string;
    customerName: string;
    productName: string;
    quantity: number;
    price: number;
    status: string;
    totalPrice: number;
  };
  mode?: "create" | "update";
  onFinish?: () => void; // Reset the form after update
}
export const OrderForm: React.FC<OrderFormProps> = ({
  selectedOrder,
  mode = "create",
  onFinish,
}) => {
  const { dispatch } = useOrdersContext();
  const [customerName, setCustomerName] = useState(
    selectedOrder?.customerName || ""
  );
  const [productName, setProductName] = useState(
    selectedOrder?.productName || ""
  );
  // const [quantity, setQuantity] = useState(selectedOrder?.quantity?.toString() || "");
  const [quantity, setQuantity] = useState<number>(selectedOrder?.quantity ?? 0);
  const [price, setPrice] = useState(selectedOrder?.price?.toString() || "");
  const [status, setStatus] = useState(selectedOrder?.status || "");
  const [totalPrice, setTotalPrice] = useState(
    selectedOrder?.totalPrice?.toString() || ""
  );
  const [error, setError] = useState<string | null>(null);
  const [emptyFields, setEmptyFields] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  //Calculate total price
  useEffect(() => {
    const qty = quantity;
    const prc = parseFloat(price);
    if (!isNaN(qty) && !isNaN(prc)) {
      setTotalPrice((qty * prc).toFixed(2));
    } else {
      setTotalPrice("");
    }
  }, [quantity, price]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    //In TypeScript, if you don't explicitly define the type for a parameter, and noImplicitAny is enabled in your tsconfig.json (which it typically is for strict typing), then any parameter without a type is assumed to be of type any, which raises this warning/error. --> need to explicitly type the e parameter in your handleSubmit function as a React.FormEvent<HTMLFormElement>:
    e.preventDefault();
    setLoading(true);

    // Building order object early
    const order = {
      customerName,
      productName,
      quantity,
      price,
      status,
      totalPrice,
    };
    //check if any fields are empty //Validate fields
    const requireFields = [
      "customerName",
      "productName",
      "quantity",
      "price",
      "status",
    ];
    const emptyFieldsList = requireFields.filter(
      (field) => !order[field as keyof typeof order]
    );
    if (emptyFieldsList.length > 0) {
      //if there are empty fields, setting the state and return early
      setEmptyFields(emptyFieldsList);
      setLoading(false);
      return;
    }

    setEmptyFields([]);
    setError(null);

    //fetch api for post
    try {
      let response: Response;
      if (mode === "create") {
        response = await fetch("/api/orders", {
          method: "POST",
          body: JSON.stringify(order),
          headers: {
            "Content-Type": "application/json",
          },
        });
      } else if (mode === "update" && selectedOrder?._id) {
        response = await fetch(`/api/orders/${selectedOrder._id}`, {
          method: "PATCH",
          body: JSON.stringify(order),
          headers: {
            "Content-Type": "application/json",
          },
        });
      } else {
        setError("Invalid form state: Cannot submit.");
        setLoading(false);
        return; // Exist early so that response is assured
      }

      const json = await response.json();

      // check json response
      if (!response.ok) {
        setError(json.error);
        setEmptyFields(json.emptyFields || []);
      } else {
        setCustomerName("");
        setProductName("");
        setQuantity(0);
        setPrice("");
        setStatus("");
        setTotalPrice("");
        setError(null);
        setEmptyFields([]);
        // console.log("New Order added", json);
        if (mode === "create") {
          dispatch({ type: "CREATE_ORDERS", payload: json });
        } else {
          dispatch({ type: "UPDATE_ORDER", payload: json });
        }
        if (onFinish) onFinish();
      }
    } catch (err: any) {
      setError("Something went wrong while submitting.");
      console.error(err);
    } finally {
      setLoading(false);
    }
    // if(loading) return; // To prevent duplicate sumbmission.
  };

  return (
    <form className="create" onSubmit={handleSubmit}>
      <h3>{mode === "create" ? "Add a new Order" : "Update Order"}</h3>

      <label>Customer Name</label>
      <select
        className={`custom-select ${
          emptyFields.includes("customerName") ? "error" : ""
        }`}
        value={customerName}
        onChange={(e) => setCustomerName(e.target.value)}
      >
        <option value="" disabled hidden>
          {emptyFields.includes("customerName")
            ? "Customer Name is required"
            : "Choose a Customer"}
        </option>
        <option>Fahmed</option>
      </select>

      <label>Product Name</label>
      <select
        className={`custom-select ${
          emptyFields.includes("productName") ? "error" : ""
        }`}
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
      >
        <option value="" disabled hidden>
          {emptyFields.includes("productName")
            ? "Product Name is required"
            : "Choose a product"}
        </option>
        <option>Keyboard</option>
        <option>Mouse</option>
        <option>Monitor</option>
        <option>Headphones</option>
      </select>

      <label>Quantity</label>
      <input
        type="number"
        onWheel={(e) => e.currentTarget.blur()} //disables scroll wheel increment.
        onChange={(e) => {
          const value = e.target.value;
          // Convert the value to a number
          const numericValue = Number(value);

          // You could add additional checks here if needed
          if (!isNaN(numericValue)) {
            setQuantity(numericValue); // Set the quantity as a number
            setEmptyFields((prevFields) =>
              prevFields.filter((field) => field !== "quantity")
            ); // Clear error if valid
          } else {
            setEmptyFields((prevFields) =>
              !prevFields.includes("quantity")
                ? [...prevFields, "quantity"]
                : prevFields
            ); // Add error if not valid
          }
        }}
        value={quantity}
        placeholder={
          emptyFields.includes("quantity") ? "Quantity must be an integer" : ""
        }
        className={`no-spinner ${
          emptyFields.includes("quantity") ? "error placeholder-error" : ""
        }`        }
      />

      <label>Price</label>
      <input
        type="number"
        onWheel={(e) => e.currentTarget.blur()} //disables scroll wheel increment.
        onChange={(e) => setPrice(e.target.value)}
        value={price}
        placeholder={emptyFields.includes("price") ? "Price is required" : ""}
        className={
          emptyFields.includes("price") ? "error placeholder-error" : ""
        }
      />

      <label>Status</label>
      <select
        className={`custom-select ${
          emptyFields.includes("status") ? "error" : ""
        }`}
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="" disabled hidden>
          {emptyFields.includes("status")
            ? "Status is required"
            : "Select Status"}
        </option>
        <option value="pending">Pending</option>
        <option value="shipped">Shipped</option>
        <option value="delivered">Delivered</option>
        <option value="canceled">Canceled</option>
      </select>

      <label>Total Price</label>
      <input
        className="readonly-input"
        type="number"
        onChange={(e) => setTotalPrice(e.target.value)}
        value={totalPrice}
        readOnly
      />
      <div className="form-button">
        <button type="submit" disabled={loading}>
          {loading
            ? mode === "create"
              ? "Adding..."
              : "Saving..."
            : mode === "create"
            ? "Add Order"
            : "Save Changes"}
        </button>
        {mode === "update" && onFinish && (
          <button type="button" onClick={onFinish} className="cancel-button">
            Cancel
          </button>
        )}
      </div>
      {error && <div className="error">{error}</div>}
    </form>
  );
};
