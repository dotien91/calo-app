import { requestPermission } from "./permission-helper";
import { PERMISSION } from "./system.constant";
import { openPicker } from "react-native-image-crop-picker";
import { launchImageLibrary } from "react-native-image-picker";

export const selectMedia = async ({ config, callback, croping = true }) => {
  const permission = await requestPermission(PERMISSION.permissionLibrary);

  if (permission === "blocked") {
    return;
  }
  if (permission !== "granted") {
    return;
  }
  if (croping) {
    openPicker({
      smartAlbums: [
        "Favorites",
        "Screenshots",
        "Generic",
        "AllHidden",
        "RecentlyAdded",
        "Imported",
        "LivePhotos",
        "Panoramas",
        "Bursts",
        "UserLibrary",
        "SyncedAlbum",
        "Regular",
      ],
      ...config,
    })
      .then(async (image) => {
        if (image) {
          callback?.(image);
        }
      })
      .catch(console.log)
      .finally(() => {});
    return;
  }
  launchImageLibrary({
    selectionLimit: 3,
    includeExtra: true,
    ...config,
  })
    .then((image) => {
      if (image.assets?.[0]) {
        callback?.(image.assets);
      }
    })
    .catch(console.log)
    .finally(() => {});
};
