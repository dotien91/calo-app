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
      if (link) {
        // Handle the initial link
        // navigate(link.url);
        console.log("link...", link);
        const code = link
          .replace("https://ikigai.vn/", "")
          .replace("https://ikigaicoach.net/", "")
          .replace("&isi=6484263984&ibi=com.ikigroup.ikicoach", "");
        console.log(code);
        if (codeInvite === "") {
          setCodeInvite(code);
        }
      }

      const unsubscribe = dynamicLinks().onLink(({ url }) => {
        if (url) {
          // navigate(url);
          console.log("url 2...", url);
          const code = url
            .replace("https://ikigai.vn/", "")
            .replace("https://ikigaicoach.net/", "");
          console.log(code);
          if (codeInvite === "") {
            setCodeInvite(code);
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
