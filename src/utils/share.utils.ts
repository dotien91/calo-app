/* eslint-disable camelcase */

import Share from "react-native-share";

export const sharePost = (post_slug: string) => {
  const shareOptions = {
    title: "post_slug",
    message: "Simple share with message",
    url: `https://google.com/${post_slug}`,
  };
  Share.open(shareOptions)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      err && console.log(err);
    });
};
