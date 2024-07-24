import {
  View,
  Text,
  StyleSheet,
  Keyboard,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { palette } from "@theme/themes";
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import { useUploadFile } from "@helpers/hooks/useUploadFile";
import CS from "@theme/styles";
import IconSvg from "assets/svg";
import * as NavigationService from "react-navigation-helpers";
// import PressableBtn from "@shared-components/button/PressableBtn";
import { ScreenWidth } from "@freakycoder/react-native-helpers";
// import DropDownItem from '@shared-components/dropdown/DropDownItem';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import CustomBackground from "@shared-components/CustomBackgroundBottomSheet";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import {
  chooseOptions,
  ieltsPointList,
} from "constants/upload.certificate.constant";
import useStore from "@services/zustand/store";
import { translations } from "@localization";
import { useForm } from "react-hook-form";
import InputHook from "@shared-components/form/InputHookForm";
import Button from "@shared-components/button/Button";
// import { getStatusBarHeight } from "react-native-safearea-height";
import { updateProfile } from "@services/api/user.api";
import { showToast } from "@helpers/super.modal.helper";
import { _setJson } from "@services/local-storage";

interface props {
  id: string;
  name: string;
}
const FONTSIZE = ScreenWidth / 7 - 30;

const UploadCertificate = () => {
  const [index, setIndex] = React.useState<props>();
  const [itemSelected, setItemSelected] = React.useState<props>();
  const [ieltsPoint, setIeltsPoint] = React.useState("0.0");
  const [currentIeltsPoint, setCurrentIeltsPoint] = React.useState("0.0");

  // const [typeCoaching, setTypeCoaching] = React.useState(typeCoachingList[0].value);
  const userData = useStore((state) => state.userData);
  const setUserData = useStore((state) => state.setUserData);
  const { listFile, listFileLocal, onSelectPicture, renderFile2 } =
    useUploadFile([]);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      leave_message: userData?.leave_message || "",
      fullname: userData?.fullname || userData?.display_name || "",
      phone_number: userData?.user_phone || "",
      user_email: userData?.user_email || "",
    },
  });

  React.useEffect(() => {
    if (index?.id === "enterIELTS") {
      NavigationService.goBack();
      const params = {
        _id: userData?._id,
        target_point: ieltsPoint !== "0.0" ? ieltsPoint : "",
      };
      updateProfile(params).then((res) => {
        if (!res.isError) {
          showToast({
            type: "success",
            message: translations.course.updateModuleSuccess,
          });
          setUserData({
            ...userData,
            target_point: ieltsPoint !== "0.0" ? ieltsPoint : "",
          });
        }
      });
    }

    if (index?.id === "upgrade") {
      NavigationService.goBack();
      const params = {
        _id: userData?._id,
        certificate_list: JSON.stringify(listFile.map((i) => i._id)),
        target_point: ieltsPoint !== "0.0" ? ieltsPoint : "",
        current_point: currentIeltsPoint !== "0.0" ? currentIeltsPoint : "",
      };
      console.log("params=====", params);
      updateProfile(params).then((res) => {
        if (!res.isError) {
          showToast({
            type: "success",
            message: translations.course.updateModuleSuccess,
          });
        }
        setUserData({
          ...userData,
          target_point: ieltsPoint !== "0.0" ? ieltsPoint : "",
          current_point: currentIeltsPoint !== "0.0" ? currentIeltsPoint : "",
        });
      });
    }
  }, [index]);

  const renderBtn = (_onPress) => {
    if (itemSelected?.id === "uploadCertificate" && listFile.length == 0) {
      _onPress = () =>
        showToast({
          type: "error",
          message: translations.uploadCertificate.errorMessage,
        });
    }

    return (
      <View style={styles.btnContainer}>
        <TouchableOpacity onPress={_onPress} style={styles.pressableBtn}>
          <Text
            style={{ ...CS.hnSemiBold, fontSize: 16, color: palette.white }}
          >
            {translations.uploadCertificate.next}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const openListIeltsPoint = () => {
    Keyboard.dismiss();
    setTimeout(() => {
      refBottomSheet.current?.expand();
    }, 300);
  };

  const refBottomSheet = React.useRef<BottomSheet>(null);
  const snapPoints = React.useMemo(() => [300], []);
  const renderBottomSheet = () => {
    return (
      <>
        {ieltsPointList.length > 0 && (
          <BottomSheet
            snapPoints={snapPoints}
            index={-1}
            enablePanDownToClose
            ref={refBottomSheet}
            style={{
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              backgroundColor: palette.background,
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
                  color: palette.primary,
                }}
              >
                {translations.uploadCertificate.select}
              </Text>
              <BottomSheetScrollView
                style={{
                  ...CS.flex1,
                  backgroundColor: palette.background,
                }}
              >
                {ieltsPointList.map((i) => (
                  <TouchableOpacity
                    key={i.index}
                    style={
                      i.value === ieltsPoint
                        ? styles.categorySelected
                        : styles.category
                    }
                    onPress={() => {
                      refBottomSheet.current?.close();
                      itemSelected?.id === "uploadCertificate"
                        ? setCurrentIeltsPoint(i.value)
                        : setIeltsPoint(i.value);
                      //   setPriceInput("");
                    }}
                  >
                    <Text
                      style={{
                        ...CS.hnSemiBold,
                        fontSize: 16,
                        color: palette.primary,
                      }}
                    >{`${i.value}`}</Text>
                  </TouchableOpacity>
                ))}
              </BottomSheetScrollView>
            </View>
          </BottomSheet>
        )}
      </>
    );
  };
  const renderDropDownItem = () => {
    return (
      <View style={{ paddingBottom: 16, paddingHorizontal: 5 }}>
        <Text style={[styles.uploadText, { paddingVertical: 5 }]}>
          {itemSelected?.id !== "uploadCertificate"
            ? translations.uploadCertificate.selectTargetPoint
            : translations.uploadCertificate.selectIeltsPoint}
        </Text>
        <TouchableOpacity onPress={openListIeltsPoint}>
          <View
            style={{
              padding: 8,
              borderWidth: 1,
              borderColor: palette.borderColor,
              borderRadius: 8,
              ...CS.row,
              justifyContent: "space-between",
            }}
          >
            <Text style={CS.hnRegular}>
              {itemSelected?.id === "uploadCertificate"
                ? currentIeltsPoint
                : ieltsPoint}
            </Text>
            <Icon size={24} name={"chevron-down"} type={IconType.Ionicons} />
          </View>
        </TouchableOpacity>
      </View>
    );
  };
  const SelectBox = ({ options }) => {
    return (
      <View>
        {options.map((item, _index) => {
          const isActive = itemSelected?.id === item?.id;
          return (
            <View
              key={_index}
              style={isActive ? styles.activeItem : styles.inactiveItem}
            >
              <TouchableWithoutFeedback onPress={() => setItemSelected(item)}>
                <Text style={styles.itemText}>{item.name}</Text>
                {itemSelected?.id === "uploadCertificate" && isActive ? (
                  <>
                    <View style={styles.uploadContainer}>
                      <Text style={styles.uploadText}>
                        {translations.uploadCertificate.uploadCertificate}
                      </Text>
                      {listFileLocal.length > 0 ? (
                        <View style={{ flexDirection: "row" }}>
                          {renderFile2()}
                          <TouchableOpacity
                            style={styles.uploadBtn}
                            onPress={onSelectPicture}
                          >
                            <IconSvg
                              name="icAdd"
                              size={FONTSIZE + 6}
                              color={palette.textOpacity8}
                            />
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <View style={styles.uploadIconContainer}>
                          <TouchableOpacity
                            onPress={onSelectPicture}
                            style={styles.uploadIcon}
                          >
                            <IconSvg
                              name="icImage"
                              size={50}
                              color={palette.textOpacity6}
                            />
                          </TouchableOpacity>
                          <Text style={styles.uploadIconText}>
                            {translations.uploadCertificate.tapToUpload}
                          </Text>
                        </View>
                      )}
                    </View>
                    {renderDropDownItem()}
                  </>
                ) : null}
                {(itemSelected?.id === "upgrade" ||
                  itemSelected?.id === "enterIELTS") &&
                isActive ? (
                  <>{renderDropDownItem()}</>
                ) : null}
              </TouchableWithoutFeedback>
            </View>
          );
        })}
      </View>
    );
  };

  const renderSelectBox = (item) => {
    return (
      <View style={styles.selectBoxContainer}>
        <Text style={styles.selectBoxTitle}>{item.title}</Text>
        <Text style={styles.selectBoxSubtitle}>
          {translations.uploadCertificate.subTitle}
        </Text>
        <SelectBox options={item.options} />
      </View>
    );
  };

  if (index?.id === "uploadCertificate") {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            alignItems: "flex-end",
            paddingHorizontal: 24,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              _setJson("is_still_login", false);
              NavigationService.goBack();
            }}
          >
            <Text
              style={{ ...CS.hnSemiBold, fontSize: 16, color: palette.text }}
            >
              {translations.uploadCertificate.skip}
            </Text>
            <View style={{ backgroundColor: palette.black, height: 2 }} />
          </TouchableOpacity>
        </View>
        {renderSelectBox(chooseOptions[1])}
        {renderBtn(() => setIndex(itemSelected))}
        {renderBottomSheet(ieltsPointList)}
      </SafeAreaView>
    );
  }

  if (index?.id === "master") {
    const onSubmit = (DataHook: {
      leave_message: string;
      fullname: string;
      phone_number: string;
      user_email: string;
    }) => {
      NavigationService.goBack();
      const params = {
        _id: userData?._id,
        certificate_list: JSON.stringify(listFile.map((i) => i._id)),
        // target_point: ieltsPoint,
        current_point: currentIeltsPoint,
        user_email: DataHook.user_email,
        fullname: DataHook?.fullname,
        phone_number: DataHook.phone_number,
        leave_message: DataHook?.leave_message,
      };
      updateProfile(params).then((res) => {
        if (!res.isError) {
          showToast({
            type: "success",
            message: translations.course.updateModuleSuccess,
          });
          setUserData({
            ...userData,
            // target_point: ieltsPoint,
            current_point: currentIeltsPoint,
            user_email: DataHook.user_email,
            fullname: DataHook?.fullname,
            phone_number: DataHook.phone_number,
            leave_message: DataHook?.leave_message,
          });
        }
      });
    };
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "height" : undefined}
        style={CS.flex1}
      >
        <SafeAreaView style={CS.flex1}>
          <ScrollView style={[CS.flex1]} showsVerticalScrollIndicator={false}>
            <Text style={styles.textHeader}>
              {translations.uploadCertificate.titleHeader}
            </Text>
            <View
              style={{
                marginTop: ScreenWidth / 6,
                alignSelf: "center",
                paddingHorizontal: 24,
              }}
            >
              <Text
                style={{
                  fontSize: 26,
                  fontWeight: "700",
                  color: palette.text,
                  paddingVertical: 10,
                }}
              >
                {translations.uploadCertificate.titleHeaderMentor}
              </Text>
              <Text
                style={{
                  color: palette.text,
                  paddingVertical: 16,
                }}
              >
                {translations.uploadCertificate.subTitleHeaderMentor}
              </Text>
              <View
                style={{
                  position: "absolute",
                  zIndex: -1,
                  marginTop: 10,
                  marginHorizontal: 24,
                }}
              >
                <IconSvg size={30} name="icBuble" />
                <View
                  style={{
                    position: "absolute",
                    marginLeft: 8,
                    marginTop: 10,
                    zIndex: -1,
                    marginHorizontal: 24,
                  }}
                >
                  <IconSvg size={60} name="icBuble" />
                </View>
              </View>
            </View>
            <View>
              <InputHook
                viewStyle={{ marginVertical: 6, borderRadius: 0 }}
                name="fullname"
                customStyle={{ flex: 1 }}
                inputProps={{
                  type: "text",
                  defaultValue: "",
                  placeholder: translations.fullname,
                }}
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: translations.required,
                  },
                }}
                errorTxt={errors.fullname?.message}
              />
              <InputHook
                viewStyle={{ marginVertical: 6, borderRadius: 0 }}
                name="user_email"
                customStyle={{ flex: 1 }}
                inputProps={{
                  type: "email",
                  defaultValue: "",
                  placeholder: translations.placeholderEmail,
                }}
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: translations.required,
                  },
                }}
                errorTxt={errors.user_email?.message}
              />
              <InputHook
                viewStyle={{ marginVertical: 6, borderRadius: 0 }}
                name="phone_number"
                customStyle={{ flex: 1 }}
                inputProps={{
                  type: "number",
                  defaultValue: "",
                  placeholder: translations.club.phoneNumber,
                  keyboardType: "numeric",
                }}
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: translations.required,
                  },
                }}
                errorTxt={errors.phone_number?.message}
              />
              <InputHook
                viewStyle={{ marginVertical: 6, borderRadius: 0 }}
                name="leave_message"
                customStyle={CS.flex1}
                inputProps={{
                  type: "text",
                  defaultValue: "",
                  placeholder: translations.uploadCertificate.leaveMessage,
                }}
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: translations.required,
                  },
                }}
                multiline
                errorTxt={errors.leave_message?.message}
                required
              />
            </View>
            {/* <View style={{paddingHorizontal: 20, marginTop: 10}}>
              <DropDownItem 
                customStyle={{borderRadius: 0}}
                value={typeCoaching}
                setValue={setTypeCoaching}
                items={typeCoachingList}
                placeholder={translations.uploadCertificate.selectCategory}
              />
            </View> */}
            <Button
              style={{
                width: ScreenWidth * 0.9,
                borderRadius: 0,
                alignSelf: "center",
                marginTop: ScreenWidth / 6,
              }}
              text={translations.uploadCertificate.registerNow}
              onPress={handleSubmit(onSubmit)}
            />
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    );
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          alignItems: "flex-end",
          paddingHorizontal: 24,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            _setJson("is_still_login", false);
            NavigationService.goBack();
          }}
        >
          <Text style={{ ...CS.hnSemiBold, fontSize: 16, color: palette.blue }}>
            {translations.uploadCertificate.skip}
          </Text>
          <View style={{ backgroundColor: palette.blue, height: 2 }} />
        </TouchableOpacity>
      </View>
      {renderSelectBox(chooseOptions[0])}
      {renderBtn(() => setIndex(itemSelected))}
      {renderBottomSheet(ieltsPointList)}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  btnContainer: {
    // flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    // right: 10,
    alignItems: "center",
    // padding: 24,
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  pressableBtn: {
    backgroundColor: palette.btnRedPrimary,
    alignItems: "center",
    justifyContent: "center",
    // paddingHorizontal: 24,
    // paddingVertical: 12,
    borderRadius: 10,
    height: 50,
    width: 120,
  },
  activeItem: {
    paddingHorizontal: 16,
    borderBottomWidth: 2,
    borderWidth: 1,
    borderRadius: 10,
    marginVertical: 16,
    borderColor: palette.primary,
  },
  inactiveItem: {
    paddingHorizontal: 16,
    borderWidth: 0.8,
    borderRadius: 10,
    marginVertical: 16,
    borderColor: palette.text,
  },
  itemText: {
    paddingVertical: 16,
    color: palette.text,
    fontSize: FONTSIZE - 8,
    fontWeight: "500",
  },
  uploadContainer: {
    paddingHorizontal: 5,
  },
  uploadText: {
    fontSize: FONTSIZE - 10,
    color: palette.text,
    paddingVertical: 10,
  },
  uploadBtn: {
    ...CS.center,
    width: (ScreenWidth - 30 - 30) / 5,
    height: (ScreenWidth - 30 - 30) / 5,
    backgroundColor: palette.grey,
    borderRadius: 8,
    marginLeft: 8,
  },
  uploadIconContainer: {
    width: ScreenWidth * 0.75,
    // flexWrap: "wrap",
    flexDirection: "row",
    alignItems: "center",
  },
  uploadIcon: {
    ...CS.center,
    height: 50,
    width: 50,
    borderWidth: 1,
    marginVertical: 5,
    borderRadius: 5,
  },
  uploadIconText: {
    paddingHorizontal: 16,
    fontStyle: "italic",
  },
  // dropDownContainer: {
  //   // flex: 1,
  //   paddingVertical: 10,
  //   zIndex: 2,
  // },
  // dropDownLabel: {
  //   fontSize: FONTSIZE - 10,
  //   color: palette.text,
  //   marginVertical: 5,
  // },
  selectBoxContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  selectBoxTitle: {
    fontSize: FONTSIZE,
    fontWeight: "600",
    color: palette.text,
  },
  selectBoxSubtitle: {
    fontSize: FONTSIZE - 8,
    color: palette.text,
    marginTop: 10,
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
  textHeader: {
    fontSize: FONTSIZE - 6,
    color: palette.text,
    alignSelf: "center",
    fontWeight: "600",
    paddingVertical: 10,
  },
});

export default UploadCertificate;
