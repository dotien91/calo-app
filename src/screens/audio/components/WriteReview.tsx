import React, { useState } from "react";
import { Text, View, StyleSheet, TextInput } from "react-native";

import { closeSuperModal, showToast } from "@helpers/super.modal.helper";
import { translations } from "@localization";
import { CreateReview } from "@services/api/podcast.api";
import eventEmitter from "@services/event-emitter";
import CS from "@theme/styles";
import { palette } from "@theme/themes";

interface WriteReviewProps {
  data: any;
}

const WriteReview = ({ data }: WriteReviewProps) => {
  const [title, setTitle] = useState("");

  // const [review, setReview] = useState("");

  const onPressCancel = () => {
    closeSuperModal();
  };

  const onPressSend = () => {
    if (title.trim().length < 10) {
      alert(translations.podcast.warningReviewShort);
      // showToast({
      //   type: "info",
      //   message: translations.podcast.warningReviewShort,
      // });
    } else {
      const dataPost = {
        podcast_id: data.id,
        content: title,
      };
      console.log(dataPost);
      CreateReview(dataPost).then((res) => {
        if (!res.isError) {
          showToast({
            type: "success",
            message: translations.podcast.sendReviewSuccess,
          });
          eventEmitter.emit("reload_review_audio");
          closeSuperModal();
        } else {
          showToast({ type: "error", message: res.message });
        }
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.viewHeader}>
        <Text onPress={onPressCancel} style={styles.cancel}>
          {translations.podcast.cancel}
        </Text>
        <Text style={styles.header}>{translations.podcast.writeAReview}</Text>
        <Text onPress={onPressSend} style={styles.send}>
          {translations.podcast.send}
        </Text>
      </View>
      <View style={styles.viewTitle}>
        <TextInput
          value={title}
          onChangeText={(txt: string) => setTitle(txt)}
          placeholder={translations.podcast.title}
          style={styles.txtTitle}
          autoFocus
          multiline
        />
      </View>
      {/* <View style={styles.viewReview}>
        <TextInput
          value={review}
          onChangeText={(txt: string) => setReview(txt)}
          placeholder={translations.podcast.review}
          style={styles.txtReview}
          multiline
        />
      </View> */}
    </View>
  );
};

export default WriteReview;

const styles = StyleSheet.create({
  viewTitle: {
    borderTopWidth: 1,
    borderColor: palette.borderColor,
    paddingVertical: 8,
  },
  // viewReview: {
  //   borderTopWidth: 1,
  //   borderColor: palette.borderColor,
  //   paddingVertical: 8,
  //   height: 80,
  // },
  txtTitle: {
    ...CS.hnRegular,
  },
  // txtReview: {
  //   ...CS.hnRegular,
  //   textAlignVertical: "top",
  //   width: "100%",
  //   color: palette.textInput,
  // },
  container: {
    minHeight: 150,
  },
  viewHeader: {
    height: 28,
    ...CS.row,
    gap: 16,
    marginBottom: 16,
  },
  cancel: {
    ...CS.hnMedium,
    fontSize: 14,
    color: palette.primary,
  },
  header: {
    ...CS.hnBold,
    ...CS.flex1,
    textAlign: "center",
    fontSize: 20,
  },
  send: {
    ...CS.hnMedium,
    fontSize: 14,
    color: palette.primary,
  },
});
