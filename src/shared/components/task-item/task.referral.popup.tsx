import { palette } from "@theme/themes";
import * as React from "react";
import * as NavigationService from "react-navigation-helpers";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CS from "@theme/styles";
import TextBase from "@shared-components/TextBase";
import { translations } from "@localization";
import { TypedUser } from "models";
import IconSvg from "assets/svg";
import { ActionTypeTask } from "constants/task.constant";
import { SCREENS } from "constants";
import { closeSuperModal } from "@helpers/super.modal.helper";

interface ReferralPopupProps {
  data: TypedUser;
}

const ReferralPopupTask = ({ data }: ReferralPopupProps) => {
  const onClickItemTask = (item) => {
    switch (item.action_type) {
      case ActionTypeTask.LIKE:
        NavigationService.navigate(SCREENS.HOME);
        break;
      case ActionTypeTask.POST:
        NavigationService.navigate(SCREENS.POST_SCREEN);
        break;
      case ActionTypeTask.COMMENT:
        NavigationService.navigate(SCREENS.HOME);
        break;
      case ActionTypeTask.REFERRAL:
        NavigationService.navigate(SCREENS.HOME);
        break;
      case ActionTypeTask.BUY:
        NavigationService.navigate(SCREENS.COURSE_LIST);
        break;
      case ActionTypeTask.SHARE:
        NavigationService.navigate(SCREENS.HOME);
        break;
      case ActionTypeTask.COMPLETE:
        NavigationService.navigate(SCREENS.MY_COURES);
        break;
      case ActionTypeTask.VIEW:
        NavigationService.navigate(SCREENS.MY_COURES);
        break;
      case ActionTypeTask.WATCH:
        NavigationService.navigate(SCREENS.MY_COURES);
        break;
      case ActionTypeTask.JOIN:
        NavigationService.navigate(SCREENS.COURSE_LIST);
        break;
      default:
        NavigationService.navigate(SCREENS.HOME);
        break;
    }
    closeSuperModal();
  };

  const nameIcon = (item) => {
    switch (item.action_type) {
      case ActionTypeTask.LIKE:
        return {
          icon: "icLike",
          color: palette.white,
          backgroundColor: palette.blueChart,
        };
      case ActionTypeTask.POST:
        return {
          icon: "icupLoad",
          color: palette.white,
          backgroundColor: palette.greenChart,
        };
      case ActionTypeTask.COMMENT:
        return {
          icon: "icCommentTask",
          color: palette.white,
          backgroundColor: palette.yellowComment,
        };
      case ActionTypeTask.REFERRAL:
        return {
          icon: "iconPen",
          color: palette.white,
          backgroundColor: palette.boldYellow,
        };
      case ActionTypeTask.BUY:
        return {
          icon: "iconBuyTask",
          color: palette.white,
          backgroundColor: palette.btnRedPrimary,
        };
      case ActionTypeTask.SHARE:
        return {
          icon: "icupLoad",
          color: palette.white,
          backgroundColor: palette.yellow,
        };
      case ActionTypeTask.COMPLETE:
        return {
          icon: "iconPen",
          color: palette.white,
          backgroundColor: palette.greenChart,
        };
      case ActionTypeTask.VIEW:
        return {
          icon: "icYoutube",
          color: palette.white,
          backgroundColor: palette.primary,
        };
      case ActionTypeTask.WATCH:
        return {
          icon: "icYoutube",
          color: palette.white,
          backgroundColor: palette.yellowComment,
        };
      case ActionTypeTask.JOIN:
        return {
          icon: "iconBuyTask",
          color: palette.white,
          backgroundColor: palette.blueChart,
        };
      default:
        return {
          icon: "icLike",
          color: palette.white,
          backgroundColor: palette.primary,
        };
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.styleIcon,
          { backgroundColor: nameIcon(data.item).backgroundColor },
        ]}
      >
        <IconSvg
          name={nameIcon(data?.item).icon}
          color={nameIcon(data?.item).color}
          size={60}
        />
      </View>

      {data?.item && data?.item.point > 0 && (
        <View style={styles.viewPoint}>
          <Text style={styles.txtPoint}>
            {translations.task.get} {data?.item.point}
          </Text>
          <IconSvg
            style={{ marginLeft: 6 }}
            name={"icCoinStar"}
            color={palette.gold}
            size={20}
          />
        </View>
      )}
      {data?.item && data?.item.coin > 0 && (
        <View style={styles.viewPoint}>
          <Text style={styles.txtPoint}>
            {translations.task.get} {data?.item.coin}
          </Text>
          <IconSvg
            style={{ marginLeft: 6 }}
            name={"icCoin"}
            color={palette.gold}
            size={20}
          />
        </View>
      )}
      <View style={styles.viewBtn}>
        <TextBase style={{ color: palette.textOpacity8 }}>
          {data?.item.title}
        </TextBase>
      </View>
      <TouchableOpacity
        onPress={() => {
          onClickItemTask(data?.item);
        }}
        style={styles.viewPerson}
      >
        <TextBase style={{ color: palette.white }}>
          {translations.codeActivations.goTo} {data?.item.action_target}
        </TextBase>
      </TouchableOpacity>
    </View>
  );
};

export default ReferralPopupTask;

const styles = StyleSheet.create({
  container: {
    ...CS.center,
    marginTop: 16,
  },
  styleIcon: {
    ...CS.center,
    width: 96,
    height: 96,
    borderRadius: 100,
  },
  viewPoint: {
    ...CS.flexCenter,
  },
  viewBtn: {
    paddingVertical: 1,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  viewPerson: {
    ...CS.flexCenter,
    paddingVertical: 1,
    backgroundColor: palette.primary,
    borderRadius: 8,
    height: 40,
    gap: 8,
    marginTop: 16,
    width: "100%",
    marginBottom: 16,
  },
  txtPoint: { ...CS.hnSemiBold, fontSize: 20, color: palette.text },
});
