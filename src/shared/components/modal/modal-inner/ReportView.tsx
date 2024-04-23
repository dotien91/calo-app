import React from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";

import CommonStyle from "@theme/styles";
import { createReport } from "@services/api/post.api";
import { palette } from "@theme/themes";
import { closeSuperModal, showToast } from "@helpers/super.modal.helper";
import { useUserHook } from "@helpers/hooks/useUserHook";

interface IReportData {
  report_type?: string;
  partner_id?: string;
}

const ReportView = ({ report_type, partner_id }: IReportData) => {
  const [txt, setTxt] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const { isLoggedIn, renderViewRequestLogin } = useUserHook();

  const sendReport = () => {
    setLoading(true);
    createReport({
      report_type: report_type || "post",
      partner_id: partner_id,
      report_content: txt,
    }).then((res) => {
      setLoading(false);
      if (!res.isError) {
        showToast({
          type: "success",
          message: "Gửi báo cáo thành công",
        });
      } else {
        showToast({
          type: "error",
          message: "Có lỗi không xác định xảy ra",
        });
      }
      closeSuperModal();
    });
  };

  if (!isLoggedIn()) return renderViewRequestLogin();

  return (
    <View style={styles.container}>
      <Text style={styles.textHeader}>Nội dung báo cáo vi phạm:</Text>
      <TextInput
        placeholder="Nhập nội dung report"
        placeholderTextColor={palette.placeholder2}
        style={styles.input}
        multiline={true}
        numberOfLines={4}
        onChangeText={(text) => setTxt(text)}
        value={txt}
      />

      <TouchableOpacity
        disabled={loading || !txt}
        style={[styles.btn, (!txt || loading) && { opacity: 0.5 }]}
        onPress={sendReport}
      >
        <Text style={styles.txtBtn}>Gửi</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ReportView;

const styles = StyleSheet.create({
  container: {
    padding: 18,
    paddingBottom: 30,
    alignItems: "center",
  },
  textHeader: {
    ...CommonStyle.hnBold,
    fontSize: 18,
    marginBottom: 12,
  },
  btn: {
    flex: 1,
    width: "100%",
    padding: 12,
    backgroundColor: palette.primary,
    ...CommonStyle.flexCenter,
    marginHorizontal: 20,
    borderRadius: 99,
  },
  input: {
    ...CommonStyle.borderStyle,
    height: 40,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginBottom: 12,
    width: "100%",
    height: 150,
  },
  txtBtn: {
    ...CommonStyle.hnRegular,
    color: palette.white,
  },
});
