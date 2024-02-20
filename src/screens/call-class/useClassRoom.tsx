import React from "react";

import Janus from "./service/janus";
import { SERVER } from "constants/class.room.constant";

const server = SERVER;
let janus = null;
let sfutest = null;
let started = false;

Janus.init({
  debug: "all",
  callback: function () {
    if (started) return;
    started = true;
  },
});

export const useClassRoom = ({ roomId }: { roomId: string }) => {
  React.useEffect(() => {
    console.log("65c0ab03d7d7ab3a76de4b5b", roomId);
    janusStart();
    return () => {
      !!janus && janus.destroy();
    };
  }, []);

  const janusStart = () => {
    janus = new Janus({
      server: server,
      success: () => {
        janus.attach({
          plugin: "janus.plugin.videoroom",
          success: (pluginHandle) => {
            console.log(
              "pluginHandlepluginHandle",
              pluginHandle,
              pluginHandle.webrtcStuff,
            );
            sfutest = pluginHandle;

            const create = {
              request: "create",
              room: roomId,
              admin_key: "supersecret",
              publishers: 20,
              audiolevel_ext: true,
              audiolevel_event: true,
              audio_active_packets: 50,
              audio_level_average: 40,
            };
            sfutest.send({
              message: create,
              success: function (data) {
                console.log("dataaaaaaaaa", data);
              },
            });
          },
        });
      },
    });
  };
};
