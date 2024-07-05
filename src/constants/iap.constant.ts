import { Platform } from "react-native";

export const priceIds = [
  { id: "com.course.tier1", label: "99,000", value: 99000 },
  { id: "com.courseonline.tier2", label: "199,000", value: 199000 },
  { id: "com.course.tier4", label: "249,000", value: 249000 },
  { id: "com.course.tier5", label: "299,000", value: 299000 },
  { id: "com.course.tier6", label: "399,000", value: 399000 },
  { id: "com.course.tier7", label: "499,000", value: 499000 },
  { id: "com.course.tier8", label: "599,000", value: 599000 },
  { id: "com.course.tier9", label: "699,000", value: 699000 },
  { id: "com.course.tier10", label: "799,000", value: 799000 },
  { id: "com.course.tier11", label: "999,000", value: 999000 },
  { id: "com.course.tier12", label: "1,999,000", value: 1999000 },
  { id: "com.course.tier13", label: "2,499,000", value: 2499000 },
  // { id: "com.course.tier14", label: "3,999,000", value: 3999000 },
  // { id: "com.course.tier15", label: "4,999,000", value: 4999000 },
  // { id: "com.course.tier16", label: "9,999,000", value: 9999000 },
  // { id: "com.course.tier17", label: "18,999,000", value: 18999000 },
  // { id: "com.course.tier18", label: "26,999,000", value: 26999000 },
];


export const durationCall11List = [
  { label: "0.5h", value: "0.5" },
  { label: "1h", value: "1" },
  { label: "2h", value: "2" },
];

export const priceIdsLiveStream = [
  { id: undefined, label: "Miễn phí", value: 0 },
  { id: "com.coach.livestream.tier1", label: "39,000", value: 39000 },
  { id: "com.coach.livestream.tier2", label: "99,000", value: 99000 },
  { id: "com.coach.livestream.tier3", label: "299,000", value: 299000 },
  { id: "com.coach.livestream.tier4", label: "399,000", value: 399000 },
  { id: "com.coach.livestream.tier5", label: "499,000", value: 499000 },
];

export const subscriptionIds = Platform.select({
  ios: () => [
    // { id: "com.coach.podcasttest", label: "39,000", value: 39000 },
    { id: "com.coach.podcasttest2", label: "39,000", value: 39000 },
    // { id: "com.coach.podcasttest3", label: "59,000", value: 59000 },
  ],
  android: () => [
    // { id: "com.coach.podcasttest", label: "39,000", value: 39000 },
    { id: "com.coach.podcasttest3", label: "39,000", value: 39000 },
    // { id: "com.coach.podcasttest3", label: "59,000", value: 59000 },
  ],
});
export const priceIdSubscription = {
  id: "com.coach.livestream.tier1",
  label: "39,000",
  value: 39000,
};
