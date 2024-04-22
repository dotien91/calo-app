import React, { useEffect, useMemo, useState } from "react";
import { Image, ImageBackground, View } from "react-native";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import {
  useTheme,
  useRoute,
  useNavigation,
  StackActions,
} from "@react-navigation/native";

import IconSvg from "assets/svg";
import Button from "@shared-components/button/Button";
import TextBase from "@shared-components/TextBase";
import createStyles from "./elite.club.style";
import PressableBtn from "@shared-components/button/PressableBtn";
import TextViewCollapsed from "@screens/course/components/text.view.collapsed";
import { EnumColors } from "models";
import { translations } from "@localization";
import { palette } from "@theme/themes";
// import ItemMember from "./components/item.member";
import ListFile from "@screens/home/components/post-item/list.media.post.item";
import * as NavigationService from "react-navigation-helpers";
import { SCREENS } from "constants";
import {
  addMemberGroup,
  getDetailGroup,
  getMemberGroup,
} from "@services/api/club.api";
import useStore from "@services/zustand/store";
import {
  closeSuperModal,
  showLoading,
  showToast,
} from "@helpers/super.modal.helper";
import { formatVNDate } from "@utils/date.utils";
import CS from "@theme/styles";
import { useListData } from "@helpers/hooks/useListData";
import { convertLastActive } from "@utils/time.utils";
import { navigate } from "@helpers/navigation.helper";
import eventEmitter from "@services/event-emitter";

