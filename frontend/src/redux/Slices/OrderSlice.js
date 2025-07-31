import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const createOrder = createAsyncThunk('order/create', async (orderData) => {
  const { userId, items, totalAmount, sessionId } = orderData;

  const payload = {
    userId,
    items,
    totalAmount,
    sessionId, // ✅ forward this
  };

  const res = await axios.post('http://localhost:5000/api/order/orderdetail', payload);
  return res.data;
});



const orderSlice = createSlice({
  name: 'order',
  initialState: {
    orderInfo: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orderInfo = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default orderSlice.reducer;
