import * as React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
} from "react-native";
import * as NavigationService from "react-navigation-helpers";

import { ListReview } from "@services/api/podcast.api";
import ItemReview from "../components/ItemReview";
import CS from "@theme/styles";
import { translations } from "@localization";
import { SCREENS } from "constants";
import { palette } from "@theme/themes";
import eventEmitter from "@services/event-emitter";

interface ListReviewProps {
  id: string;
}

const ListReviewView = ({ id }: ListReviewProps) => {
  const [listData, setListData] = React.useState<any[]>();
  const [count, setCount] = React.useState(0);
  const paramsRequest = {
    limit: 5,
    podcast_id: id,
  };

  React.useEffect(() => {
    getListReview();
    eventEmitter.on("reload_review_audio", getListReview);
    return () => {
      eventEmitter.off("reload_review_audio", getListReview);
    };
  }, []);
  const getListReview = () => {
    ListReview(paramsRequest).then((res) => {
      if (!res.isError) {
        setListData(res.data);
        setCount(res.headers["x-total-count"]);
      }
    });
  };

  const showAllReview = () => {
    NavigationService.navigate(SCREENS.SHOW_ALL_REVIEW, { id: id });
  };

  return (
    <View style={styles.container}>
      <Text
        style={[CS.hnBold, { color: palette.white }]}
      >{`${translations.podcast.countReview(count)}`}</Text>
      <ScrollView
        horizontal
        style={styles.viewListReview}
        showsHorizontalScrollIndicator={false}
      >
        {listData?.map((item, index) => {
          return (
            <ItemReview
              item={item}
              key={index}
              bgColor="#222222"
              txtColor="white"
            />
          );
        })}
      </ScrollView>
      {count > 0 && (
        <TouchableOpacity onPress={showAllReview} style={styles.viewShowAll}>
          <Text style={styles.txtShowAll}>
            {translations.podcast.showAllReview}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default React.memo(ListReviewView);

const styles = StyleSheet.create({
  container: {},
  viewListReview: {},
  viewShowAll: {
    marginTop: 8,
    ...CS.center,
    minHeight: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.primary,
  },
  txtShowAll: {
    ...CS.hnBold,
    color: palette.primary,
  },
});
