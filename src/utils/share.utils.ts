/* eslint-disable camelcase */

import { BASEURL } from "@services/api/api";
import Share from "react-native-share";

export const sharePost = (post_slug: string) => {
  const shareOptions = {
    title: "post_slug",
    message: "Simple share with message",
    url: `${BASEURL}/post-detail${post_slug}`,
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
  const shareOptions = {
    title: "post_slug",
    message: "Simple share with message",
    url: `${BASEURL}/profile?id=${profileId}`,
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
    title: "share course",
    message: "Simple share with message",
    url: `${BASEURL}/profile?id=${courseId}`,
  };
  Share.open(shareOptions)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      err && console.log(err);
    });
};
