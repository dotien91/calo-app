import React, { useEffect } from "react";
import { AppState, AppStateStatus } from "react-native";

export default function useAppStateCheck() {
  const [appStateStatus, setAppStateStatus] = React.useState(null);

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    setAppStateStatus(nextAppState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  useEffect(() => {
    const eventListener = AppState.addEventListener(
      "change",
      handleAppStateChange,
    );
    return () => {
      eventListener && eventListener.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleAppStateChange]);

  return {
    appStateStatus,
  };
}
