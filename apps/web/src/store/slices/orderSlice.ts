import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { OrderDTO, OrderStatus } from "@cintiago/shared";
import type { RootState } from "../store";

interface OrderState {
  activeOrder: OrderDTO | null;
}

const initialState: OrderState = {
  activeOrder: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setActiveOrder(state, action: PayloadAction<OrderDTO>) {
      state.activeOrder = action.payload;
    },
    updateActiveOrderStatus(state, action: PayloadAction<OrderStatus>) {
      if (state.activeOrder) {
        state.activeOrder.status = action.payload;
      }
    },
    clearActiveOrder(state) {
      state.activeOrder = null;
    },
  },
});

export const { setActiveOrder, updateActiveOrderStatus, clearActiveOrder } =
  orderSlice.actions;
export default orderSlice.reducer;

// Selectors
export const selectActiveOrder = (state: RootState) => state.order.activeOrder;
