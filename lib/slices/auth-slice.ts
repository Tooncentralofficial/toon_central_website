import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { retrieveUser } from "../session/retrieveUser";

export interface AuthState {
  user?: any | null;
  token?: string | null;
  userType?: string | null;
  pending?: boolean;
  error?: boolean;
}

const userInit: AuthState = {
  user: null,
  token: null,
  userType: null,
  pending: false,
  error: false,
};

export const getUser = createAsyncThunk("auth/getuser", async () => {
  const user: any = await retrieveUser();
  // console.log("retrieved user", user);
  return user;
});
export const authSlice = createSlice({
  name: "auth",
  initialState: userInit,
  reducers: {
    loginSuccess: (state, action) => {
      // let remembered = action.payload?.rememberMe;
      let payload: AuthState = {
        user: action.payload?.profile,
        token: action.payload?.accessToken,
        userType: action.payload?.userType,
      };
      state.user = payload.user;
      state.token = payload.token;
      state.userType = payload.userType;
    },
    updateSuccess: (state, action) => {
      let data = {
        ...state.user,
        ...action.payload?.user,
      };
      state.user = data;
    },
    logoutSuccess: (state) => {
      state.user = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUser.pending, (state) => {
      state.pending = true;
    });
    builder.addCase(getUser.fulfilled, (state, { payload }) => {
      state.pending = false;
      state.token = payload?.token;
      state.user = payload?.user;
      state.userType = payload?.userType;
    });
    builder.addCase(getUser.rejected, (state) => {
      state.pending = false;
      state.error = true;
    });
  },
});

export const {
  loginSuccess,
  logoutSuccess,
  updateSuccess,
  //resetUserState
} = authSlice.actions;
export const selectAuthState = (state: { auth: AuthState }) => state.auth;
export default authSlice.reducer;
