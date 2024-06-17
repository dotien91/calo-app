import { translations } from "@localization";
import DoanhThu from "../assets/images/utilities/DoanhThu.png";
import RutTien from "../assets/images/utilities/RutTien.png";
import CaiDatSTK from "../assets/images/utilities/CaiDatSTK.png";
import KhoaHoc from "../assets/images/utilities/KH.png";
import LichDay from "../assets/images/utilities/LichDay.png";
import Discount from "../assets/images/utilities/MaGiamGia.png";
import ChatHV from "../assets/images/utilities/ChatHV.png";
import QLClass from "../assets/images/utilities/QLClass.png";
import TuyChinh from "../assets/images/utilities/TuyChinhHoSo.png";
import QLChungChi from "../assets/images/utilities/QLChungChi.png";
import CLB from "../assets/images/utilities/CLB.png";
import Podcast from "../assets/images/utilities/Podcast.png";
import HuongDan from "../assets/images/utilities/HuongDan.png";
import BaoMat from "../assets/images/utilities/BaoMat.png";
import { SCREENS } from "constants";

export type itemContentType = {
  title: string;
  uri: string;
  onPress: () => void;
};
export type itemType = {
  textTitle: string;
  content: itemContentType[];
};

export const utilities = [
  {
    textTitle: translations.profileTeacher.finance,
    content: [
      {
        title: translations.profileTeacher.revenua,
        uri: DoanhThu,
        screen: SCREENS.AFFILIATE,
      },
      {
        title: translations.profileTeacher.withdraw,
        uri: RutTien,
        screen: SCREENS.WITHDRAW,
      },
      {
        title: translations.profileTeacher.setUpAccount,
        uri: CaiDatSTK,
        screen: SCREENS.BANK_LIST,
      },
    ],
  },
  {
    textTitle: translations.profileTeacher.course,
    content: [
      {
        title: translations.profileTeacher.myCourse,
        uri: KhoaHoc,
        screen: SCREENS.MY_COURES,
      },
      {
        title: translations.profileTeacher.schedule,
        screen: SCREENS.TEACHER_COURSES,
        uri: LichDay,
      },
      {
        title: translations.profileTeacher.discount,
        uri: Discount,
        screen: SCREENS.COUPON_LIST,
      },
      {
        title: translations.profileTeacher.chat,
        uri: ChatHV,
        screen: SCREENS.CHAT,
      },
      // {
      //   title: translations.profileTeacher.setTeaching,
      //   screen: (SCREENS.TEACHER_COURSES),
      //   uri: GioDay,
      // },
      {
        title: translations.profileTeacher.manageClass,
        screen: SCREENS.TEACHER_COURSES,
        uri: QLClass,
      },
    ],
  },
  {
    textTitle: translations.profileTeacher.teacherPage,
    content: [
      {
        title: translations.profileTeacher.customProfile,
        screen: SCREENS.EDIT_PROFILE,
        uri: TuyChinh,
      },
      {
        title: translations.profileTeacher.manageCerti,
        screen: SCREENS.MANAGE_CERTIFICATE,
        uri: QLChungChi,
      },
      {
        title: translations.profileTeacher.myClub,
        uri: CLB,
        screen: SCREENS.CLUB_SCREEN,
        param: {
          defaultIndex: 1,
        },
      },
      {
        title: translations.profileTeacher.myPodcast,
        uri: Podcast,
        screen: SCREENS.AUDIO_BOOK,
      },
    ],
  },
  {
    textTitle: translations.profileTeacher.guideUse,
    content: [
      {
        title: translations.profileTeacher.guide,
        uri: HuongDan,
        url: "https://docs.ikigaicoach.net",
      },
      {
        title: translations.profileTeacher.Security,
        uri: BaoMat,
        url: "https://docs.ikigaicoach.net/chinh-sach",
      },
    ],
  },
];
