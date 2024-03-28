import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  View,
  Text,
  Keyboard,
  SafeAreaView,
} from "react-native";
import { useTheme, useRoute } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import * as NavigationService from "react-navigation-helpers";
import Icon, { IconType } from "react-native-dynamic-vector-icons";

import InputHook from "@shared-components/form/InputHookForm";
import CS from "@theme/styles";
import Header from "@shared-components/header/Header";
import { translations } from "@localization";
import Button from "@shared-components/button/Button";
import DatePickerLocal from "./components/dataPicker";
import useStore from "@services/zustand/store";
import PressableBtn from "@shared-components/button/PressableBtn";
import { palette } from "@theme/themes";
import { createCourse, updateCourse } from "@services/api/course.api";
import {
  EnumModalContentType,
  EnumStyleModalType,
  closeSuperModal,
  showSuperModal,
  showToast,
} from "@helpers/super.modal.helper";
import CustomBackground from "@shared-components/CustomBackgroundBottomSheet";
import {
  listLevel,
  listSkill,
  listTypeCourse,
} from "constants/course.constant";
import SelectVideoHook from "./components/select.video";
import eventEmitter from "@services/event-emitter";
import { SCREENS } from "constants";
// import SelectImageHook from "./components/select.image";
import TextInputPrice from "../components/text.input.price/text.input.price";
import { EnumClassType } from "models/course.model";
import { priceIds } from "constants/iap.constant";
import DropDownItem from "@shared-components/dropdown/DropDownItem";

interface ILevel {
  value: string;
  index: string | number;
}

interface ISkill {
  value: string;
  index: string | number;
}

