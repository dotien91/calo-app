import { View, Text, StyleSheet, Keyboard, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { palette } from "@theme/themes";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useUploadFile } from "@helpers/hooks/useUploadFile";
import CS from "@theme/styles";
import IconSvg from "assets/svg";
import * as NavigationService from "react-navigation-helpers";
import { ScreenHeight, ScreenWidth } from "@freakycoder/react-native-helpers";
// import DropDownItem from '@shared-components/dropdown/DropDownItem';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import CustomBackground from "@shared-components/CustomBackgroundBottomSheet";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import {
  chooseOptions,
  EnumScreenType,
  ieltsPointList,
} from "constants/upload.certificate.constant";
import useStore from "@services/zustand/store";
import { translations } from "@localization";
import { updateProfile } from "@services/api/user.api";
import { showToast } from "@helpers/super.modal.helper";
import { _setJson } from "@services/local-storage";
import { SCREENS } from "constants";

interface props {
  id: string;
  name: string;
}
const FONTSIZE = ScreenWidth / 6 - 33;

const UploadCertificate = () => {
  const [index, setIndex] = React.useState<props>();
  const [itemSelected, setItemSelected] = React.useState<props>();
  const [ieltsPoint, setIeltsPoint] = React.useState("0.0");
  const [currentIeltsPoint, setCurrentIeltsPoint] = React.useState("0.0");
  const prevScreen = React.useRef<string>();

  const userData = useStore((state) => state.userData);
  const setUserData = useStore((state) => state.setUserData);
  const {
    listFile,
    listFileLocal,
    onSelectPicture,
    renderFile2,
    setListFileLocal,
  } = useUploadFile([]);

  React.useEffect(() => {
    if (index?.id === EnumScreenType.enterIELTS) {
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

    if (index?.id === EnumScreenType.upgrade) {
      NavigationService.goBack();
      const params = {
        _id: userData?._id,
        certificate_list: JSON.stringify(listFile.map((i) => i._id)),
        target_point: ieltsPoint !== "0.0" ? ieltsPoint : "",
        current_point: currentIeltsPoint !== "0.0" ? currentIeltsPoint : "",
      };
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

  React.useEffect(() => {
    if (index?.id != undefined) {
      prevScreen.current = index?.id;
    }
  }, [index]);
  const subArray = React.useMemo(() => {
    const _index = ieltsPointList.findIndex(
      (item) => item.value === currentIeltsPoint,
    );
    return ieltsPointList.slice(_index + 1);
  }, [index]);

  const renderBtn = (_onPress) => {
    if (
      itemSelected?.id !== EnumScreenType.enterIELTS &&
      listFileLocal.length == 0
    ) {
      _onPress = () =>
        showToast({
          type: "error",
          message: translations.uploadCertificate.errorMessage,
        });
    }
    const gotoPrevScreen = () => {
      setListFileLocal([]);
      setIndex(prevScreen.current);
    };
    return (
      <View style={styles.btnContainer}>
        <TouchableOpacity
          onPress={() => {
            _setJson("is_still_login", false);
            NavigationService.goBack();
          }}
          style={styles.pressableBtn}
        >
          <Text
            style={{
              ...CS.hnSemiBold,
              fontSize: FONTSIZE - 16,
              color: palette.text,
            }}
          >
            {translations.uploadCertificate.skip}
          </Text>
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
          }}
        >
          <TouchableOpacity onPress={gotoPrevScreen}>
            <Icon
              type={IconType.AntDesign}
              name="leftcircle"
              size={FONTSIZE + 10}
              color={palette.primary}
              style={{
                paddingHorizontal: 16,
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={_onPress}>
            <Icon
              type={IconType.AntDesign}
              name="rightcircle"
              size={FONTSIZE + 10}
              color={palette.primary}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const openListIeltsPoint = () => {
    Keyboard.dismiss();
    setTimeout(() => {
      refBottomSheet.current?.expand();
    }, 300);
  };

  const renderSelectCertificate = () => {
    return (
      <>
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
          <TouchableOpacity
            onPress={onSelectPicture}
            style={styles.uploadIconContainer}
          >
            <Text style={styles.uploadIconText}>
              {translations.uploadCertificate.tapToUpload}
            </Text>
            <View style={styles.uploadIcon}>
              <IconSvg
                name="icImage"
                size={FONTSIZE + 5}
                color={palette.textOpacity6}
              />
            </View>
          </TouchableOpacity>
        )}
      </>
    );
  };
  const refBottomSheet = React.useRef<BottomSheet>(null);
  const snapPoints = React.useMemo(() => [ScreenHeight * 0.8], []);

  const renderBottomSheet = (ieltsPointList) => {
    if (itemSelected?.id === EnumScreenType.master) return null;
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
              <BottomSheetScrollView
                style={{
                  ...CS.flex1,
                  backgroundColor: palette.background,
                }}
              >
                {itemSelected?.id === EnumScreenType.uploadCertificate ? (
                  <View style={styles.uploadContainer}>
                    <Text style={styles.uploadText}>
                      {translations.uploadCertificate.uploadCertificate}
                    </Text>
                    {renderSelectCertificate()}
                  </View>
                ) : null}
                <Text style={styles.uploadText}>
                  {itemSelected?.id === EnumScreenType.uploadCertificate
                    ? translations.uploadCertificate.selectIeltsPoint
                    : translations.uploadCertificate.selectTargetPoint}
                </Text>
                {ieltsPointList.map((i) => (
                  <TouchableOpacity
                    key={i.index}
                    style={
                      i.value === ieltsPoint || i.value === currentIeltsPoint
                        ? styles.categorySelected
                        : styles.category
                    }
                    onPress={() => {
                      refBottomSheet.current?.close();
                      itemSelected?.id === EnumScreenType.uploadCertificate
                        ? setCurrentIeltsPoint(i.value)
                        : setIeltsPoint(i.value);
                    }}
                  >
                    <Text
                      style={
                        i.value === ieltsPoint || i.value === currentIeltsPoint
                          ? {
                              fontSize: 16,
                              color: palette.primary,
                            }
                          : {
                              fontSize: 16,
                              color: palette.text,
                            }
                      }
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
  const renderDropDownItem = (item, isActive) => {
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            openListIeltsPoint();
            setItemSelected(item);
          }}
          style={isActive ? styles.activeItem : styles.inactiveItem}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              padding: 8,
            }}
          >
            <IconSvg name={item.svgName} size={ScreenWidth / 4} />
            <View
              style={{
                flexDirection: "row",
                // marginTop: 10,
                paddingHorizontal: 16,
              }}
            >
              <Text style={styles.itemText}>{item.name}</Text>
              {isActive ? (
                <View>
                  <Icon
                    name="checkcircle"
                    size={25}
                    type={IconType.AntDesign}
                    style={{
                      borderRadius: 30,
                    }}
                    color={palette.primary}
                  />
                </View>
              ) : (
                <View
                  style={{
                    height: 25,
                    width: 25,
                    borderRadius: 30,
                    borderWidth: 1,
                  }}
                ></View>
              )}
            </View>
          </View>
          {/* <View
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
          </View> */}
        </TouchableOpacity>
      </View>
    );
  };
  const SelectBox = ({ options }) => {
    return (
      <View
        style={{
          marginTop: 16,
        }}
      >
        {options.map((item, _index) => {
          const isActive = itemSelected?.id === item?.id;
          return (
            <View style={{}} key={_index}>
              <View>{renderDropDownItem(item, isActive)}</View>
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

  if (index?.id === EnumScreenType.uploadCertificate) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        {renderSelectBox(chooseOptions[1])}
        {renderBtn(() => setIndex(itemSelected))}
        {renderBottomSheet(subArray)}
      </SafeAreaView>
    );
  }

  if (index?.id === EnumScreenType.master) {
    NavigationService.navigate(SCREENS.BECOME_TUTOR, {
      listFile: listFile,
      currentIeltsPoint: currentIeltsPoint,
    });
    return;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {renderSelectBox(chooseOptions[0])}
      {renderBtn(() => setIndex(itemSelected))}
      {renderBottomSheet(ieltsPointList)}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  btnContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  pressableBtn: {
    alignItems: "center",
    justifyContent: "center",
  },
  activeItem: {
    borderWidth: 2,
    borderRadius: 10,
    marginVertical: 16,
    borderColor: palette.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    elevation: 10,
    shadowRadius: 8,
    shadowColor: palette.primary,
    // zIndex: 99,
    backgroundColor: palette.white,
  },
  inactiveItem: {
    borderWidth: 1,
    borderRadius: 10,
    marginVertical: 16,
    borderColor: palette.text,
  },
  itemText: {
    marginTop: 8,
    color: palette.text,
    fontSize: FONTSIZE - 13,
    fontWeight: "500",
    paddingHorizontal: 10,
    width: ScreenWidth * 0.5,
  },
  uploadContainer: {
    // paddingHorizontal: 5,
  },
  uploadText: {
    fontSize: FONTSIZE - 12,
    color: palette.text,
    paddingVertical: 5,
    fontWeight: "500",
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 8,
    marginTop: 5,
  },
  uploadIcon: {
    ...CS.center,
    height: 50,
    width: 50,
    // marginVertical: 5,
    borderRadius: 5,
  },
  uploadIconText: {
    paddingHorizontal: 16,
    fontStyle: "italic",
    fontSize: FONTSIZE - 16,
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
    // fontWeight: "700",
    color: palette.text,
    // fontFamily: "SVN-Outfit-Bold",
    fontWeight: "700",
  },
  selectBoxSubtitle: {
    fontSize: FONTSIZE - 14,
    color: palette.text,
    marginTop: 10,
    // fontFamily: "SVN-Outfit-Regular",
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
    fontSize: FONTSIZE - 10,
    color: palette.text,
    // alignSelf: "center",
    fontWeight: "600",
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
});

export default UploadCertificate;
