import React from "react";
import { View, Text } from "react-native";
import { useTheme } from "@react-navigation/native";
import * as Progress from "react-native-progress";

/**
 * ? Local Imports
 */
import { ICourseItem } from "models/course.model";
import { Device } from "@utils/device.ui.utils";
import CS from "@theme/styles";
import useStore from "@services/zustand/store";
import { palette } from "@theme/themes";

interface CourseItemProps extends ICourseItem {
  isHorizontalStyle: boolean;
  isSliderItem: boolean;
  dataFromApi: any;
  id: string;
}

const CourseItemProgessbar = ({
  id,
  isSliderItem,
  dataFromApi,
}: CourseItemProps) => {
  let widthImage = Device.width - 40 - 16;
  if (isSliderItem) {
    widthImage = widthImage - 40;
  }
  const theme = useTheme();
  const { colors } = theme;
  const _progressLearningData = useStore(
    (state) => state._progressLearningData,
  );
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    const data = _progressLearningData.find((item) => item.id == id);
    setData(data?.module_child_count ? data : dataFromApi);
  }, [_progressLearningData]);

  const progress = data?.module_view_count / data?.module_child_count;
  // const avatarUrl = () => {};
  if (!progress) return null;
  return (
    <View style={CS.flexRear}>
      <Progress.Bar
        progress={progress}
        width={widthImage - 30}
        color={progress == 1 ? palette.green : palette.lightBlue}
        unfilledColor={palette.grey3}
        borderWidth={0}
        height={8}
      ></Progress.Bar>
      <Text
        style={{
          marginLeft: 16,
          ...CS.hnRegular,
          color: colors.textOpacity8,
          fontSize: 14,
        }}
      >
        {Math.round(progress * 100)}%
      </Text>
    </View>
  );
};

export default React.memo(CourseItemProgessbar);
