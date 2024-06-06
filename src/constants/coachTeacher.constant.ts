import { translations } from "@localization";
import DoanhThu from "../assets/images/utilities/DoanhThu.png";
import RutTien from "../assets/images/utilities/RutTien.png";
import CaiDatSTK from "../assets/images/utilities/CaiDatSTK.png";
import KhoaHoc from "../assets/images/utilities/KH.png";
import LichDay from "../assets/images/utilities/LichDay.png";
import Discount from "../assets/images/utilities/MaGiamGia.png";
import ChatHV from "../assets/images/utilities/ChatHV.png";
import GioDay from "../assets/images/utilities/GioDay.png";
import QLClass from "../assets/images/utilities/QLClass.png";
import TuyChinh from "../assets/images/utilities/TuyChinhHoSo.png";
import QLChungChi from "../assets/images/utilities/QLChungChi.png";
import CLB from "../assets/images/utilities/CLB.png";
import Podcast from "../assets/images/utilities/Podcast.png";
import HuongDan from "../assets/images/utilities/HuongDan.png";
import BaoMat from "../assets/images/utilities/BaoMat.png";
import * as NavigationService from "react-navigation-helpers";
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
      },
      {
        title: translations.profileTeacher.withdraw,
        uri: RutTien,
      },
      {
        title: translations.profileTeacher.setUpAccount,
        uri: CaiDatSTK,
      },
    ],
  },
  {
    textTitle: translations.profileTeacher.course,
    content: [
      {
        title: translations.profileTeacher.myCourse,
        uri: KhoaHoc,
        onPress: () => NavigationService.navigate(SCREENS.MY_COURES),
      },
      {
        title: translations.profileTeacher.schedule,
        uri: LichDay,
      },
      {
        title: translations.profileTeacher.discount,
        uri: Discount,
      },
      {
        title: translations.profileTeacher.chat,
        uri: ChatHV,
        onPress: () => NavigationService.navigate(SCREENS.CHAT),
      },
      {
        title: translations.profileTeacher.setTeaching,
        uri: GioDay,
      },
      {
        title: translations.profileTeacher.manageClass,
        uri: QLClass,
      },
    ],
  },
  {
    textTitle: translations.profileTeacher.teacherPage,
    content: [
      {
        title: translations.profileTeacher.customProfile,
        uri: TuyChinh,
      },
      {
        title: translations.profileTeacher.manageCerti,
        uri: QLChungChi,
      },
      {
        title: translations.profileTeacher.myClub,
        uri: CLB,
      },
      {
        title: translations.profileTeacher.myPodcast,
        uri: Podcast,
      },
    ],
  },
  {
    textTitle: translations.profileTeacher.guideUse,
    content: [
      {
        title: translations.profileTeacher.guide,
        uri: HuongDan,
      },
      {
        title: translations.profileTeacher.Security,
        uri: BaoMat,
      },
    ],
  },
];
