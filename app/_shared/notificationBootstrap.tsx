"use client";

import { useEffect } from "react";
import { useAppDispatch, useTypedSelector } from "@/lib/store";
import { disconnectEcho, getEcho } from "@/lib/echo";
import {
  fetchNotifications,
  fetchUnreadCount,
  Notification,
  notificationReceived,
  setConnected,
} from "@/lib/slices/notification-slice";
import { selectAuthState } from "@/lib/slices/auth-slice";

export const NotificationBootstrap = () => {
  const dispatch = useAppDispatch();
  const { user, token } = useTypedSelector(selectAuthState);
  const userId = user?.id;

  useEffect(() => {
    if (!token || !userId) {
      disconnectEcho();
      dispatch(setConnected(false));
      return;
    }

    const echo = getEcho(token);
    if (!echo) return;

    const channelName = `App.Models.User.${userId}`;
    const channel = echo.private(channelName);

    channel
      .subscribed(() => {
        dispatch(setConnected(true));
        dispatch(fetchNotifications());
        dispatch(fetchUnreadCount());
      })
      .error(() => dispatch(setConnected(false)))
      .listen(".NotificationCreated", (event: Notification) => {
        dispatch(notificationReceived(event));
      });

    const pusher = (echo.connector as any).pusher;
    const onDisconnect = () => dispatch(setConnected(false));
    pusher?.connection?.bind("disconnected", onDisconnect);

    return () => {
      channel.stopListening(".NotificationCreated");
      echo.leave(channelName);
      pusher?.connection?.unbind("disconnected", onDisconnect);
      dispatch(setConnected(false));
    };
  }, [token, userId, dispatch]);

  return null;
};

export default NotificationBootstrap;
