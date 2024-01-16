import React, { useEffect } from "react";
import {
  NativeEventSubscription,
  AppState,
  AppStateStatus,
} from "react-native";

export default function useAppStateCheck() {
  const [appStateStatus, setAppStateStatus] = React.useState(null);

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    setAppStateStatus(nextAppState);
  };

  useEffect(() => {
    let eventListener: NativeEventSubscription;
    eventListener = AppState.addEventListener("change", handleAppStateChange);
    return () => {
      eventListener && eventListener.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleAppStateChange]);

  return {
    appStateStatus,
  };
}
