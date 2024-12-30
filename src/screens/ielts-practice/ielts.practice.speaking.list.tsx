import { useUserHook } from "@helpers/hooks/useUserHook";
import { navigate } from "@helpers/navigation.helper";
import { showToast } from "@helpers/super.modal.helper";
import { getListSpeakingStudent } from "@services/api/ielts.practice.api";
import eventEmitter from "@services/event-emitter";
import Button from "@shared-components/button/Button";
import IconBtn from "@shared-components/button/IconBtn";
import EmptyResultView from "@shared-components/empty.data.component";
import Header from "@shared-components/header/Header";
import LoadingItem from "@shared-components/loading.item";
import CS from "@theme/styles";
import { palette } from "@theme/themes";
import { formatFullDate } from "@utils/date.utils";
import { SCREENS } from "constants";
import React from "react";
import {
  FlatList,
  Linking,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon, { IconType } from "react-native-dynamic-vector-icons";

const IeltsPracticeSpeakingList = () => {
  // lấy danh sách speaking đã đăng ký
  const { isLoggedIn } = useUserHook();
  const [data, setData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const _requestData = () => {
    setIsLoading(true);
    getListSpeakingStudent().then((res) => {
      if (!res.isError) {
        setData(res.data);
        setIsLoading(false);
      } else {
        showToast({
          type: "error",
          message: res.message,
        });
        setIsLoading(false);
      }
    });
  };
  React.useEffect(() => {
    _requestData();
  }, []);

  React.useEffect(() => {
    eventEmitter.on("reload_list_speaking_student", _requestData);
    return () => {
      eventEmitter.off("reload_list_speaking_student", _requestData);
    };
  }, []);
  const handleOpenMeet = (google_meet_data) => {
    if (google_meet_data) {
      // chuyen den google meet
      Linking.openURL(google_meet_data.hangoutLink);
      return;
    }
  };
  const renderItem = ({ item }) => {
    const isPending = item.status === "pending";
    return (
      <TouchableOpacity
        style={[styles.viewItem, !isPending && { borderColor: palette.green }]}
        key={item._id}
        onPress={() =>
          navigate(SCREENS.CREATE_SPEAKING, {
            data: item,
          })
        }
      >
        <View
          style={{
            borderBottomWidth: 1,
            borderColor: palette.borderColor,
            gap: 4,
            paddingVertical: 8,
          }}
        >
          <View style={styles.viewDateTime}>
            <Text style={[styles.text, { ...CS.hnBold }]}>Status:</Text>
            <Text
              style={[
                styles.text,
                { color: isPending ? palette.primary : palette.green },
              ]}
            >
              {item.status}
            </Text>
          </View>
          <View style={styles.viewDateTime}>
            <IconBtn name={"user"} customStyle={{ marginRight: 8 }} />
            <Text style={styles.text}>
              {item.full_name || item.display_name}
            </Text>
          </View>
          <View style={styles.viewDateTime}>
            <IconBtn name={"calendar"} customStyle={{ marginRight: 8 }} />
            <Text style={styles.text}>{formatFullDate(item.date_time)}</Text>
          </View>
        </View>
        <View style={{ gap: 4 }}>
          <Text
            style={[styles.text, { fontStyle: "italic", textAlign: "center" }]}
          >
            You need to wait for the status to change to 'active' to take the
            test.
          </Text>
          <Button
            text="Take the test now"
            disabled={isPending}
            backgroundColor={palette.primary}
            onPress={() => handleOpenMeet(item.google_meet_data)}
          />
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <SafeAreaView style={CS.safeAreaView}>
      <Header text="Exam schedule" />
      <View>
        {isLoading ? (
          <LoadingItem />
        ) : !isLoading && data.length === 0 ? (
          <EmptyResultView />
        ) : (
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item) => item._id + ""}
          />
        )}
      </View>
      {isLoggedIn() && (
        <TouchableOpacity
          style={{
            position: "absolute",
            width: 50,
            height: 50,
            backgroundColor: palette.primary,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 25,
            bottom: 80,
            right: 10,
            zIndex: 1,
          }}
          onPress={() => navigate(SCREENS.CREATE_SPEAKING)}
        >
          <Icon
            name={"add-outline"}
            type={IconType.Ionicons}
            size={30}
            color={palette.white}
          />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  viewItem: {
    margin: 8,
    padding: 8,
    borderWidth: 1,
    borderRadius: 8,
    gap: 16,
    borderColor: palette.primary,
  },
  viewDateTime: {
    ...CS.row,
    gap: 4,
  },
  text: {
    ...CS.hnRegular,
    color: palette.textOpacity6,
  },
});

export default IeltsPracticeSpeakingList;