const CourseCreate = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      long_description: "",
      price: "",
      startTime: "",
    },
  });
  const route = useRoute();
  const data = route.params?.["data"];
  const course_id = route.params?.["course_id"];
  const theme = useTheme();
  const { colors } = theme;
  const [updating, setUpdating] = React.useState(false);
  const [startDate, setStartDate] = React.useState<Date>();
  const [endDate, setEndDate] = React.useState<Date>();
  const [typeCourse, setTypeCourse] = React.useState(listTypeCourse[0].value);
  const [level, setLevel] = useState<string>(listLevel[0].value);
  const [skill, setSkill] = useState<string[]>([]);
  const [priceInput, setPriceInput] = useState("");
  const { idVideo, renderSelectVideo, updatingVid, typeMedia } =
    SelectVideoHook({
      id: data?.media_id?._id || data?.avatar?._id,
      link: data?.media_id?.media_thumbnail || data?.avatar?.media_thumbnail,
      typeM: data?.media_id ? "video" : "image",
    });
  // const { idImage, renderSelectImage, updatingImg } = SelectImageHook({
  //   width: 1600,
  //   height: 900,
  // });

  useEffect(() => {
    if (data) {
      setValue("title", data.title);
      setValue("description", data.description);
      setValue("long_description", data.long_description);
      setValue("price", data.price.toString());
      setStartDate(new Date(data.start_time));
      setEndDate(data?.end_time ? new Date(data.end_time) : "");
      setTypeCourse(data.type);
      // setLevel(data?.level || "");
      setSkill(data.skills);
      setPriceInput(data.price.toString());
    }
  }, [data]);

  const userData = useStore((store) => store.userData);

  const openListTypeCourse = () => {
    Keyboard.dismiss();
    setTimeout(() => {
      refBottomSheet.current?.expand();
    }, 300);
  };

  const refBottomSheet = React.useRef<BottomSheet>(null);
  const snapPoints = React.useMemo(() => [300], []);

  const onSubmit = (dataHook: {
    title: string;
    description: string;
    long_description: string;
    price: string | number;
  }) => {
    if (!startDate || !endDate || idVideo === "") {
      if (startDate || !endDate) {
        showToast({
          type: "error",
          message: translations.course.warningSelectTime,
        });
      }
      if (idVideo === "") {
        showToast({
          type: "error",
          message: translations.course.warningUploadCoverImageOrVideo,
        });
      }
    } else {
      if (startDate < endDate) {
        const params = {
          title: dataHook.title,
          description: dataHook.description,
          long_description: dataHook.long_description,
          // price: dataHook.price,
          price: priceInput + "",
          start_time: startDate?.toISOString(),
          end_time: endDate?.toISOString(),
          language: "en",
          // language: userData?.default_language,
          country: userData?.country,
          // avatar: idImage,
          // media_id: idVideo,
          public_status: data?.public_status || "draft",
          type: typeCourse,
          level: level,
          skills: skill,
        };
        // console.log(params);
        if (typeMedia.startsWith("video")) {
          params.media_id = idVideo;
        }
        if (typeMedia.startsWith("image")) {
          params.avatar = idVideo;
        }
        if (course_id) {
          params._id = course_id;
        }
        setUpdating(true);
        showSuperModal({
          styleModalType: EnumStyleModalType.Middle,
          contentModalType: EnumModalContentType.Loading,
        });
        if (
          typeCourse == EnumClassType.SelfLearning ||
          typeCourse == EnumClassType.CallGroup
        ) {
          params["price_id"] = priceIds.find(
            (item) => item.value == priceInput,
          )?.id;
        }
        if (course_id) {
          updateCourse(params).then((res) => {
            if (!res.isError) {
              showToast({
                type: "success",
                message: translations.course.updateModuleSuccess,
              });
              eventEmitter.emit("reload_list_course");
              closeSuperModal();
              eventEmitter.emit("reload_data_preview");
              NavigationService.navigate(SCREENS.COURSE_DETAIL, {
                course_id: course_id,
                fromScreen: "createCourse",
              });
              setUpdating(false);
            } else {
              showToast({
                type: "error",
                message: res.message,
              });
              closeSuperModal();
              setUpdating(false);
            }
          });
        } else {
          createCourse(params).then((res) => {
            if (!res.isError) {
              showToast({
                type: "success",
                message: translations.course.createCourseSuccess,
              });
              eventEmitter.emit("reload_list_course");
              NavigationService.navigate(SCREENS.COURSE_DETAIL, {
                course_id: res?.data?._id,
                fromScreen: "createCourse",
              });
              setUpdating(false);
              closeSuperModal();
            } else {
              showToast({
                type: "error",
                message: res.message,
              });
              setUpdating(false);
              closeSuperModal();
            }
          });
        }
      } else {
        showToast({
          type: "error",
          message: translations.course.warningSelectTimeGreater,
        });
      }
    }
  };

  const renderSelectLevel = () => {
    const renderLevelBtn = (item: ILevel) => {
      const _onSelectLevel = () => {
        setLevel(item.value);
      };
      const isSelected = level === item.value;
      return (
        <PressableBtn
          onPress={_onSelectLevel}
          style={[
            styles.durationBtn,
            isSelected && { backgroundColor: palette.primary },
          ]}
        >
          <Text style={[styles.txtBtn, isSelected && { color: palette.white }]}>
            {item.value}
          </Text>
        </PressableBtn>
      );
    };

    return (
      <View style={styles.selectBox}>
        <Text style={styles.label}>{translations.course.filterLevel}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={[CS.flexRear, { gap: 8 }]}>
            {listLevel.map((item) => renderLevelBtn(item))}
          </View>
        </ScrollView>
      </View>
    );
  };

  const renderSelectSkill = () => {
    const renderSkillBtn = (item: ISkill) => {
      const isSelected = [...skill]?.findIndex((i) => i === item.value) >= 0;
      const _onSelectSkill = () => {
        if (isSelected) {
          setSkill((skill) => skill?.filter((i) => i !== item.value));
        } else {
          setSkill([...skill, item.value]);
        }
      };
      return (
        <PressableBtn
          key={item._id}
          onPress={_onSelectSkill}
          style={[
            styles.durationBtn,
            isSelected && { backgroundColor: palette.primary },
          ]}
        >
          <Text style={[styles.txtBtn, isSelected && { color: palette.white }]}>
            {item.value}
          </Text>
        </PressableBtn>
      );
    };

    return (
      <View style={styles.selectBox}>
        <Text style={styles.label}>{translations.course.skills}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={[CS.flexRear, { gap: 8 }]}>
            {listSkill.map((item) => renderSkillBtn(item))}
          </View>
        </ScrollView>
      </View>
    );
  };

  const renderSelectTypeCourse = () => {
    return (
      <>
        <Text style={{ ...CS.hnMedium, marginVertical: 8 }}>
          {translations.course.typeCourse}
        </Text>
        <PressableBtn onPress={openListTypeCourse}>
          <View
            style={{
              padding: 8,
              borderWidth: 1,
              borderColor: palette.borderColor,
              borderRadius: 8,
              ...CS.row,
            }}
          >
            <Text style={[CS.hnRegular, { flex: 1 }]}>{typeCourse}</Text>
            <Icon size={24} name={"chevron-down"} type={IconType.Ionicons} />
          </View>
        </PressableBtn>
      </>
    );
  };

  const renderPrice = () => {
    if (
      typeCourse == EnumClassType.SelfLearning ||
      typeCourse == EnumClassType.CallGroup
    ) {
      return (
        <View style={{ zIndex: 2, marginVertical: 8 }}>
          <Text
            style={{
              ...CS.hnMedium,
              color: colors.text,
              marginLeft: 20,
              marginVertical: 8,
            }}
          >
            {translations.payment.coursePrice}
          </Text>

          <DropDownItem
            value={priceInput}
            setValue={setPriceInput}
            items={priceIds}
            placeholder={translations.payment.coursePrice}
          />
        </View>
      );
    }
    return (
      <>
        <Text
          style={{
            ...CS.hnMedium,
            color: colors.text,
            marginLeft: 20,
            marginVertical: 8,
          }}
        >
          {translations.payment.coursePrice}
        </Text>

        <TextInputPrice
          setPriceInput={setPriceInput}
          priceInput={priceInput}
        ></TextInputPrice>
      </>
    );
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <SafeAreaView style={CS.safeAreaView}>
        <Header
          text={
            course_id
              ? translations.course.updateCourse
              : translations.course.createCourse
          }
        />
        <ScrollView showsVerticalScrollIndicator={false} style={CS.flex1}>
          {renderSelectVideo()}

          <InputHook
            name="title"
            customStyle={CS.flex1}
            inputProps={{
              type: "text",
              defaultValue: "",
              placeholder: translations.course.title,
            }}
            control={control}
            rules={{
              required: {
                value: true,
                message: translations.required,
              },
            }}
            errorTxt={errors.title?.message}
            maxLength={100}
            showPlaceholder
          />
          <InputHook
            name="description"
            customStyle={CS.flex1}
            inputProps={{
              type: "text",
              defaultValue: "",
              placeholder: translations.course.description,
            }}
            control={control}
            rules={{
              required: {
                value: true,
                message: translations.required,
              },
            }}
            errorTxt={errors.description?.message}
            maxLength={500}
            multiline
            showPlaceholder
          />
          <InputHook
            name="long_description"
            customStyle={CS.flex1}
            inputProps={{
              type: "text",
              defaultValue: "",
              placeholder: translations.course.longDescription,
            }}
            control={control}
            rules={{
              required: {
                value: true,
                message: translations.required,
              },
            }}
            multiline
            errorTxt={errors.long_description?.message}
            maxLength={500}
            showPlaceholder
          />
          {renderPrice()}

          <Text style={styles.textTitle}>
            {translations.course.timeAvailable}
          </Text>

          <View style={{ paddingHorizontal: 20, flexDirection: "row", gap: 8 }}>
            <DatePickerLocal
              style={{ flex: 1 }}
              placeholder={translations.course.startTime}
              setTime={(time) => {
                setStartDate(time);
              }}
              timeDefault={startDate}
            />
            <DatePickerLocal
              style={{ flex: 1 }}
              placeholder={translations.course.endTime}
              setTime={(time) => {
                setEndDate(time);
              }}
              timeDefault={endDate}
            />
          </View>

          <View style={{ paddingHorizontal: 20 }}>
            {renderSelectTypeCourse()}
            {renderSelectLevel()}
            {renderSelectSkill()}
          </View>
          <View style={styles.paddingButton}>
            <Button
              style={{
                backgroundColor: updating ? colors.placeholder : colors.primary,
                zIndex: -1,
              }}
              text={
                course_id
                  ? translations.course.updateCourse
                  : translations.course.createCourse
              }
              disabled={updating || updatingVid}
              onPress={handleSubmit(onSubmit)}
            />
          </View>
          <View style={{ height: 80 }} />
        </ScrollView>
        {listTypeCourse.length > 0 && (
          <BottomSheet
            snapPoints={snapPoints}
            index={-1}
            enablePanDownToClose
            ref={refBottomSheet}
            style={{
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              backgroundColor: colors.background,
            }}
            backdropComponent={(props) => (
              <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
                pressBehavior={"close"}
                opacity={0.1}
              />
            )}
            backgroundComponent={CustomBackground}
          >
            <View style={[{ paddingHorizontal: 16, ...CS.flex1 }]}>
              <Text
                style={{
                  ...CS.hnSemiBold,
                  textAlign: "center",
                  fontSize: 20,
                  color: colors.primary,
                }}
              >
                {translations.course.typeCourse}
              </Text>
              <BottomSheetScrollView
                style={{
                  ...CS.flex1,
                  backgroundColor: colors.background,
                }}
              >
                {listTypeCourse.map((i) => (
                  <PressableBtn
                    key={i.index}
                    style={
                      i.value === typeCourse
                        ? styles.categorySelected
                        : styles.category
                    }
                    onPress={() => {
                      refBottomSheet.current?.close();
                      setTypeCourse(i.value);
                      setPriceInput("");
                    }}
                  >
                    <Text
                      style={{
                        ...CS.hnSemiBold,
                        fontSize: 16,
                        color: colors.primary,
                      }}
                    >{`${i.value}`}</Text>
                  </PressableBtn>
                ))}
              </BottomSheetScrollView>
            </View>
          </BottomSheet>
        )}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default CourseCreate;

const styles = StyleSheet.create({
  category: {
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: palette.background,
  },
  categorySelected: {
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: palette.highlight,
  },
  label: {
    ...CS.hnMedium,
    color: palette.text,
    marginBottom: 8,
  },
  durationBtn: {
    padding: 4,
    minWidth: 60,
    paddingHorizontal: 8,
    flex: 1,
    backgroundColor: palette.background,
    borderWidth: 1,
    borderColor: palette.borderColor,
    // marginHorizontal: 4,
    ...CS.flexCenter,
    borderRadius: 4,
  },
  selectBox: {
    marginTop: 8,
  },
  txtBtn: {
    ...CS.hnSemiBold,
    color: palette.textOpacity6,
  },
  textTitle: {
    ...CS.hnMedium,
    marginHorizontal: 20,
  },
  paddingButton: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
});
