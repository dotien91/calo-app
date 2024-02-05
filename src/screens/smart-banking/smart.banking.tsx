import React, { useState, useMemo } from "react";
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Clipboard from "@react-native-community/clipboard";
import { useTheme, useRoute } from "@react-navigation/native";

import { translations } from "@localization";
import createStyles from "./smart.banking.style";
import Header from "@shared-components/header/Header";
import { selectMedia } from "@helpers/file.helper";
import { useUploadFile } from "@helpers/hooks/useUploadFile";
import { updateUserOrder } from "@services/api/payment.api";
import {
  EnumModalContentType,
  EnumStyleModalType,
  closeSuperModal,
  showSuperModal,
  showToast,
} from "@helpers/super.modal.helper";

const SmartBanking = () => {
  const [fileImage, setfileImage] = useState("");
  const theme = useTheme();
  // const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const route = useRoute();
  const tradeId = route.params?.["tradeId"];

  const copyToClipboard = () => {
    Clipboard.setString("adasds");
  };

  const { onSelectPicture, isUpLoadingFile, listFileLocal, listFile } =
    useUploadFile([], 1);

  const selectImage = () => {
    selectMedia({
      config: { mediaType: "photo", selectionLimit: 1 },
      callback: async (image) => {
        setfileImage(
          image?.filename || image.path?.split("/")?.reverse()?.[0] || "",
        );
      },
    });
  };

  const actionSend = () => {
    console.log("listFilelistFilelistFile", listFile);
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
      if (!res.isError) {
        showToast({
          type: "success",
          message: "Gửi ảnh thành công",
        });
      } else {
        showToast({
          type: "error",
        });
      }
    });

    console.log("dataaaa", data);
    // NavigationService.navigate(SCREENS.PAYMENT_SUCCESS);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header text="Smart Banking" />
      <View style={{ marginHorizontal: 16, alignItems: "center" }}>
        <Text numberOfLines={2} style={styles.styleTextToComplete}>
          {translations.payment.tocomplete}
        </Text>
        <View style={styles.styleViewCopyNumberBank}>
          <Text style={styles.styleTextNumberBank}>0123456789</Text>
          <TouchableOpacity onPress={copyToClipboard}>
            <Image
              style={{ height: 15.3, width: 13.79 }}
              source={require("assets/images/CopyIcon.png")}
            ></Image>
          </TouchableOpacity>
        </View>
        <Text style={styles.styleTextName}>NGUYEN VAN A</Text>
        <Text numberOfLines={2} style={styles.styleTextNameBank}>
          Ngân hàng Thương mại cổ phần Đầu tư và Phát triển Việt Nam (BIDV)
        </Text>
        <View style={{ marginBottom: 16 }}>
          <Image
            style={{ height: 180, width: 180, marginBottom: 4 }}
            source={require("assets/images/QRcode.png")}
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
      </View>
    </SafeAreaView>
  );
};
export default SmartBanking;
