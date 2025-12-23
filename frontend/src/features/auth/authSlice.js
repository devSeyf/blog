import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { http } from "../../api/http";

// --- Function to read login data from localStorage ---
const loadAuthFromStorage = () => {
  try {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    return {
      user: user ? JSON.parse(user) : null,
      token: token || null,
    };
  } catch (e) {
    return { user: null, token: null };
  }
};


const authData = loadAuthFromStorage();
const initialState = {
  user: authData.user,
  token: authData.token,
  status: "idle",
  error: null,
};


//  --- (New registration request) ---
export const register = createAsyncThunk(
  "auth/register",
  async ({ name, email, password }, thunkAPI) => {
    try {
      const res = await http.post("/auth/register", { name, email, password });
      return res.data; // { user, token }
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Registration failed";
      return thunkAPI.rejectWithValue(message);
    }
  }
);


export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, thunkAPI) => {
    try {
      const res = await http.post("/auth/login", { email, password });
      return res.data; // { user, token }
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Login failed";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.status = "idle";
      state.error = null;

      // Cleanup storage
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },

  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
         

        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;

        // Save to storage
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // REGISTER
      .addCase(register.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        

        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;

        // Save to storage
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(register.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
