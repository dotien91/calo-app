import React, { useEffect } from "react";
import { Keyboard } from "react-native";

export default function useKeyboardListener() {
  const [isShowKeyboard, setIsShowKeyboard] = React.useState(false);

  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setIsShowKeyboard(true);
        // setchildHeight(childHeight + heightOfKeybaordHeight);
      },
    );
    const keyboardWillHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setIsShowKeyboard(false);
        // setchildHeight(childHeight - heightOfKeybaordHeight);
      },
    );

    return () => {
      keyboardWillHideListener.remove();
      keyboardWillShowListener.remove();
    };
  }, []);

  return {
    isShowKeyboard,
  };
}
