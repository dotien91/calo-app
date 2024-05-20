/* eslint-disable camelcase */

import { translations } from "@localization";
import { postShare } from "@services/api/post.api";
import Share from "react-native-share";
import dynamicLinks from "@react-native-firebase/dynamic-links";

const BASEURL = "https://ikigai.vn";

const createDynamicLink = async (str: string) => {
  console.log(str);
  try {
    const link = await dynamicLinks().buildShortLink(
      {
        link: str, // Your deep link URL
        domainUriPrefix: "https://ikigaicoach.page.link",
        ios: {
          bundleId: "com.ikigroup.ikicoach",
          appStoreId: "6484263984",
        },
        android: {
          packageName: "com.ikigroup.ikigaicoach",
          minimumVersion: "1",
        },
      },
      "SHORT",
    ); // or 'SHORT' if you want a short link

    console.log("Generated Dynamic Link:", link);
    return link;
    // Use the generated dynamic link for sharing or redirection
  } catch (error) {
    console.error("Error generating dynamic link:", error);
    return null;
  }
};

export const sharePost = async (post_slug: string) => {
  const linkDynamic = await createDynamicLink(
    // slug,
    `${BASEURL}/${post_slug}`,
  );
  // console.log("linkDynamic...", linkDynamic);
  if (linkDynamic) {
    const shareOptions = {
      title: translations.post.share,
      message: `${translations.post.sharePost} ${linkDynamic}`,
    };
    Share.open(shareOptions)
      .then(() => {
        postShare({ community_id: post_slug });
      })
      .catch((err) => {
        err && console.log(err);
      });
  }
};

export const shareProfile = async (profileId: string) => {
  const linkDynamic = await createDynamicLink(
    // slug,
    `${BASEURL}/${profileId}`,
  );
  const shareOptions = {
    title: translations.post.share,
    // message: `${translations.profile.shareProfile} ${BASEURL}/user/detail/${profileId}`,
    message: `${translations.profile.shareProfile} ${linkDynamic}`,
  };
  Share.open(shareOptions)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      err && console.log(err);
    });
};
export const shareCourse = async (courseId: string, courseName?: string) => {
  const linkDynamic = await createDynamicLink(
    // slug,
    `${BASEURL}/${courseId}`,
  );
  const shareOptions = {
    title: translations.post.share,
    message: `${translations.course.shareThisCourse(
      courseName || "",
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
