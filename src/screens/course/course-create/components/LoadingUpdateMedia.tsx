import React from "react";
import { View } from "react-native";

import SkeletonPlaceholder from "@shared-components/skeleton";

const LoadingUpdateMedia = () => {
  return (
    <SkeletonPlaceholder>
      <View style={{ width: "100%", height: "100%" }}></View>
    </SkeletonPlaceholder>
  );
};

export default LoadingUpdateMedia;
