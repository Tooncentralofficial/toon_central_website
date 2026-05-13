"use client";
import { useQuery } from "@tanstack/react-query";
import H2SectionTitle from "../_shared/layout/h2SectionTitle";
import NotificationPanel from "./_components/NotificationPanel";
import { getRequest, getRequestProtected } from "../utils/queries/requests";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { selectAuthState } from "@/lib/slices/auth-slice";
import { useAppDispatch } from "@/lib/store";
import { fetchNotifications, selectNotifications } from "@/lib/slices/notification-slice";
import { useEffect } from "react";

export default function ClientPage() {
    const { token } = useSelector(selectAuthState);
    const notifications = useSelector(selectNotifications);
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(fetchNotifications() as any);
    }, [dispatch]);
    const pathname = usePathname();
    // const { data, isLoading, isFetching, isSuccess } = useQuery({
    //     queryKey: ["notifications"],
    //     queryFn: () => getRequestProtected("/notifications?page=1&limit=10", token, pathname),
    //     enabled: token !== null,
    // });
    // const notifications = data?.data?.data || [];

    console.log("@@notifications", notifications);
    
  return (
    <div>
      <H2SectionTitle title="Notifications" />
            <div className="flex flex-col gap-5 mt-5">
              {Array(10)
                .fill(0)
                .map((item: number, i: number) => (
                  <NotificationPanel key={i} />
                ))}
              
            </div>
    </div>
  );
}