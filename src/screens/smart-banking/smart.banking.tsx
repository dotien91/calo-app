import React, { useState, useMemo } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import Clipboard from "@react-native-community/clipboard";
import * as NavigationService from "react-navigation-helpers";

import { useTheme } from "@react-navigation/native";
import { translations } from "@localization";
import createStyles from "./smart.banking.style";
import Header from "@shared-components/header/Header";
import { selectMedia } from "@helpers/file.helper";
import { SCREENS } from "constants";

const SmartBanking = () => {
  const [fileImage, setfileImage] = useState("");
  const theme = useTheme();
  // const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const copyToClipboard = () => {
    Clipboard.setString("adasds");
  };

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
    NavigationService.navigate(SCREENS.PAYMENT_SUCCESS);
  };

  return (
    <View style={{ flex: 1 }}>
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
        {fileImage ? (
          <View style={styles.styleViewImageSelected}>
            <Image
              style={{ height: 20, width: 20, marginRight: 8 }}
              source={require("assets/images/iconMedia.png")}
            />
            <Text>{fileImage}</Text>
          </View>
        ) : null}
        {fileImage ? (
          <TouchableOpacity onPress={actionSend} style={styles.styleBtnSend}>
            <Text style={styles.styleTextSend}>
              {translations.payment.send}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={selectImage}
            style={styles.styleBtnUploadFile}
          >
            <Image
              style={{ height: 12, width: 12, marginRight: 16 }}
              source={require("assets/images/plus.png")}
            />
            <Text style={styles.styleTextHadPaid}>
              {translations.payment.uploadfile}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
export default SmartBanking;
