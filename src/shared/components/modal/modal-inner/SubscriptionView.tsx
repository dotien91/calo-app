import React from "react";
import { View } from "react-native";
/**
 * ? Local Imports
 */
import FastImage from "react-native-fast-image";
import useStore from "@services/zustand/store";
import { Device } from "@utils/device.ui.utils";
import { palette } from "@theme/themes";
import TextBase from "@shared-components/TextBase";
import SubscriptionBtn from "@screens/home/components/subscription-btn/SubscriptionBtn";

const SubscriptionView = () => {
  const extraUserData = useStore((state) => state.extraUserData);
  const data = extraUserData?.subscription_sell;
  if (!data) return null;

  return (
    <View
      style={{
        backgroundColor: palette.white,
        padding: 16,
        borderRadius: 12,
      }}
    >
      <FastImage
        style={{
          width: Device.width - 64,
          height: ((Device.width - 64) * 9) / 16,
          borderRadius: 12,
          marginBottom: 16,
        }}
        source={{ uri: data.cover_url }}
      />
      <View>
        <TextBase title={data.title} fontWeight="600" fontSize={20} />
        <TextBase title={data.des} />
        <SubscriptionBtn />
      </View>
    </View>
  );
};

export default React.memo(SubscriptionView);
