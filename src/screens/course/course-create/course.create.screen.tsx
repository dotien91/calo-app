import React, { useState } from "react";
import {
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  View,
  Text,
  Image,
  Keyboard,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import * as NavigationService from "react-navigation-helpers";

import InputHook from "@shared-components/form/InputHookForm";
import CS from "@theme/styles";
import Header from "@shared-components/header/Header";
import { translations } from "@localization";
import Button from "@shared-components/button/Button";
import DatePickerLocal from "./components/dataPicker";
import useStore from "@services/zustand/store";
import { selectMedia } from "@helpers/file.helper";
import { uploadMedia } from "@services/api/post";
import { isIos } from "@helpers/device.info.helper";
import PressableBtn from "@shared-components/button/PressableBtn";
import { palette } from "@theme/themes";
import { createCourse } from "@services/api/course.api";
import { showToast } from "@helpers/super.modal.helper";
import LoadingUpdateMedia from "./components/LoadingUpdateMedia";
import CustomBackground from "@shared-components/CustomBackgroundBottomSheet";
import { SCREENS } from "constants";
import {
  listLevel,
  listSkill,
  listTypeCourse,
} from "constants/course.constant";

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
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      long_description: "",
      price: "",
      startTime: "",
    },
  });
  const theme = useTheme();
  const { colors } = theme;
  const [updating, setUpdating] = React.useState(false);
  const [updatingVid, setUpdatingVid] = React.useState(false);
  const [updatingImg, setUpdatingImg] = React.useState(false);
  const [startDate, setStartDate] = React.useState<Date>();
  const [endDate, setEndDate] = React.useState<Date>();
  const [linkImage, setLinkImage] = React.useState("");
  const [idImage, setIdImage] = React.useState("");
  const [linkVideo, setLinkVideo] = React.useState("");
  const [idVideo, setIdVideo] = React.useState("");
  const [typeCourse, setTypeCourse] = React.useState(listTypeCourse[0]);
  const [level, setLevel] = useState<ILevel>(listLevel[0]);
  const [skill, setSkill] = useState<ISkill[]>([]);

  const userData = useStore((store) => store.userData);

  const openListTypeCourse = () => {
    Keyboard.dismiss();
    setTimeout(() => {
      refBottomSheet.current?.expand();
    }, 300);
  };

  const refBottomSheet = React.useRef<BottomSheet>(null);
  const snapPoints = React.useMemo(() => ["60%"], []);

  const onSubmit = (data) => {
    if (!startDate || !endDate || idImage === "") {
      if (startDate || !endDate) {
        showToast({ type: "error", message: "Vui lòng chọn đầy đủ thời gian" });
      }
      if (idImage === "") {
        showToast({ type: "error", message: "Vui lòng chọn ảnh khoá học" });
      }
      // language: dang khong nhan vi
    } else {
      if (startDate < endDate) {
        const params = {
          title: data.title,
          description: data.description,
          long_description: data.long_description,
          price: data.price,
          start_time: startDate?.toISOString(),
          end_time: endDate?.toISOString(),
          language: "en",
          // language: userData?.default_language,
          country: userData?.country,
          avatar: idImage,
          media_id: idVideo,
          type: typeCourse.value,
          level: level.value,
          skills: skill.map((i) => i.value),
        };
        console.log(params);
        setUpdating(true);
        createCourse(params).then((res) => {
          if (!res.isError) {
            console.log("res.Success..", JSON.stringify(res));
            showToast({
              type: "success",
              message: translations.course.createCourseSuccess,
            });
            if (typeCourse.value === "Call group") {
              NavigationService.navigate(SCREENS.COURSR_LIST_CLASS, {
                course_id: res.data._id,
              });
            }
            if (typeCourse.value === "Call 1-1") {
              NavigationService.navigate(SCREENS.COURSR_CREATE_CALENDAR_CALL, {
                course_id: res.data._id,
              });
            }
            setUpdating(false);
          } else {
            showToast({
              type: "error",
              message: res.message,
            });
            setUpdating(false);
          }
        });
      } else {
        showToast({
          type: "error",
          message:
            "Thời gian bắt đầu không được lớn hơn thời gian kết thúc khoá học",
        });
      }
    }
  };
  const onPressChangeImage = async () => {
    selectMedia({
      config: { mediaType: "photo", cropping: true, width: 1600, height: 900 },
      callback: async (image) => {
        const uri = isIos() ? image.path?.replace("file://", "") : image.path;
        setUpdatingImg(true);
        setLinkImage(uri);
        const res = await uploadMedia({
          name: image?.filename || image.path?.split("/")?.reverse()?.[0] || "",
          uri: uri,
          type: image.mime,
        });
        if (res?.[0]?.callback?._id) {
          setIdImage(res[0]?.callback?._id);
          setUpdatingImg(false);
        } else {
          setUpdatingImg(false);
        }
      },
    });
  };

  const onPressChangeMedia = async () => {
    selectMedia({
      config: { mediaType: "video" },
      callback: async (image) => {
        const uri = isIos() ? image.path?.replace("file://", "") : image.path;
        setUpdatingVid(true);

        const res = await uploadMedia({
          name: image?.filename || image.path?.split("/")?.reverse()?.[0] || "",
          uri: uri,
          type: image.mime,
        });
        if (res?.[0]?.callback?._id) {
          setIdVideo(res[0]?.callback?._id);
          setLinkVideo(res?.[0]?.callback?.media_thumbnail);
          setUpdatingVid(false);
        } else {
          setUpdatingVid(false);
        }
      },
    });
  };

  const renderSelectLevel = () => {
    const renderLevelBtn = (item: ILevel) => {
      const _onSelectLevel = () => {
        setLevel(item);
      };
      const isSeleted = level?.value === item.value;
      return (
        <PressableBtn
          onPress={_onSelectLevel}
          style={[
            styles.durationBtn,
            isSeleted && { backgroundColor: palette.primary },
          ]}
        >
          <Text style={[styles.txtBtn]}>{item.value}</Text>
        </PressableBtn>
      );
    };

    return (
      <View style={styles.selectBox}>
        <Text style={styles.label}>{translations.course.filterLevel}</Text>
        <View style={CS.flexRear}>
          {listLevel.map((item) => renderLevelBtn(item))}
        </View>
      </View>
    );
  };

  const renderSelectSkill = () => {
    const renderSkillBtn = (item: ISkill) => {
      const isSelected =
        [...skill]?.findIndex((i) => i.value === item.value) >= 0;
      const _onSelectSkill = () => {
        if (isSelected) {
          setSkill((skill) => skill?.filter((i) => i.value !== item.value));
        } else {
          setSkill([...skill, item]);
        }
      };
      return (
        <PressableBtn
          onPress={_onSelectSkill}
          style={[
            styles.durationBtn,
            isSelected && { backgroundColor: palette.primary },
          ]}
        >
          <Text style={[styles.txtBtn]}>{item.value}</Text>
        </PressableBtn>
      );
    };

    return (
      <View style={styles.selectBox}>
        <Text style={styles.label}>{translations.course.skills}</Text>
        <View style={CS.flexRear}>
          {listSkill.map((item) => renderSkillBtn(item))}
        </View>
      </View>
    );
  };

  const renderSelectAvatarCourse = () => {
    return (
      <>
        <Text style={{ ...CS.hnMedium, marginTop: 8 }}>Ảnh khoá học</Text>
        <PressableBtn onPress={onPressChangeImage}>
          {linkImage === "" ? (
            <View
              style={{
                padding: 8,
                borderWidth: 1,
                borderColor: palette.borderColor,
                borderRadius: 8,
              }}
            >
              <Text style={CS.hnRegular}>Chọn ảnh</Text>
            </View>
          ) : (
            <View style={styles.viewImage}>
              <Image source={{ uri: linkImage }} style={styles.viewImage} />
              {updatingImg && <View style={styles.viewImageFill}></View>}
            </View>
          )}
        </PressableBtn>
      </>
    );
  };

  const renderSelectVideo = () => {
    return (
      <>
        <Text style={{ ...CS.hnMedium, marginTop: 8 }}>
          Video giới thiệu khoá học
        </Text>
        {linkVideo === "" && !updatingVid ? (
          <PressableBtn onPress={onPressChangeMedia}>
            <View
              style={{
                padding: 8,
                borderWidth: 1,
                borderColor: palette.borderColor,
                borderRadius: 8,
              }}
            >
              <Text style={CS.hnRegular}>Chọn video</Text>
            </View>
          </PressableBtn>
        ) : (
          <View style={styles.viewImage}>
            <Image source={{ uri: linkVideo }} style={styles.viewImage} />
            {updatingVid && (
              <View style={styles.viewImageFill}>
                <LoadingUpdateMedia />
              </View>
            )}
          </View>
        )}
      </>
    );
  };

  const renderSelectTypeCourse = () => {
    return (
      <>
        <Text style={{ ...CS.hnMedium, marginTop: 8 }}>Kiểu khoá học</Text>
        <PressableBtn onPress={openListTypeCourse}>
          <View
            style={{
              padding: 8,
              borderWidth: 1,
              borderColor: palette.borderColor,
              borderRadius: 8,
            }}
          >
            <Text style={CS.hnRegular}>{typeCourse.value}</Text>
          </View>
        </PressableBtn>
      </>
    );
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <ScrollView style={CS.safeAreaView}>
        <Header text={translations.course.createCourse} />
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
          maxLength={32}
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
          maxLength={32}
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
        />
        <InputHook
          name="price"
          customStyle={CS.flex1}
          inputProps={{
            type: "number",
            defaultValue: "",
            placeholder: translations.course.priceCourse,
            keyboardType: "numeric",
          }}
          control={control}
          rules={{
            required: {
              value: true,
              message: translations.required,
            },
          }}
          errorTxt={errors.price?.message}
          maxLength={500}
        />
        <View style={{ paddingHorizontal: 20, flexDirection: "row", gap: 8 }}>
          <DatePickerLocal
            style={{ flex: 1 }}
            placeholder={translations.course.startTime}
            setTime={(time) => {
              setStartDate(time);
            }}
          />
          <DatePickerLocal
            style={{ flex: 1 }}
            placeholder={translations.course.endTime}
            setTime={(time) => {
              setEndDate(time);
            }}
          />
        </View>

        <View style={{ paddingHorizontal: 20 }}>
          {renderSelectAvatarCourse()}
          {renderSelectVideo()}
          {renderSelectTypeCourse()}
          {renderSelectLevel()}
          {renderSelectSkill()}
        </View>
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
                {translations.postCategory}
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
                      i.index === typeCourse.index
                        ? styles.categorySelected
                        : styles.category
                    }
                    onPress={() => {
                      refBottomSheet.current?.close();
                      setTypeCourse(i);
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

        <Button
          style={{
            marginHorizontal: 16,
            marginTop: 16,
            backgroundColor: updating ? colors.placeholder : colors.primary,
          }}
          text={translations.course.createCourse}
          disabled={updating || updatingImg || updatingVid}
          onPress={handleSubmit(onSubmit)}
        />
        <View style={{ height: 80 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CourseCreate;

const styles = StyleSheet.create({
  viewImage: {
    width: 160,
    height: 90,
    backgroundColor: palette.placeholder,
  },
  viewImageFill: {
    ...CS.fillParent,
    ...CS.center,
    backgroundColor: palette.placeholder,
  },
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
    flex: 1,
    backgroundColor: palette.background,
    borderWidth: 1,
    borderColor: palette.borderColor,
    marginHorizontal: 4,
    ...CS.flexCenter,
    borderRadius: 4,
  },
  selectBox: {
    marginBottom: 16,
  },
  txtBtn: {
    ...CS.hnSemiBold,
    color: palette.textOpacity6,
  },
});
