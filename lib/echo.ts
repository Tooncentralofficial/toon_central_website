import Echo from "laravel-echo";
import Pusher from "pusher-js";
import {
  baseUrl,
  reverbAppKey,
  reverbHost,
  reverbPort,
  reverbScheme,
} from "@/envs";

let echoInstance: Echo<any> | null = null;
let echoToken: string | null = null;

if (typeof window !== "undefined") {
  (window as any).Pusher = Pusher;
}

export const getEcho = (token?: string | null): Echo<any> | null => {
  if (typeof window === "undefined") return null;

  if (echoInstance && echoToken === (token ?? null)) {
    return echoInstance;
  }

  if (echoInstance && echoToken !== (token ?? null)) {
    disconnectEcho();
  }

  const forceTLS = reverbScheme === "https";

  echoInstance = new Echo({
    broadcaster: "reverb",
    key: reverbAppKey,
    wsHost: reverbHost,
    wsPort: reverbPort,
    wssPort: reverbPort,
    forceTLS,
    enabledTransports: ["ws", "wss"],
    authEndpoint: `${baseUrl}/broadcasting/auth`,
    auth: {
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          }
        : { Accept: "application/json" },
    },
  });

  echoToken = token ?? null;
  return echoInstance;
};

export const disconnectEcho = (): void => {
  if (echoInstance) {
    try {
      echoInstance.disconnect();
    } catch {
      /* no-op */
    }
    echoInstance = null;
    echoToken = null;
  }
};

export default getEcho;
