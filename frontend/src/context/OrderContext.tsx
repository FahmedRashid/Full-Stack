import React, { createContext, useReducer, ReactNode, Dispatch } from "react";

// Creating context with default value (null, case to correct type  )
export const OrdersContext = createContext<OrderContextType | undefined>(
  undefined
);

interface Order {
  //typescript cannot sync with 2 networks/projects. So needed to reclasify the ts model interface order here so that Order can be used.
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
//define states and action types
interface OrderState {
  orders: Order[] | null;
}

type OrdersAction =
  | { type: "SET_ORDERS"; payload: Order[] }
  | { type: "CREATE_ORDERS"; payload: Order }
  | { type: "DELETE_ORDER"; payload: Order }
  | { type: "UPDATE_ORDER"; payload: Order };
//Creating context type
interface OrderContextType {
  state: OrderState;
  dispatch: Dispatch<OrdersAction>;
}

//Reducer Function
export const ordersReducer = (
  state: OrderState,
  action: OrdersAction
): OrderState => {
  switch (action.type) {
    case "SET_ORDERS":
      return {
        orders: action.payload,
      };
    case "CREATE_ORDERS":
      return {
        orders: [action.payload, ...(state.orders || [])],
      };
    case "DELETE_ORDER":
      return {
        orders: (state.orders || []).filter(
          (o) => o._id !== action.payload._id
        ),
      };
    case "UPDATE_ORDER":
      return {
        orders: (state.orders || []).map((order) =>
          order._id === action.payload._id ? action.payload : order
        ),
      };
    default:
      return state;
  }
};
// Provider component
export const OrderContextProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(ordersReducer, {
    orders: null,
  });

  return (
    <OrdersContext.Provider value={{ state, dispatch }}>
      {children}
    </OrdersContext.Provider>
  );
};
