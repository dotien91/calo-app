/* eslint-disable camelcase */

import { translations } from "@localization";
import { postShare } from "@services/api/post.api";
import Share from "react-native-share";

const BASEURL = "https://ikigai.vn";

export const sharePost = (post_slug: string) => {
  const shareOptions = {
    title: translations.post.share,
    message: `${translations.post.sharePost} ${BASEURL}/post/detail/${post_slug}`,
  };
  Share.open(shareOptions)
    .then(() => {
      postShare({ community_id: post_slug });
    })
    .catch((err) => {
      err && console.log(err);
    });
};

export const shareProfile = (profileId: string) => {
  console.log("profileId", profileId);
  const shareOptions = {
    title: translations.post.share,
    message: `${translations.profile.shareProfile} ${BASEURL}/user/detail/${profileId}`,
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
    title: translations.post.share,
    message: `${translations.course.shareThisCourse} ${BASEURL}/course/detail/${courseId}`,
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
    message: translations.post.shareCode(code),
  };
  Share.open(shareOptions)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      err && console.log(err);
    });
};
export const shareAudio = (link: string) => {
  const shareOptions = {
    title: translations.post.share,
    message: translations.audio.shareAudio(link),
  };
  Share.open(shareOptions)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      err && console.log(err);
    });
};
