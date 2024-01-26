import React from "react";
import { View } from "react-native";

import { HS, MHS, VS } from "@utils/size.utils";
import SkeletonPlaceholder from "./skeleton";
import { Device } from "@utils/device.ui.utils";

const LoadingItem = () => {
  return (
    <SkeletonPlaceholder>
      <View style={{ width: "100%", alignSelf: "center" }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
            marginVertical: VS._14,
          }}
        >
          <View
            style={{
              width: Device.width - 36,
              marginHorizontal: 16,
              height: (Device.width - 36) / 1.7,
              borderRadius: 10,
            }}
          />
          <View style={{ marginLeft: HS._20 }}>
            <View
              style={{ width: HS._120, height: HS._16, borderRadius: HS._4 }}
            />
            <View
              style={{
                marginTop: HS._6,
                width: HS._80,
                height: HS._16,
                borderRadius: HS._4,
              }}
            />
          </View>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
          marginVertical: VS._14,
        }}
      >
        <View
          style={{
            width: HS._36,
            marginLeft: HS._20,
            height: HS._36,
            borderRadius: MHS._50,
          }}
        />
        <View style={{ marginLeft: HS._20 }}>
          <View
            style={{ width: HS._120, height: HS._16, borderRadius: HS._4 }}
          />
          <View
            style={{
              marginTop: HS._6,
              width: HS._80,
              height: HS._16,
              borderRadius: HS._4,
            }}
          />
        </View>
      </View>
    </SkeletonPlaceholder>
  );
};

export default LoadingItem;
