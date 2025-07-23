import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  isLoading: false,
  productList: [],
  error: null,
  productDetails:[]
};

export const getproduct = createAsyncThunk(
  'products/getproducts',
  async (queryString, thunkAPI) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/getProducts/get?${queryString}`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || 'Failed to fetch products');
    }
  }
);
export const productDetails = createAsyncThunk(
  'products/productdetails',
  async (id) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/getProducts/get/${id}`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || 'Failed to fetch products');
    }
  }
);

// Slice
const GetProductSlice = createSlice({
  name: 'getProducts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getproduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getproduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload.data; 
        state.error = null;
      })
      .addCase(getproduct.rejected, (state, action) => {
        state.isLoading = false;
        state.productList = [];
        state.error = action.payload || 'Something went wrong';
      })
      .addCase(productDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productDetails =action.payload.data;
        state.error = action.payload || 'Something went wrong';
      });
  }
});

export default GetProductSlice.reducer;
