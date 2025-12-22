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
  reducers: {

    reducers: {
  logout: (state) => {
    state.user = null;
    state.token = null;
    state.status = "idle";
    state.error = null;
  },
},

  },
});


 
export const { logout } = authSlice.actions;
export default authSlice.reducer;


