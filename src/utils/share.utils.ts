/* eslint-disable camelcase */

import { translations } from "@localization";
// import { postShare } from "@services/api/post.api";
import Share from "react-native-share";
import dynamicLinks, { firebase } from "@react-native-firebase/dynamic-links";

const BASEURL = "https://ieltshunter.io";

const createDynamicLink = async (str: string) => {
  try {
    const link = await dynamicLinks().buildShortLink(
      {
        link: str, // Your deep link URL
        domainUriPrefix: "https://ikes.page.link",
        ios: {
          bundleId: "com.app.ielts.ikes",
          appStoreId: "6740073425",
        },
        android: {
          packageName: "com.app.ielts.ikes",
          minimumVersion: "1",
        },
      },
      firebase.dynamicLinks.ShortLinkType.SHORT,
    );

    console.log("Generated Dynamic Link:", link);
    return link;
  } catch (error) {
    console.error("Error generating dynamic link:", error);
    return null;
  }
};

export const sharePost = (post_slug: string) => {
  const shareOptions = {
    title: translations.post.share,
    message: translations.post.sharePost,
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
  const linkProfile = `${BASEURL}/user/detail/${profileId}`;
  const shareOptions = {
    title: translations.post.share,
    // message: `${translations.profile.shareProfile} ${BASEURL}/user/detail/${profileId}`
    message: `${translations.profile.shareProfile} ${linkProfile}`,
  };
  Share.open(shareOptions)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      err && console.log(err);
    });
};
export const shareCourse = async (courseId: string, courseName: string) => {
  const linkDynamic = await createDynamicLink(
    // slug,
    `${BASEURL}/${courseId}`,
  );
  const shareOptions = {
    title: translations.post.share,
    message: `${translations.course.shareThisCourse(
      courseName,
    )} ${linkDynamic}`,
    // message: `${translations.course.shareThisCourse} ${BASEURL}/course/detail/${courseId}`,
  };
  Share.open(shareOptions)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      err && console.log(err);
    });
};
export const shareCodeInvite = async (code: string) => {
  const linkDynamic =
    (await createDynamicLink(
      // slug,
      `${BASEURL}/${code}`,
    )) || "";
  const shareOptions = {
    title: translations.post.share,
    message: translations.post.shareCode(linkDynamic),
    // message: translations.post.shareCode(code),
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
