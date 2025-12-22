import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  status: "idle",
  error: null,
};


const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {},
});


 

export default authSlice.reducer;

