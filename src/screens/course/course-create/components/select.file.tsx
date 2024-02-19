import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { isIos } from "@helpers/device.info.helper";
import { uploadFile } from "@services/api/post";
import PressableBtn from "@shared-components/button/PressableBtn";
import { palette } from "@theme/themes";
import CS from "@theme/styles";
import { translations } from "@localization";
import LoadingUpdateMedia from "./LoadingUpdateMedia";
import { WindowWidth } from "@freakycoder/react-native-helpers";
import { pick, types } from "react-native-document-picker";

interface SelectFileHookProps {
  link?: string;
  id?: string;
  placeholder?: string;
  typeM?: string;
}

const SelectFileHook = ({
  link,
  id,
  typeM,
  placeholder,
}: SelectFileHookProps) => {
  const [linkFile, setLinkFile] = React.useState("");
  const [updatingFile, setUpdatingFile] = React.useState(false);
  const [idFile, setIdFile] = React.useState("");
  const [typeMedia, setTypeMedia] = useState("");

  useEffect(() => {
    if (link) {
      setLinkFile(link);
    }
    if (id) {
      setIdFile(id);
    }
    if (typeM) {
      setTypeMedia(typeM);
    }
  }, [link, id, typeM]);

  const onPressFile = async () => {
    try {
      const pickerResult = await pick({
        allowMultiSelection: false,
        presentationStyle: "fullScreen",
        type: [
          types.doc,
          types.docx,
          types.pdf,
          types.plainText,
          types.xls,
          types.xlsx,
          types.ppt,
          types.pptx,
        ],
      });

      if (pickerResult.length > 0) {
        setUpdatingFile(true);
        const file = pickerResult[0];
        console.log("file...", file);
        // formRef.current?.setFieldValue("gift_digital_media", { uri: file.uri, name: file.name, type: file.type, loading: true })
        const res = await uploadFile({
          name: file.name || (file.uri || "")?.split("/")?.reverse()?.[0] || "",
          uri: isIos() ? file.uri?.replace("file://", "") : file.uri,
          type: file.type || "",
        });
        if (res?.data[0]?.callback?._id) {
          console.log("res", JSON.stringify(res.data[0], null, 2));
          setUpdatingFile(false);
          setIdFile(res.data[0]?.callback?._id);
          setLinkFile(res.data[0]?.callback?.media_file_name);
        } else {
          console.log("res2", JSON.stringify(res.data[0], null, 2));
          setUpdatingFile(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const renderSelectFile = () => {
    return (
      <PressableBtn
        onPress={onPressFile}
        style={{
          height: 40,
          ...CS.center,
          backgroundColor:
            linkFile === "" ? palette.placeholder : palette.background,
          paddingHorizontal: 16,
        }}
      >
        {linkFile === "" && !updatingFile ? (
          <View>
            <Text style={[CS.hnRegular, { color: palette.primary }]}>
              {placeholder || translations.home.file}
            </Text>
          </View>
        ) : (
          <View style={styles.viewImage}>
            <Text style={[CS.hnRegular, { color: palette.text }]}>
              {linkFile}
            </Text>
            {updatingFile && (
              <View style={styles.viewImageFill}>
                <LoadingUpdateMedia />
              </View>
            )}
          </View>
        )}
      </PressableBtn>
    );
  };

  return {
    renderSelectFile,
    idFile,
    updatingFile,
    typeMedia,
  };
};

export default SelectFileHook;

const styles = StyleSheet.create({
  viewImage: {
    height: 40,
    width: WindowWidth - 32,
    backgroundColor: palette.background,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: "center",
  },
  viewImageFill: {
    ...CS.fillParent,
    ...CS.center,
    backgroundColor: palette.placeholder,
  },
});
