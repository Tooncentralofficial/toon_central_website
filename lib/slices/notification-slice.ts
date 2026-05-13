import { getRequestProtected, patchRequestProtected } from "@/app/utils/queries/requests";
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { AuthState, logoutSuccess } from "./auth-slice";


export type Notification = {
    id : string;
    type : string;
    data :Record<string, any>
    readAt: string | null;
    createdAt : string;
}

type NotificationState = {
    notifications:Notification[]
    loading:boolean
    connected:boolean
    unreadCount:number
}
const initialState:NotificationState = {
    notifications :[],
    loading :false,
    connected :false,
    unreadCount :0
}

export const fetchNotifications = createAsyncThunk(
  "notification/fetchNotifications",
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as { auth: AuthState };
    const token = state.auth.token;
    console.log("@@fetchNotifications");
    if (!token) return rejectWithValue("no_token");
    const pathname =
      typeof window !== "undefined" ? window.location.pathname : "/";
    const response = await getRequestProtected(
      "/notifications?limit=10",
      token,
      pathname
    );
    console.log("@@response", response);
    if (response?.success) {
      return response?.data?.notifications;
    }
    return [];
  }
);

export const MarkNotificationAsRead = createAsyncThunk(
  "notification/markNotificationAsRead",
  async (notificationId: string, { getState, rejectWithValue }) => {
    const state = getState() as { auth: AuthState };
    const token = state.auth.token;
    if (!token) return rejectWithValue("no_token");
    const pathname =
      typeof window !== "undefined" ? window.location.pathname : "/";
    const response = await patchRequestProtected(
      {},
      `/notifications/${notificationId}/read`,
      token,
      pathname
    );
    return response?.data;
  }
);

export const MarkAllNotificationsAsRead = createAsyncThunk(
  "notification/markAllNotificationsAsRead",
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as { auth: AuthState };
    const token = state.auth.token;
    if (!token) return rejectWithValue("no_token");
    const pathname =
      typeof window !== "undefined" ? window.location.pathname : "/";
    const response = await patchRequestProtected(
      {},
      "/notifications/read-all",
      token,
      pathname
    );
    return response?.data;
  }
);

export const fetchUnreadCount = createAsyncThunk(
  "notification/fetchUnreadCount",
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as { auth: AuthState };
    const token = state.auth.token;
    if (!token) return rejectWithValue("no_token");
    const pathname =
      typeof window !== "undefined" ? window.location.pathname : "/";
    const response = await getRequestProtected(
      "/notifications/unread-count",
      token,
      pathname
    );
    if (response?.success) {
      return response?.data?.unread_count ?? 0;
    }
    return 0;
  }
);

const notificationSlice = createSlice({
    name : "notification",
    initialState,
    reducers : {
        notificationReceived : (state, action: PayloadAction<Notification>) => {
            const exists = state.notifications.some(
                (n) => n.id === action.payload.id
            );
            if (exists) return;
            state.notifications.unshift(action.payload);
            if (state.notifications.length > 10) {
                state.notifications.pop();
            }
            if (!action.payload.readAt) {
                state.unreadCount += 1;
            }
        },
        setConnected : (state, action: PayloadAction<boolean>) => {
            state.connected = action.payload;
        },
    },
    extraReducers : (builder) => {
        builder.addCase(fetchNotifications.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchNotifications.fulfilled, (state, action) => {
            console.log("@@action", action);
            state.notifications = action.payload ?? [];
            state.loading = false;
        });
        builder.addCase(fetchNotifications.rejected, (state) => {
            state.loading = false;
        });
        builder.addCase(MarkNotificationAsRead.fulfilled, (state, action) => {
            const id = action.meta.arg;
            const notification = state.notifications.find((n) => n.id === id);
            if (notification && !notification.readAt) {
                notification.readAt = new Date().toISOString();
                state.unreadCount = Math.max(0, state.unreadCount - 1);
            }
        });
        builder.addCase(MarkAllNotificationsAsRead.fulfilled, (state) => {
            const now = new Date().toISOString();
            state.notifications.forEach((n) => {
                n.readAt = n.readAt ?? now;
            });
            state.unreadCount = 0;
        });
        builder.addCase(fetchUnreadCount.fulfilled, (state, action) => {
            state.unreadCount = action.payload ?? 0;
        });
        builder.addCase(logoutSuccess, () => initialState);
    }
})

export const { notificationReceived, setConnected } = notificationSlice.actions;
export const selectNotificationState = (state: { notification: NotificationState }) => state.notification;
export const selectNotifications = (state: { notification: NotificationState }) => state.notification.notifications;
export const selectLoading = (state: { notification: NotificationState }) => state.notification.loading;
export const selectConnected = (state: { notification: NotificationState }) => state.notification.connected;
export const selectUnreadCount = (state: { notification: NotificationState }) => state.notification.unreadCount;
export default notificationSlice.reducer;