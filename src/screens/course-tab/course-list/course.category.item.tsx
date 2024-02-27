import React from "react";
import { FlatList, View } from "react-native";
import * as NavigationService from "react-navigation-helpers";
/**
 * ? Local Imports
 */
import { ICourseItem } from "models/course.model";
import { useListData } from "@helpers/hooks/useListData";
import CourseItem from "../components/course.item";
import { getMyCourse } from "@services/api/course.api";
import LoadingItem from "@shared-components/loading.item";
import CourseCategoryTitle from "./course.category.title";
import useStore from "@services/zustand/store";
import { translations } from "@localization";
import { SCREENS } from "constants";
import PressableBtn from "@shared-components/button/PressableBtn";
import IconBtn from "@shared-components/button/IconBtn";
import CS from "@theme/styles";
import { palette } from "@theme/themes";

interface CourseCategoryItemProps {}

const CourseCategoryItem: React.FC<CourseCategoryItemProps> = () => {
  const userData = useStore((state) => state.userData);
  const { listData, isLoading } = useListData<ICourseItem>(
    {
      auth_id: userData?._id,
      order_by: "ASC",
      sort_by: "createdAt",
    },
    getMyCourse,
  );

  const data = React.useMemo(() => {
    return listData.slice(0, 5);
  }, [listData]);

  console.log("listDatalistData", listData);

  const renderItem = (item: ICourseItem, index: number) => {
    return (
      <>
        <CourseItem isSliderItem data={item.item} key={index} />
        {item.index == 4 && (
          <View style={{ flex: 1, ...CS.flexCenter }}>
            <PressableBtn
              onPress={openMyCourse}
              style={{
                ...CS.flexCenter,
                padding: 8,
                backgroundColor: palette.grey,
                borderRadius: 99,
                marginRight: 20,
              }}
            >
              <IconBtn name="chevron-right" size={40} />
            </PressableBtn>
          </View>
        )}
      </>
    );
  };

  const openMyCourse = () => {
    NavigationService.navigate(SCREENS.MY_COURES);
  };

  if (isLoading) return <LoadingItem />;
  if (!listData.length) return null;

  return (
    <View>
      <CourseCategoryTitle
        title={translations.course.myCourse}
        onPress={openMyCourse}
      />
      <FlatList
        showsHorizontalScrollIndicator={false}
        data={data}
        horizontal={true}
        renderItem={renderItem}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingLeft: 16,
          paddingBottom: 16,
        }}
        initialNumToRender={2}
        onEndReachedThreshold={0}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        keyExtractor={(item) => item?._id + ""}
      />
    </View>
  );
};

export default React.memo(CourseCategoryItem);
