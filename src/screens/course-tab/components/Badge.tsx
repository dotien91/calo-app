import { Text, TouchableOpacity } from "react-native";
import React, { memo } from "react";

import { palette } from "@theme/themes";
import CS from "@theme/styles";
import useStore from "@services/zustand/store";
import { navigate } from "@helpers/navigation.helper";
import { SCREENS } from "constants";

interface IBadge {
  title: string;
}

const Badge = ({ title }: IBadge) => {
  const setListCourseFilterParams = useStore(
    (state) => state.setListCourseFilterParams,
  );
  const onPressBtnFilter = () => {
    setListCourseFilterParams({ ["skills"]: [title] });
    navigate(SCREENS.COURSE_CATEGORY);
  };

  return (
    <TouchableOpacity
      onPress={onPressBtnFilter}
      style={{
        padding: 8,
        paddingVertical: 1,
        borderRadius: 99,
        backgroundColor: palette.bgBestSeller,
        alignSelf: "flex-start",
      }}
    >
      <Text style={{ ...CS.hnMedium, color: palette.primary, fontSize: 12 }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default memo(Badge);
