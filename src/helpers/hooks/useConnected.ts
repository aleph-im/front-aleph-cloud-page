import { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { AppStateContext } from "@/pages/_app";

/**
 * Redirects to a route if the user is not connected
 *
 * @param route The path to redirect to (defaults to "/")
 */
export default function useConnected(route: string = "/") {
  const [state, dispatch] = useContext(AppStateContext);

  const router = useRouter();
  useEffect(() => {
    if (!state.account) {
      router.replace(route);
    }
  });
}
