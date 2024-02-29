import { sliceString } from "@helpers/string.helper";
import {
  EnumModalContentType,
  EnumStyleModalType,
  closeSuperModal,
  showSuperModal,
} from "@helpers/super.modal.helper";
import { translations } from "@localization";
import { useRoute } from "@react-navigation/native";
import {
  addCommentThread,
  deleteThreadComment,
  getListCommentThread,
} from "@services/api/course.api";
import useStore from "@services/zustand/store";
import TextBase from "@shared-components/TextBase";
import PressableBtn from "@shared-components/button/PressableBtn";
import LoadingList from "@shared-components/loading.list.component";
import Avatar from "@shared-components/user/Avatar";
import CS from "@theme/styles";
import { palette } from "@theme/themes";
import { convertLastActive } from "@utils/time.utils";
import { EnumColors } from "models";
import * as React from "react";
import { Text, View, ScrollView } from "react-native";
import Icon, { IconType } from "react-native-dynamic-vector-icons";

interface IThreadCommentsView {
  isPrivate: boolean;
  isTeacher: boolean;
  studentId: string;
  onHandIn: () => void;
}

const ThreadCommentsView = ({
  isPrivate,
  isTeacher,
  studentId,
  onHandIn,
}: IThreadCommentsView) => {
  const route = useRoute();
  const data = route.params?.["data"];
  console.log("11111", data);
  const [listData, setListData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const getListComments = () => {
    setLoading(true);
    getListCommentThread(
      {
        order_by: "DESC",
        thread_id: data._id,
        type: isPrivate ? "private" : "public",
      },
      { "Class-ID": data.class_id },
    ).then((res) => {
      if (!res.isError) {
        setListData(res.data);
      }
      setLoading(false);
    });
  };

  React.useEffect(() => {
    getListComments();
  }, []);

  const sendComment = (v: string) => {
    if (!v) return;
    const params = {
      thread_id: data._id,
      content: v,
      type: isPrivate ? "private" : "public",
    };
    if (isTeacher) params.reply_to_user_id = studentId;
    addCommentThread(params, { "Class-ID": data.class_id }).then((res) => {
      console.log("ress add comment", res);
      if (!res.isError) {
        getListComments();
        //gửi điểm = 0 case task ko có max_mark khi giáo viên cmt
        if (onHandIn && isTeacher && data?.max_mark == 0) onHandIn();
      }
    });
  };

  const showPopupComment = () => {
    showSuperModal({
      contentModalType: EnumModalContentType.TextInput,
      styleModalType: EnumStyleModalType.Bottom,
      data: {
        cb: sendComment,
        hideCloseIcon: true,
      },
    });
  };

  return (
    <>
      <PressableBtn onPress={showPopupComment}>
        <TextBase color={"primary"} marginBottom={8}>
          {translations.homework.addClassCmt}
        </TextBase>
      </PressableBtn>
      <TextBase fontWeight="500">{translations.homework.classCmt}</TextBase>
      <ScrollView style={{ marginTop: 8 }}>
        {loading && <LoadingList />}
        {listData.map((item) => (
          <ItemComment
            classId={data.class_id}
            key={item._id}
            {...item}
            getListComments={getListComments}
          />
        ))}
      </ScrollView>
    </>
  );
};

export default ThreadCommentsView;

const ItemComment = React.memo(
  ({ content, user_id, classId, _id, getListComments, createdAt }) => {
    const userData = useStore((state) => state.userData);
    const isMe = React.useMemo(() => {
      return userData?._id == user_id._id;
    }, [user_id]);

    const showPopupComment = () => {
      showSuperModal({
        styleModalType: EnumStyleModalType.Bottom,
        contentModalType: EnumModalContentType.ListMoreAction,
        data: {
          hideCloseIcon: true,
          options: [
            {
              onPress: deleteComment,
              nameIcon: "trash",
              text: translations.delete,
            },
          ],
        },
      });
    };

    const deleteComment = () => {
      deleteThreadComment(_id, { "Class-ID": classId }).then((res) => {
        if (!res.isError) {
          getListComments();
          closeSuperModal();
        }
      });
    };

    return (
      <View style={{ flexDirection: "row", marginTop: 8 }}>
        <Avatar
          sourceUri={{ uri: user_id.user_avatar_thumbnail }}
          style={{ width: 32, height: 32, borderRadius: 99 }}
        />
        <View style={{ marginLeft: 8, flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
            }}
          >
            <View style={{ flexDirection: "row", flex: 1 }}>
              <Text style={{ ...CS.hnSemiBold, color: palette.text }}>
                {`${sliceString(user_id.display_name, 30)} `}
                <TextBase fontSize={12} color={EnumColors.textOpacity4}>
                  {convertLastActive(createdAt)}
                </TextBase>
              </Text>
            </View>
            {isMe && (
              <Icon
                size={20}
                onPress={showPopupComment}
                name="ellipsis-vertical"
                type={IconType.Ionicons}
                color={palette.text}
              />
            )}
          </View>

          <Text
            style={{
              ...CS.hnRegular,
              color: palette.textOpacity8,
            }}
          >
            {content}
          </Text>
        </View>
      </View>
    );
  },
);
