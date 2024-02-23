export const CLIENT_ID = "b3f69644-d654-4858-9680-f99d0f6e2d15";
export const API_KEY = "603f636e-5069-4ad8-8887-53af8cb75bb1";
import axios from "axios";

export const getNameHolder = (data: { bin: string; accountNumber: string }) => {
  const config = {
    method: "post",
    url: "https://api.vietqr.io/v2/lookup",
    headers: {
      "x-client-id": CLIENT_ID,
      "x-api-key": API_KEY,
      "Content-Type": "application/json",
    },
    data,
  };
  return new Promise<void>((resolve, reject) => {
    axios(config)
      .then(function (response) {
        console.log("getNameHolder", JSON.stringify(response.data));
        resolve(response);
      })
      .catch(function (error) {
        console.log("getNameHolder", error);
        reject(error);
      });
  });
};