const ItemEliteScreen = () => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const route = useRoute();
  const navigation = useNavigation();
  const id = route.params.id || "";
  const name = route.params.name || "";
  const [dataGroup, setDataGroup] = useState();

  const userData = useStore((store) => store.userData);

  const IconText = ({ nameIcon, text }: { nameIcon: string; text: string }) => {
    return (
      <View style={styles.viewIcon}>
        <IconSvg name={nameIcon} size={20} color={palette.textOpacity6} />
        <TextBase fontSize={16} fontWeight="400">
          {text}
        </TextBase>
      </View>
    );
  };

  useEffect(() => {
    _getDetailGroup();
  }, []);

  const _getDetailGroup = () => {
    getDetailGroup(id).then((res) => {
      if (!res.isError) {
        setDataGroup(res.data);
      }
    });
  };
  const paramAdmin = {
    limit: "10",
    group_id: id,
    tier: "2",
  };
  const paramLeader = {
    limit: "10",
    group_id: id,
    tier: "3",
  };
  const { listData: listData1 } = useListData<TypeClubMember>(
    paramAdmin,
    getMemberGroup,
    [],
  );
  const { listData: listData2 } = useListData<TypeClubMember>(
    paramLeader,
    getMemberGroup,
    [],
  );

  const listData = [...listData2, ...listData1];

  const joinGroup = () => {
    if (dataGroup?.attend_data?.tier) {
      navigate(SCREENS.CLUB_HOME, {
        id: id,
        name: name,
      });
    } else {
      showLoading();
      addMemberGroup({
        group_id: id,
        user_id: userData?._id,
      }).then((res) => {
        closeSuperModal();
        if (!res.isError) {
          navigation.dispatch(
            StackActions.replace(SCREENS.CLUB_HOME, {
              id: id,
              name: name,
            }),
          );
          eventEmitter.emit("reload_list_club");
        } else {
          showToast({
            type: "error",
            message: translations.club.joinClubFalid,
          });
        }
      });
    }
  };

  const gotoMemberList = () => {
    NavigationService.navigate(SCREENS.LIST_MEMBER_CLUB, { club_id: id });
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: dataGroup?.cover }}
        style={styles.viewImg}
      />
      <View style={styles.viewContent}>
        <View style={styles.viewTitle}>
          <TextBase
            fontSize={20}
            color={EnumColors.text}
            fontWeight="700"
            title={dataGroup?.name}
            numberOfLines={3}
          />
          <TextBase
            fontSize={14}
            fontWeight="400"
            title={`${dataGroup?.number_member_recent_join} ${translations.club.member}`}
          />
          {/* <TextBase
            fontSize={20}
            fontWeight="700"
            title="3.450.000 VND"
            color={EnumColors.primary}
          /> */}
        </View>
        <Button
          onPress={joinGroup}
          text={translations.club.joinGruop}
          backgroundColor={palette.primary}
        />
        <View style={styles.viewTitle}>
          <TextBase
            fontSize={16}
            color={EnumColors.text}
            fontWeight="700"
            title={translations.club.about}
          />
          <TextViewCollapsed
            // text={track?.content || ""}
            text={dataGroup?.description}
            styleText={styles.des}
          />
          {dataGroup?.location && (
            <View style={styles.viewHis}>
              <IconSvg
                name="icLocated"
                size={20}
                color={palette.textOpacity6}
              />
              <View style={CS.flex1}>
                <TextBase
                  fontSize={16}
                  fontWeight="500"
                  title={translations.club.location}
                />
                <TextBase
                  fontSize={14}
                  fontWeight="400"
                  title={dataGroup?.location}
                />
              </View>
            </View>
          )}
          <View style={styles.viewHis}>
            <IconSvg name="icTime" size={20} color={palette.textOpacity6} />
            <View style={CS.flex1}>
              <TextBase
                fontSize={16}
                fontWeight="500"
                title={translations.club.history}
              />
              <TextBase
                fontSize={14}
                fontWeight="400"
                // title={`${translations.club.des1} ${formatVNDate(
                //   dataGroup?.createdAt,
                // )} ${translations.club.des2} ${formatVNDate(
                //   dataGroup?.updatedAt,
                // )}`}
                title={translations.club.createAt(
                  formatVNDate(dataGroup?.createdAt),
                  formatVNDate(dataGroup?.updatedAt),
                )}
              />
            </View>
          </View>
          {/* <View style={styles.viewTitle}>
            <TextBase
              fontSize={16}
              fontWeight="700"
              title={translations.club.featureMember}
            />
            <View style={styles.viewMember}>
              <ItemMember />
            </View>
          </View> */}
          <View style={styles.viewTitle}>
            <View style={styles.viewHeadTitle}>
              <TextBase
                fontSize={16}
                color={EnumColors.text}
                fontWeight="700"
                title={translations.club.title}
              />
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <PressableBtn onPress={gotoMemberList}>
                  <TextBase
                    fontSize={16}
                    fontWeight="500"
                    color={EnumColors.textOpacity6}
                  >
                    {translations.seeAll}
                  </TextBase>
                </PressableBtn>
                <Icon
                  name="chevron-forward-outline"
                  type={IconType.Ionicons}
                  color={palette.textOpacity6}
                  size={16}
                />
              </View>
            </View>
            <View style={styles.viewAvatar}>
              {listData.map((item, index) => (
                <Image
                  key={index}
                  style={styles.styleAvatar}
                  source={{ uri: item.user_id.user_avatar }}
                />
              ))}
            </View>
            {listData.length > 0 && (
              <TextBase
                fontSize={16}
                fontWeight="400"
                title={`${listData2[0]?.user_id.display_name} ${
                  translations.club.desLeader
                } ${translations.club.desAdmin(listData1.length)}`}
              />
            )}
          </View>
          <View style={styles.viewTitle}>
            <TextBase
              fontSize={16}
              fontWeight="700"
              title={translations.club.group}
              color={EnumColors.text}
            />
            <View style={styles.viewGroup}>
              <IconText
                nameIcon="icComment"
                text={`${dataGroup?.number_recent_post} ${translations.club.newPosts}`}
              />
              <IconText
                nameIcon="icPersonal"
                text={`${dataGroup?.member_counter} ${translations.club.member}`}
              />
              <View style={{ marginLeft: 32 }}>
                <TextBase
                  fontSize={12}
                  fontWeight="400"
                  title={`${dataGroup?.number_member_recent_join} ${translations.club.inCome}`}
                />
              </View>
              <IconText
                nameIcon="icPeople"
                text={`${translations.club.created} ${convertLastActive(
                  dataGroup?.createdAt,
                )} ${translations.club.ago}`}
              />
            </View>
          </View>
          <View style={styles.viewTitle}>
            <ListFile
              listFile={
                dataGroup?.featured_image.map((item) => ({
                  media_mime_type: "image",
                  media_thumbnail: item,
                  media_url: item,
                })) || []
              }
            />
            {/* {dataGroup?.featured_image?.length > 0 && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <PressableBtn
                  onPress={() => {
                    NavigationService.navigate(SCREENS.LIST_IMAGE_SCREEN);
                  }}
                >
                  <TextBase
                    fontSize={16}
                    fontWeight="500"
                    color={EnumColors.primary}
                  >
                    {translations.seeAll}
                  </TextBase>
                </PressableBtn>
                <Icon
                  name="chevron-forward-outline"
                  type={IconType.Ionicons}
                  color={palette.primary}
                  size={16}
                />
              </View>
            )} */}
          </View>
        </View>
      </View>
    </View>
  );
};

export default ItemEliteScreen;
