import { translations } from "@localization";

export const SERVER = "wss://janus.socket.exam24h.com";
export interface TypedInputString {
  id?: string;
  name?: string;
}
export interface TypedInputBoolean extends TypedInputString {
  value?: boolean | string;
}
export const options = {
  onTime: [
    {
      id: "1",
      name: translations.evaluation.onTimeVal1,
      value: "Vào đúng giờ",
    },
    {
      id: "2",
      name: translations.evaluation.onTimeVal2,
      value: "Đi muộn",
    },
    {
      id: "3",
      name: translations.evaluation.onTimeVal3,
      value: "Nghỉ có phép",
    },
    {
      id: "4",
      name: translations.evaluation.onTimeVal4,
      value: "Nghỉ không phép",
    },
  ],
  attitude: [
    {
      id: "1",
      name: translations.evaluation.attitudePos,
      value: true,
    },
    {
      id: "0",
      name: translations.evaluation.attitudeNeg,
      value: false,
    },
  ],
  takeNotes: [
    {
      id: "1",
      name: translations.evaluation.takeNoteVal1,
      value: true,
    },
    {
      id: "0",
      name: translations.evaluation.takeNoteVal2,
      value: false,
    },
  ],
  doesHomework: [
    {
      id: "1",
      name: translations.evaluation.doesHomeworkVal1,
      value: true,
    },
    {
      id: "0",
      name: translations.evaluation.doesHomeworkVal2,
      value: false,
    },
  ],
};
