import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import axios from 'axios'

const initialState={
  isLoading:false,
  productList : []
}

export const addnewproduct=createAsyncThunk('/products/addnewproduct',async formData=>{
  const result=await axios.post('http://localhost:5000/api/product/add',formData,{
    headers:{
      'Content-Type':'application/json'
    }
  })
  return result.data

})
export const fetchAllProduct=createAsyncThunk('/products/fetchallproduct',async ()=>{
  const result=await axios.get('http://localhost:5000/api/product/fetch'
  )
  return result.data

})
export const editproduct=createAsyncThunk('/products/editproduct',async ({id,formData})=>{
  const result=await axios.put(`http://localhost:5000/api/product/edit/${id}`,formData,{
    headers:{
      'Content-Type':'application/json'
    }
  })
  return result.data

})
export const deleteproduct=createAsyncThunk('/products/deleteproduct',async (id)=>{
  const result=await axios.delete(`http://localhost:5000/api/product/delete/${id}`)
  return {id}

})

const AdminProductSlice=createSlice({
  name:'adminProduct',
  initialState,
  reducers:{},
  extraReducers:(builder)=>{
    builder.addCase(fetchAllProduct.pending,(state)=>{
      state.isLoading=true;
    }).addCase(fetchAllProduct.fulfilled,(state,action)=>{
      state.isLoading=false;
      state.productList=action.payload.data;
      
    }).addCase(fetchAllProduct.rejected,(state,action)=>{
      state.isLoading=false;
      state.productList=[]
    }).addCase(deleteproduct.fulfilled, (state, action) => {
        const deletedId = action.payload.id;
        state.productList = state.productList.filter(product => product._id !== deletedId);
    
    })
  }

})
export default AdminProductSlice.reducer