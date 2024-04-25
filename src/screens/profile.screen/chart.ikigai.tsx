import * as React from "react";
import { View, StyleSheet, Text } from "react-native";
import { useIsFocused } from "@react-navigation/native";

import { palette } from "@theme/themes";
import CS from "@theme/styles";
import { translations } from "@localization";
import IconSvg from "assets/svg";
import { getMyCourse } from "@services/api/course.api";
import useStore from "@services/zustand/store";

const SMALLEST = 40;
const SMALL = 50;
const MEDIUM = 60;
const LARGE = 80;
const LARGEST = 100;
const ChartIkigai = () => {
  const userData = useStore((state) => state.userData);
  const [chart, setChart] = React.useState({
    health: 0,
    life: 0,
    business: 0,
    finance: 0,
  });

  const isFocus = useIsFocused();

  React.useEffect(() => {
    if (isFocus) {
      getListMyCourse();
    }
  }, [isFocus]);

  const getListMyCourse = () => {
    getMyCourse({
      auth_id: userData?._id,
    }).then((res) => {
      if (!res.isError) {
        const data = res.data;
        let health = 0;
        let life = 0;
        let business = 0;
        let finance = 0;
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
          const element = data[i];
          if (
            element.skills.filter((item) => item === "All skills").length > 0
          ) {
            health += 1;
            life += 1;
            business += 1;
            finance += 1;
            sum += 4;
          } else {
            if (element.skills.filter((item) => item === "Life").length > 0) {
              life += 1;
              sum += 1;
            }
            if (element.skills.filter((item) => item === "Health").length > 0) {
              health += 1;
              sum += 1;
            }
            if (
              element.skills.filter((item) => item === "Business").length > 0
            ) {
              business += 1;
              sum += 1;
            }
            if (
              element.skills.filter((item) => item === "Finance").length > 0
            ) {
              finance += 1;
              sum += 1;
            }
          }
        }
        if (sum > 0) {
          setChart({
            business: (business * 100) / sum,
            finance: (finance * 100) / sum,
            health: (health * 100) / sum,
            life: (life * 100) / sum,
          });
        }
        // console.log("sum", sum);
        // console.log("life", life);
        // console.log("finance", finance);
        // console.log("health", health);
        // console.log("business", business);
      }

      // console.log("res...", res);
    });

    // setChart({
    //   business: 49.5,
    //   finance: 10,
    //   health: 40.5,
    //   life: 0,
    // });
  };

  const getSize = (size: number) => {
    if (size >= 50) {
      return {
        view: { width: LARGEST, height: LARGEST, borderRadius: LARGEST / 2 },
        size: { fontSize: LARGEST / 5 },
      };
    } else {
      if (size >= 30) {
        return {
          view: { width: LARGE, height: LARGE, borderRadius: LARGE / 2 },
          size: { fontSize: LARGE / 5 },
        };
      } else {
        if (size >= 20) {
          return {
            view: { width: MEDIUM, height: MEDIUM, borderRadius: MEDIUM / 2 },
            size: { fontSize: MEDIUM / 5 },
          };
        } else {
          if (size > 0) {
            return {
              view: { width: SMALL, height: SMALL, borderRadius: SMALL / 2 },
              size: { fontSize: SMALL / 5 },
            };
          } else {
            return {
              view: {
                width: SMALLEST,
                height: SMALLEST,
                borderRadius: SMALLEST / 2,
              },
              size: { fontSize: SMALLEST / 5 },
            };
          }
        }
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.textYourScore}>{translations.task.yourscore}</Text>

      <View style={styles.viewHorizontal}>
        <View style={[CS.flex1, styles.viewLife]}>
          <View style={[styles.bgLife, getSize(chart.life).view]}>
            <Text style={[styles.txt, getSize(chart.life).size]}>
              {translations.course.life}
            </Text>
          </View>
        </View>
        <View style={[CS.flex1, styles.viewHealth]}>
          <View style={[styles.bgHealth, getSize(chart.health).view]}>
            <Text style={[styles.txt, getSize(chart.health).size]}>
              {translations.course.health}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.viewHorizontal}>
        <View style={[CS.flex1, styles.viewFinance]}>
          <View style={[styles.bgFinance, getSize(chart.finance).view]}>
            <Text style={[styles.txt, getSize(chart.finance).size]}>
              {translations.course.finance}
            </Text>
          </View>
        </View>
        <View style={[CS.flex1, styles.viewBusiness]}>
          <View style={[styles.bgBusiness, getSize(chart.business).view]}>
            <Text style={[styles.txt, getSize(chart.business).size]}>
              {translations.course.business}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.viewPowered}>
        <Text style={styles.textPoweredBy}>{translations.task.powered}</Text>
        <IconSvg name="logoIkigaiCoach" size={32} color={palette.primary} />
      </View>
    </View>
  );
};

export default ChartIkigai;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  viewHorizontal: {
    minHeight: 80,
    flexDirection: "row",
  },
  viewLife: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  bgLife: {
    backgroundColor: palette.primary,
    ...CS.center,
  },
  viewHealth: {
    justifyContent: "flex-end",
    alignItems: "flex-start",
  },
  bgHealth: {
    backgroundColor: palette.green,
    ...CS.center,
  },
  viewFinance: {
    justifyContent: "flex-start",
    alignItems: "flex-end",
  },
  bgFinance: {
    backgroundColor: palette.blue,
    ...CS.center,
  },
  viewBusiness: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  bgBusiness: {
    backgroundColor: palette.yellow,
    ...CS.center,
  },
  txt: {
    ...CS.hnSemiBold,
    color: palette.white,
    fontSize: 6,
    textAlign: "center",
  },
  textYourScore: {
    ...CS.hnSemiBold,
    color: palette.text,
    marginBottom: 12,
  },
  viewPowered: {
    ...CS.flexStart,
    marginTop: 16,
  },
  textPoweredBy: {
    ...CS.hnMedium,
    fontSize: 10,
    color: palette.textOpacity4,
    marginRight: 4,
  },
});
