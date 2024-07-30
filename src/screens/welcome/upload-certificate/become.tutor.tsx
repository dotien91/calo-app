import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React from "react";
import CS from "@theme/styles";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import { ScreenWidth } from "@freakycoder/react-native-helpers";
import { useForm } from "react-hook-form";
import useStore from "@services/zustand/store";
import { palette } from "@theme/themes";
import { translations } from "@localization";
import IconSvg from "assets/svg";
import InputHook from "@shared-components/form/InputHookForm";
import Button from "@shared-components/button/Button";
import * as NavigationService from "react-navigation-helpers";
import { updateProfile } from "@services/api/user.api";
import { showToast } from "@helpers/super.modal.helper";
import { useRoute } from "@react-navigation/native";
import { SCREENS } from "constants";

const FONTSIZE = ScreenWidth / 6 - 33;

const BecomeTutorScreen = () => {
  const userData = useStore((state) => state.userData);
  const setUserData = useStore((state) => state.setUserData);
  const route = useRoute();
  const listFile = route.params?.["listFile"];
  const currentIeltsPoint = route.params?.["currentIeltsPoint"];
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
  const onSubmit = (DataHook: {
    leave_message: string;
    fullname: string;
    phone_number: string;
    user_email: string;
  }) => {
    NavigationService.navigate(SCREENS.HOME);
    const params = {
      _id: userData?._id,
      certificate_list: JSON.stringify(listFile.map((i) => i._id)),
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
          <TouchableOpacity
            onPress={() => NavigationService.navigate(SCREENS.HOME)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-around",
              paddingHorizontal: 16,
            }}
          >
            <Icon
              type={IconType.AntDesign}
              name="arrowleft"
              size={FONTSIZE - 8}
              style={{
                color: palette.text,
              }}
            />
            <Text style={styles.textHeader}>
              {translations.uploadCertificate.titleHeader}
            </Text>
          </TouchableOpacity>
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
};
const styles = StyleSheet.create({
  textHeader: {
    fontSize: FONTSIZE - 10,
    color: palette.text,
    // alignSelf: "center",
    fontWeight: "600",
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
});
export default BecomeTutorScreen;
