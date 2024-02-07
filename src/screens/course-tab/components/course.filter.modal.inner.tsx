import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
// import { useTheme } from "@react-navigation/native";
import { Controller, useForm } from "react-hook-form";
import lodash from "lodash";
// import * as NavigationService from "react-navigation-helpers";
/**
 * ? Local Imports
 */
import useStore from "@services/zustand/store";
import { filterCourseKeys, filterTeacherKeys } from "constants/course.constant";
import CS from "@theme/styles";
import { palette } from "@theme/themes";
import { translations } from "@localization";
import PressableBtn from "@shared-components/button/PressableBtn";
import {
  ICourseItem,
  EnumCourseType,
  EnumCourseFilter,
  EnumTutorFilter,
} from "models/course.model";
import { closeSuperModal } from "@helpers/super.modal.helper";
import MultiCheckBox from "@shared-components/form/MultiCheckbox";
import SliderWithInput from "@shared-components/form/SliderWithInput";
import { getCourseList, getListTutor } from "@services/api/course.api";
import { useListSearch } from "@helpers/hooks/useListSearch";
import RNSwitch from "@shared-components/switch/RNSwitch";

interface CourseFilterModalInnterType {
  courseType: string;
  params: any;
  callback: () => void;
}

const CourseFilterModalInnter = ({
  courseType,
  params,
  callback,
}: CourseFilterModalInnterType) => {
  const isCourseType = courseType == EnumCourseType.course;

  const listCourseFilterParams = useStore(
    (state) => state.listCourseFilterParams,
  );
  const setListCourseFilterParams = useStore(
    (state) => state.setListCourseFilterParams,
  );
  const courseSearchHistory = useStore((state) => state.courseSearchHistory);

  const [paramsRequest, setParamsRequest] = React.useState(
    listCourseFilterParams,
  );
  const { isLoading, totalCount } = useListSearch<ICourseItem>(
    { ...paramsRequest, search: courseSearchHistory },
    isCourseType ? getCourseList : getListTutor,
  );

  const {
    watch,
    control,
    reset,
    resetField,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      types: listCourseFilterParams?.[EnumCourseFilter.types] || [],
      skills: listCourseFilterParams?.[EnumCourseFilter.skills] || [],
      price: [
        listCourseFilterParams?.["min_price"] || 0,
        listCourseFilterParams?.["max_price"] || 1e9,
      ],
      levels: listCourseFilterParams?.[EnumCourseFilter.levels] || [],
      onlyEnglishNativeSpeakers: false,
      timeAvailable: [],
      levelOfTutor: [],
    },
  });

  const hasError = React.useMemo(() => !lodash.isEmpty(errors), [errors]);

  React.useEffect(() => {
    const maxPrice =
      Number(watch(EnumCourseFilter.price)?.[1]) > 0
        ? watch(EnumCourseFilter.price)?.[1]
        : 1e5 + "";
    let newParamsRequest = {};
    if (courseType == EnumCourseType.course) {
      newParamsRequest = {
        types: watch(EnumCourseFilter.types),
        skills: watch(EnumCourseFilter.skills),
        min_price: watch(EnumCourseFilter.price)?.[0] + "" || "0",
        max_price: maxPrice + "",
        level: watch(EnumCourseFilter.levels),
        onlyEnglishNativeSpeakers: !!watch(
          EnumCourseFilter.onlyEnglishNativeSpeakers,
        ),
      };
    } else {
      newParamsRequest = {
        types: watch(EnumTutorFilter.types),
        skills: watch(EnumTutorFilter.skills),
        timeAvailable: watch(EnumTutorFilter.timeAvailable),
        levelOfTutor: watch(EnumTutorFilter.levelOfTutor),
        onlyEnglishNativeSpeakers: !!watch(
          EnumTutorFilter.onlyEnglishNativeSpeakers,
        ),
      };
    }

    if (lodash.isEmpty(errors)) {
      setParamsRequest((old) => {
        return { ...old, ...newParamsRequest };
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    watch(EnumTutorFilter.types),
    watch(EnumTutorFilter.skills),
    watch(EnumCourseFilter.price),
    watch(EnumCourseFilter.levels),
    watch(EnumTutorFilter.onlyEnglishNativeSpeakers),
    watch(EnumTutorFilter.timeAvailable),
    watch(EnumTutorFilter.levelOfTutor),
  ]);

  const closeModal = React.useCallback(() => {
    setListCourseFilterParams(paramsRequest);
    closeSuperModal();
    !!callback && callback(paramsRequest);
  }, [paramsRequest]);

  const renderItem = (item) => {
    return (
      <View
        style={[
          { marginBottom: 12 },
          item.id == EnumCourseFilter.onlyEnglishNativeSpeakers && CS.flexRear,
        ]}
      >
        <Text style={styles.itemFilterLabel}>{item.name}</Text>
        <View style={styles.wrapBtnFilter}>
          {item.id == EnumCourseFilter.price && (
            <Controller
              control={control}
              render={({ field: { onChange, value } }) => (
                <SliderWithInput
                  value={value || [0, 1e9]}
                  onChange={onChange}
                  defaultValue={[0, 1e9]}
                  setError={setError}
                  clearErrors={clearErrors}
                />
              )}
              name={item.id}
            />
          )}
          {item?.keyFilters && (
            <Controller
              control={control}
              render={({ field: { onChange, value } }) => (
                <MultiCheckBox
                  onChange={onChange}
                  items={item.keyFilters}
                  value={value || []}
                  defaultValue={params?.[item.id] || []}
                />
              )}
              name={item.id}
            />
          )}
          {item.id == EnumCourseFilter.onlyEnglishNativeSpeakers && (
            <Controller
              control={control}
              render={({ field: { onChange, value } }) => (
                <RNSwitch value={value} onChange={onChange} />
              )}
              name={item.id}
            />
          )}
        </View>
      </View>
    );
  };

  const renderHeader = () => {
    return <Text style={styles.headerTitlte}>{translations.filter}</Text>;
  };

  const onClear = () => {
    setParamsRequest(listCourseFilterParams);
    reset({
      types: params?.types || [],
      skills: params?.skills || [],
      price: [0, 1e9],
      levels: params?.levels || [],
      onlyEnglishNativeSpeakers: false,
    });
    resetField("skills");
  };

  console.log("renderrrr=======");

  return (
    <View style={styles.boxFilterDetail}>
      {renderHeader()}
      <TouchableOpacity style={styles.clearBtn} onPress={onClear}>
        <Text style={styles.clearTxt}>{translations.clear}</Text>
      </TouchableOpacity>
      {(isCourseType ? filterCourseKeys : filterTeacherKeys).map((item) =>
        renderItem(item),
      )}
      <PressableBtn
        onPress={closeModal}
        disabled={hasError || isLoading}
        style={[
          styles.btn,
          (hasError || isLoading) && { backgroundColor: palette.btnInactive },
        ]}
      >
        {isLoading && <ActivityIndicator color={palette.textOpacity4} />}
        <Text
          style={[styles.txtBtn, isLoading && { color: palette.textOpacity4 }]}
        >
          {isLoading && translations.search}
          {!isLoading &&
            (isCourseType
              ? translations.course.viewResult(totalCount)
              : translations.course.viewResultTutor(totalCount))}
        </Text>
      </PressableBtn>
    </View>
  );
};

export const styles = StyleSheet.create({
  wrapBtnFilter: {
    ...CS.flexStart,
    flexWrap: "wrap",
  },
  boxFilterDetail: {
    paddingTop: 16,
    paddingBottom: 32,
  },
  itemFilterLabel: {
    ...CS.hnSemiBold,
    fontSize: 18,
    color: palette.textOpacity8,
    marginBottom: 8,
  },

  headerTitlte: {
    ...CS.hnSemiBold,
    fontSize: 20,
    flex: 1,
    textAlign: "center",
    marginBottom: 14,
  },
  btn: {
    ...CS.flexCenter,
    padding: 8,
    borderRadius: 8,
    backgroundColor: palette.primary,
  },
  txtBtn: {
    ...CS.hnMedium,
    marginLeft: 2,
    color: palette.white,
  },
  clearBtn: {
    position: "absolute",
    left: 0,
    top: 20,
    zIndex: 1,
  },
  clearTxt: {
    ...CS.hnBold,
    color: palette.textOpacity6,
  },
});

export default CourseFilterModalInnter;
