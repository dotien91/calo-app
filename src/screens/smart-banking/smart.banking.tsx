import React, { useState, useMemo, useEffect } from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
  Clipboard,
  SafeAreaView,
} from "react-native";
// import Clipboard from "@react-native-community/clipboard";
import { useTheme, useRoute } from "@react-navigation/native";
import * as NavigationService from "react-navigation-helpers";
import QRCode from "react-native-qrcode-svg";
import Share from "react-native-share";

import { translations } from "@localization";
import createStyles from "./smart.banking.style";
import Header from "@shared-components/header/Header";
import { useUploadFile } from "@helpers/hooks/useUploadFile";
import { getOrderDetail, updateUserOrder } from "@services/api/payment.api";
import {
  EnumModalContentType,
  EnumStyleModalType,
  closeSuperModal,
  showSuperModal,
  showToast,
} from "@helpers/super.modal.helper";
import { SCREENS } from "constants";
import CS from "@theme/styles";
import { genQr } from "@services/api/bank.api";
import { formatPrice } from "@helpers/string.helper";
import { getBankInfo, getListBank } from "@services/api/affiliate.api";

const SmartBanking = () => {
  // const [fileImage, setfileImage] = useState("");
  const theme = useTheme();
  // const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const route = useRoute();
  const tradeId = route.params?.["tradeId"];
  const short_id = route.params?.["short_id"];
  const price = route.params?.["price"] as number;
  const countCheckPaymentSuccess = React.useRef(null);
  const intervalCheckPaymentSuccess = React.useRef(null);
  const [bankInfo, setBankInfo] = useState(null);
  const [qrcode, setqrCode] = useState();
  const [updated, setUpdated] = useState(false);

  const callbackPaymentSuccess = () => {
    NavigationService.navigate(SCREENS.PAYMENT_SUCCESS);
  };

  useEffect(() => {
    getBankInfo().then((res) => {
      if (!res.isError) {
        setBankInfo(res?.data?.config?.data);
        getQr(res?.data?.config?.data);
      }
    });
  }, []);

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
    NavigationService.popToTop();
  };

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
  let refQr: any;

  const actionSend = () => {
    const data = {
      _id: tradeId,
      status: "processing",
      media_id: listFile[listFile.length - 1]._id,
      order_note: `IELTS ${short_id}`,
    };
    showSuperModal({
      contentModalType: EnumModalContentType.Loading,
      styleModalType: EnumStyleModalType.Middle,
    });
    updateUserOrder(data).then((res) => {
      closeSuperModal();
      if (!res.isError) {
        // showToast({
        //   type: "success",
        //   message: translations.payment.sendImageSuccess,
        // });
        setUpdated(true);
        checkPaymentSuccess();
      } else {
        showToast({
          type: "error",
          message: "",
        });
      }
    });
  };

  const getQr = (bankInfo) => {
    // console.log("bankInfobankInfo", bankInfo);
    const data = {
      accountNo: bankInfo?.card_id,
      accountName: bankInfo?.card_name,
      acqId: bankInfo?.bank_code,
      amount: price,
      addInfo: `Ikigai Coach ${short_id}`,
      format: "text",
      template: "compact",
    };
    genQr(data)
      .then((res: any) => {
        // console.log("json", JSON.stringify(res, null, 2));
        setqrCode(res.data.data.qrCode);
        console.log("json", res.data.data.qrCode);
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  // const CACHE_IMAGE_FOLDER = fs.CachesDirectoryPath + "/image/";
  const shareQR = () => {
    // const newPath = `${fs.DocumentDirectoryPath}/${short_id}`;
    refQr.toDataURL((data) => {
      const shareImageBase64 = {
        title: "QR",
        message: "Save QR code",
        url: `data:image/png;base64,${data}`,
      };
      Share.open(shareImageBase64);

      // fs.writeFile(
      //   `${CACHE_IMAGE_FOLDER}/${short_id}.png`,
      //   // `data:image/png;base64,${data}`,
      //   data,
      //   "base64",
      // );
      // fs.writeFile(`img${short_id}`, `${data}`, "base64")
      //   .then((success) => {
      //     console.log("IMG COPIED!");
      //     console.log(newPath);
      //   })
      //   .catch((err) => {
      //     console.log(err.message);
      //   });

      // return newPath;
    });
  };

  return (
    <SafeAreaView style={{ ...CS.safeAreaView }}>
      <Header text="Smart Banking" />
      <View style={{ marginHorizontal: 16, alignItems: "center" }}>
        {updated ? (
          <>
            <Text numberOfLines={2} style={{ ...styles.styleTextNameBank }}>
              {translations.payment.sendImageSuccess}
            </Text>
            <Text numberOfLines={4} style={styles.styleTextToComplete}>
              {
                "Thông tin chuyển khoản đã được gửi thành công, khoá học sẽ được mở khoá trong thời gian sớm nhất!"
              }
            </Text>
            <Text numberOfLines={2} style={styles.styleTextToComplete}>
              {"Vui lòng giữ lại thông tin chuyển khoản khoá học!"}
            </Text>
          </>
        ) : (
          <>
            <Text numberOfLines={2} style={styles.styleTextToComplete}>
              {translations.payment.tocomplete}
            </Text>
            <View style={styles.styleViewCopyNumberBank}>
              <TouchableOpacity
                onPress={() => {
                  copyToClipboard(bankInfo?.bank_code || "---");
                  showToast({ type: "info", message: "Coppied" });
                }}
                style={CS.row}
              >
                <Text style={styles.styleTextNumberBank}>
                  {bankInfo?.bank_code || "---"}
                </Text>
                <Image
                  style={{ height: 15.3, width: 13.79 }}
                  source={require("assets/images/CopyIcon.png")}
                ></Image>
              </TouchableOpacity>
            </View>
            <Text style={styles.styleTextName}>
              {bankInfo?.card_name || "---"}
            </Text>
            <Text numberOfLines={2} style={styles.styleTextNameBank}>
              {bankInfo?.bank_name || "---"}
            </Text>
            <Text numberOfLines={2} style={styles.styleTextNameBank}>
              {bankInfo?.bank_branch || "---"}
            </Text>
            <Text numberOfLines={2} style={styles.styleTextNameBank}>
              Số tiền : {formatPrice(price)}
            </Text>
            <TouchableOpacity
              style={{ flexDirection: "row", justifyContent: "center" }}
              onPress={() => {
                copyToClipboard(`Ikigai Coach ${short_id}`);
                showToast({ type: "info", message: "Coppied" });
              }}
            >
              <Text numberOfLines={2} style={styles.styleTextNameBank}>
                {translations.payment.content}: Ikigai Coach {short_id}
              </Text>
              <Image
                style={{ height: 15.3, width: 13.79, marginLeft: 5 }}
                source={require("assets/images/CopyIcon.png")}
              ></Image>
            </TouchableOpacity>
            <View style={{ marginBottom: 16 }}>
              <QRCode value={qrcode} getRef={(c) => (refQr = c)} />
              <Text style={styles.styleTextSaveQRcode} onPress={shareQR}>
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
              <TouchableOpacity
                onPress={actionSend}
                style={styles.styleBtnSend}
              >
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
          </>
        )}
        <View style={{ height: 12 }} />
        <TouchableOpacity onPress={goBackHome} style={styles.styleBtnSend}>
          <Text style={styles.styleTextSend}>{translations.goBackHome}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
export default SmartBanking;
