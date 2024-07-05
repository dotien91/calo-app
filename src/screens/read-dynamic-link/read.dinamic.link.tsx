import React, { useEffect } from "react";
import dynamicLinks from "@react-native-firebase/dynamic-links";
import { View } from "react-native";
import useStore from "@services/zustand/store";

const ReadDinamicLink = () => {
  const codeInvite = useStore((state) => state.codeInvite);
  const setCodeInvite = useStore((state) => state.setCodeInvite);
  useEffect(() => {
    const handleDynamicLink = async () => {
      const link: string = await dynamicLinks().getInitialLink();
      console.log(link);
      if (link) {
        // Handle the initial link
        // navigate(link.url);
        const code = link
          .replace("https://ieltshunter.io/", "")
          .replace("&isi=6478486893&ibi=com.ikigroup.ieltshunterpro", "");
        if (codeInvite === "") {
          setCodeInvite(code);
          console.log(code);
        }
      }

      const unsubscribe = dynamicLinks().onLink(({ url }) => {
        if (url) {
          // navigate(url);
          const code = url.replace("https://ieltshunter.io/", "");
          console.log(url);

          if (codeInvite === "") {
            setCodeInvite(code);
            console.log(code);
          }
        }
      });

      return () => unsubscribe();
    };

    handleDynamicLink();
  }, []);
  return <View />;
};

export default ReadDinamicLink;
