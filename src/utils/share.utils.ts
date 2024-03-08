/* eslint-disable camelcase */

import { translations } from "@localization";
import Share from "react-native-share";

const BASEURL = "https://ieltshunter.io";

export const sharePost = (post_slug: string) => {
  const shareOptions = {
    title: translations.post.share,
    url: `${BASEURL}/post/detail/${post_slug}`,
  };
  Share.open(shareOptions)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      err && console.log(err);
    });
};

export const shareProfile = (profileId: string) => {
  console.log("profileId", profileId);
  const shareOptions = {
    title: translations.profile.shareProfile,
    url: `${BASEURL}/user/detail/${profileId}`,
  };
  Share.open(shareOptions)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      err && console.log(err);
    });
};
export const shareCourse = (courseId: string) => {
  const shareOptions = {
    title: translations.course.shareThisCourse,
    url: `${BASEURL}/course/detail/${courseId}`,
  };
  Share.open(shareOptions)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      err && console.log(err);
    });
};
export const shareCodeInvite = (code: string) => {
  const shareOptions = {
    title: translations.post.share,
    message: `${code}`,
  };
  Share.open(shareOptions)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      err && console.log(err);
    });
};
