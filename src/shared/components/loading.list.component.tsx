import React from "react";
import { View } from "react-native";

import { HS, MHS, VS } from "@utils/size.utils";
import useStore from "@services/zustand/store";
import SkeletonPlaceholder from "./skeleton";

const LIGHT_SKELETON = {
  backgroundColor: "#E1E9EE",
  highlightColor: "#F2F8FC",
};
const DARK_SKELETON = {
  backgroundColor: "#2C2C2E",
  highlightColor: "#3A3A3C",
};

const LoadingList = ({
  numberItem = 1,
}: {
  numberItem?: number;
  hideAvatar?: boolean;
}) => {
  const isDarkMode = useStore((state) => state.isDarkMode);
  const skeletonColors = isDarkMode ? DARK_SKELETON : LIGHT_SKELETON;
  const array = Array.from(Array(numberItem - 1).keys());

  return (
    <SkeletonPlaceholder
      backgroundColor={skeletonColors.backgroundColor}
      highlightColor={skeletonColors.highlightColor}
    >
      <>
        {array.map((item) => (
          <View key={item} style={{ width: "100%", alignSelf: "center" }}>
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
          </View>
        ))}
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
        </View>
      </>
    </SkeletonPlaceholder>
  );
};

export default LoadingList;
