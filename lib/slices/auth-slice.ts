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
  credits?: number;
  hasSubscription?: boolean;
  subscriptionName?: string | null;
}

const userInit: AuthState = {
  user: null,
  token: null,
  userType: null,
  pending: false,
  error: false,
  credits: 0,
  hasSubscription: false,
  subscriptionName: null,
};

export const getUser = createAsyncThunk("auth/getuser", async () => {
  const user: any = await retrieveUser();
  return user;
});

export const getCredits = createAsyncThunk(
  "auth/getCredits",
  async (_, { getState }) => {
    const state = getState() as { auth: AuthState };
    const token = state.auth.token;
    const response = await getRequestProtected(
      "profile/wallet",
      token,
      typeof window !== "undefined" ? window.location.pathname : "/"
    );
    if (response?.success) {
      return response?.data?.coinBalance ?? 0;
    }
    return 0;
  }
);

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (userUpdates: any, { getState, dispatch }) => {
    const state = getState() as { auth: AuthState };
    const token = state.auth.token;
    const userType = state.auth.userType;
    const response = await getRequestProtected(
      "/profile",
      token,
      window.location.pathname
    );
    if (response?.success) {
      const { data } = response;
      const user = {
        ...state.auth.user,
        photo: data?.photo,
        first_name: data?.firstName,
        last_name: data?.lastName,
        telephone: data?.telephone,
        username: data?.username,
        country_id: data?.countryId,
        mobile_operator_id: data?.mobileOperatorId,
        email: data?.email,
        welcome_note: data?.welcomeNote,
        credits: data?.credits,
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
    loginSuccess: (state , action) => {
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
    setCredits: (state, action) => {
      state.credits = action.payload;
    },
    setSubscription: (state, action) => {
      state.hasSubscription = action.payload?.hasSubscription ?? false;
      state.subscriptionName = action.payload?.name ?? null;
    },
    logoutSuccess: (state) => {
      state.user = null;
      state.token = null;
      state.credits = 0;
      state.hasSubscription = false;
      state.subscriptionName = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUser.pending, (state) => {
      state.pending = true;
    });
    builder.addCase(getUser.fulfilled, (state, { payload }) => {
      state.pending = false;
      // Only update auth state if payload contains valid data
      // This prevents clearing auth state when retrieveUser returns null
      // (e.g., if local JWT verification fails but backend token is still valid)
      if (payload && (payload.token || payload.user)) {
        state.token = payload?.token || state.token;
        state.user = payload?.user || state.user;
        state.userType = payload?.userType || state.userType;
      }
      // If payload is null but we have existing state, preserve it
      // This prevents logging out users when token verification temporarily fails
    });
    builder.addCase(getUser.rejected, (state) => {
      state.pending = false;
      state.error = true;
    });
    builder.addCase(getCredits.fulfilled, (state, { payload }) => {
      state.credits = payload ?? 0;
    });
    builder.addCase(updateProfile.fulfilled, (state, { payload }) => {
      if (payload?.success) {
        const user = {
          ...state.user,
          photo: payload?.data?.photo,
          first_name: payload?.data?.firstName,
          last_name: payload?.data?.lastName,
          telephone: payload?.data?.telephone,
          username: payload?.data?.username,
          country_id: payload?.data?.countryId,
          mobile_operator_id: payload?.data?.mobileOperatorId,
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
  setCredits,
  setSubscription,
  //resetUserState
} = authSlice.actions;
export const selectAuthState = (state: { auth: AuthState }) => state.auth;
export const selectCredits = (state: { auth: AuthState }) =>
  state.auth.credits ?? 0;
export const selectHasSubscription = (state: { auth: AuthState }) =>
  state.auth.hasSubscription ?? false;
export const selectSubscriptionName = (state: { auth: AuthState }) =>
  state.auth.subscriptionName ?? null;
export default authSlice.reducer;
