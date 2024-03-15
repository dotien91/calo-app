import React, { useState, useMemo, useEffect } from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
  Clipboard,
} from "react-native";
// import Clipboard from "@react-native-community/clipboard";
import { useTheme, useRoute } from "@react-navigation/native";
import * as NavigationService from "react-navigation-helpers";

import { translations } from "@localization";
import createStyles from "./smart.banking.style";
import Header from "@shared-components/header/Header";
import { useUploadFile } from "@helpers/hooks/useUploadFile";
import {
  getOrderDetail,
  updateUserOrder,
  getQRcode,
} from "@services/api/payment.api";
import {
  EnumModalContentType,
  EnumStyleModalType,
  closeSuperModal,
  showSuperModal,
  showToast,
} from "@helpers/super.modal.helper";
import { SCREENS } from "constants";
import CS from "@theme/styles";

const SmartBanking = () => {
  // const [fileImage, setfileImage] = useState("");
  const theme = useTheme();
  // const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const route = useRoute();
  const tradeId = route.params?.["tradeId"];
  const countCheckPaymentSuccess = React.useRef(null);
  const intervalCheckPaymentSuccess = React.useRef(null);

  const callbackPaymentSuccess = () => {
    NavigationService.navigate(SCREENS.PAYMENT_SUCCESS);
  };

  React.useEffect(() => {
    return () => {
      if (intervalCheckPaymentSuccess.current)
        clearInterval(intervalCheckPaymentSuccess.current);
    };
  }, []);

  const checkPaymentSuccess = () => {
    // check payment success 4 times
    intervalCheckPaymentSuccess.current = setInterval(() => {
      if (countCheckPaymentSuccess.current == 4) {
        clearInterval(intervalCheckPaymentSuccess.current);
        return;
      }
      countCheckPaymentSuccess.current += 1;
      getOrderDetail(tradeId).then((res) => {
        console.log("checkPaymentSuccess res", res);
        if (!res.isError) {
          if (res.data.status == "success") {
            //alert success
            callbackPaymentSuccess();
            clearInterval(intervalCheckPaymentSuccess.current);
          }
        } else {
          //failed
        }
      });
    }, 3000);
  };

  const goBackHome = () => {
    NavigationService.navigate(SCREENS.COURSE_LIST);
  };

  const [qrcode, setqeCode] = useState("");
  const copyToClipboard = (text: string) => {
    Clipboard.setString(text);
  };

  const { onSelectPicture, isUpLoadingFile, listFile } = useUploadFile([], 1);

  // const selectImage = () => {
  //   selectMedia({
  //     config: { mediaType: "photo", selectionLimit: 1 },
  //     callback: async (image) => {
  //       setfileImage(
  //         image?.filename || image.path?.split("/")?.reverse()?.[0] || "",
  //       );
  //     },
  //   });
  // };

  const actionSend = () => {
    const data = {
      _id: tradeId,
      status: "processing",
      media_id: listFile[listFile.length - 1]._id,
    };
    showSuperModal({
      contentModalType: EnumModalContentType.Loading,
      styleModalType: EnumStyleModalType.Middle,
    });
    updateUserOrder(data).then((res) => {
      closeSuperModal();
      console.log("resssssss", res);
      if (!res.isError) {
        showToast({
          type: "success",
          message: "Gửi ảnh thành công",
        });
        checkPaymentSuccess();
      } else {
        showToast({
          type: "error",
          message: "",
        });
      }
    });
  };

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    getQRcode()
      .then((res: any) => {
        console.log("json", JSON.stringify(res, null, 2));
        setqeCode(res.data);
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  return (
    <View style={{ ...CS.safeAreaView }}>
      <Header text="Smart Banking" />
      <View style={{ marginHorizontal: 16, alignItems: "center" }}>
        <Text numberOfLines={2} style={styles.styleTextToComplete}>
          {translations.payment.tocomplete}
        </Text>
        <View style={styles.styleViewCopyNumberBank}>
          <Text style={styles.styleTextNumberBank}>
            {qrcode?.config?.option_content[0]?.value}
          </Text>
          <TouchableOpacity
            onPress={() => {
              copyToClipboard(qrcode?.config?.option_content[0]?.value);
            }}
          >
            <Image
              style={{ height: 15.3, width: 13.79 }}
              source={require("assets/images/CopyIcon.png")}
            ></Image>
          </TouchableOpacity>
        </View>
        <Text style={styles.styleTextName}>NGUYEN VAN A</Text>
        <Text numberOfLines={2} style={styles.styleTextNameBank}>
          {qrcode?.config?.option_content[1]?.value}
        </Text>

        <TouchableOpacity
          style={{ flexDirection: "row", justifyContent: "center" }}
          onPress={() => {
            copyToClipboard("ilelts hunter");
          }}
        >
          <Text numberOfLines={2} style={styles.styleTextNameBank}>
            {translations.payment.content}: ilelts hunter
          </Text>
          <Image
            style={{ height: 15.3, width: 13.79, marginLeft: 5 }}
            source={require("assets/images/CopyIcon.png")}
          ></Image>
        </TouchableOpacity>
        <View style={{ marginBottom: 16 }}>
          <Image
            style={{ height: 180, width: 180, marginBottom: 4 }}
            source={{ uri: qrcode?.config?.data_content }}
          ></Image>
          <Text style={styles.styleTextSaveQRcode}>
            {translations.payment.saveQRCode}
          </Text>
        </View>
        <Text style={styles.styleTextSendProvement}>
          {translations.payment.sendPro}
        </Text>
        {listFile.length ? (
          <TouchableOpacity
            onPress={onSelectPicture}
            style={styles.styleViewImageSelected}
          >
            <Image
              style={{ height: 20, width: 20, marginRight: 8 }}
              source={require("assets/images/iconMedia.png")}
            />
            <Text numberOfLines={1}>{listFile[0]?.uri}</Text>
          </TouchableOpacity>
        ) : null}
        {listFile.length ? (
          <TouchableOpacity onPress={actionSend} style={styles.styleBtnSend}>
            <Text style={styles.styleTextSend}>
              {translations.payment.send}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            disabled={isUpLoadingFile}
            onPress={onSelectPicture}
            style={[
              styles.styleBtnUploadFile,
              isUpLoadingFile && { opacity: 0.5 },
            ]}
          >
            {isUpLoadingFile ? (
              <ActivityIndicator size={"small"} />
            ) : (
              <>
                <Image
                  style={{ height: 12, width: 12, marginRight: 16 }}
                  source={require("assets/images/plus.png")}
                />
                <Text style={styles.styleTextHadPaid}>
                  {translations.payment.uploadfile}
                </Text>
              </>
            )}
          </TouchableOpacity>
        )}
        <View style={{ height: 12 }} />
        <TouchableOpacity onPress={goBackHome} style={styles.styleBtnSend}>
          <Text style={styles.styleTextSend}>{translations.goBackHome}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default SmartBanking;
