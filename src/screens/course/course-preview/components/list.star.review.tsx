import StarRate from "@screens/course/components/star.rate.view";
import CS from "@theme/styles";
import { palette } from "@theme/themes";
import { ICourseReview } from "models/course.model";
import * as React from "react";
import { Text, View, StyleSheet } from "react-native";

interface ListStarReviewProps {
  data: ICourseReview[];
}

const ListStarReview = ({ data }: ListStarReviewProps) => {
  const [listStar, setListStar] = React.useState({
    oneStar: 0,
    twoStar: 0,
    threeStar: 0,
    fourStar: 0,
    fiveStar: 0,
    sum: 1,
  });

  React.useEffect(() => {
    if (data.length > 0) {
      let one = 0;
      let two = 0;
      let three = 0;
      let four = 0;
      let five = 0;

      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        switch (element.rating) {
          case 1:
            one++;
            break;
          case 2:
            two++;
            break;
          case 3:
            three++;
            break;
          case 4:
            four++;
            break;
          case 5:
            five++;
            break;

          default:
            break;
        }
      }
      setListStar({
        oneStar: (one / data.length) * 100,
        twoStar: (two / data.length) * 100,
        threeStar: (three / data.length) * 100,
        fourStar: (four / data.length) * 100,
        fiveStar: (five / data.length) * 100,
        sum: data.length,
      });
    }
  }, [data]);
  return (
    <View style={styles.container}>
      <ItemStarPre star={5} per={listStar.fiveStar} />
      <ItemStarPre star={4} per={listStar.fourStar} />
      <ItemStarPre star={3} per={listStar.threeStar} />
      <ItemStarPre star={2} per={listStar.twoStar} />
      <ItemStarPre star={1} per={listStar.oneStar} />
    </View>
  );
};

const ItemStarPre = ({ star, per }: { star: number; per: number }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        height: 22,
        alignItems: "center",
        backgroundColor: palette.white,
      }}
    >
      <View
        style={{
          flex: 1,
          height: 8,
          borderRadius: 4,
          flexDirection: "row",
          backgroundColor: palette.background2,
        }}
      >
        <View
          style={{
            flex: per,
            height: 8,
            backgroundColor: palette.primarySub,
            borderRadius: 4,
          }}
        />
        <View style={{ flex: 100 - per }} />
      </View>
      <StarRate number={star} size={16} />
      <Text style={{ ...CS.hnRegular, fontSize: 12, width: 30, marginLeft: 4 }}>
        {per.toFixed(0)}%
      </Text>
    </View>
  );
};

export default ListStarReview;

const styles = StyleSheet.create({
  container: {},
});
