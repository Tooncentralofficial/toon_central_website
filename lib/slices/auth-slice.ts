import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { retrieveUser } from "../session/retrieveUser";
import { getRequestProtected } from "@/app/utils/queries/requests";
import { UpdateUser } from "@/app/auth/login/login";

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

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (userUpdates: any, { getState, dispatch }) => {
    const state = getState() as { auth: AuthState };
    const token = state.auth.token;
    const userType=state.auth.userType
    const response = await getRequestProtected(
      "/profile",
      token,
      window.location.pathname
    );
    if (response?.success) {
      const{data}=response
      const user = {
        ...state.auth.user,
        photo: data?.photo,
        first_name: data?.firstName,
        last_name: data?.lastName,
        phone: data?.phone,
        username: data?.username,
        country_id: data?.countryId,
        email: data?.email,
        welcome_note: data?.welcomeNote,
      };
      const payload = {
        userType: userType, 
        user: user,
        token: token,
      };
      // TODO:UPDATE REM fix
      const remember = true;
      await UpdateUser(payload, remember);
    }
    return response;
  }
);

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
    builder.addCase(updateProfile.fulfilled, (state, { payload }) => {
      if (payload?.success) {
        const user = {
          ...state.user,
          photo: payload?.data?.photo,
          first_name: payload?.data?.firstName,
          last_name: payload?.data?.lastName,
          phone: payload?.data?.phone,
          username: payload?.data?.username,
          country_id: payload?.data?.countryId,
          email: payload?.data?.email,
          welcome_note: payload?.data?.welcomeNote,
        };
        state.user = user;
      }
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
