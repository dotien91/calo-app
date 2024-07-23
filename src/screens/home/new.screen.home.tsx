import { useUserHook } from "@helpers/hooks/useUserHook";
import CS from "@theme/styles";
import React, { useEffect } from "react";
import { View, TouchableOpacity } from "react-native";
import ListPostNew from "./new.list.post";
import { palette } from "@theme/themes";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import { navigate } from "@helpers/navigation.helper";
import { SCREENS } from "constants";
import { useActiveTrack } from "react-native-track-player";
import { useLastActiveTrack } from "@screens/audio/hook/useLastActiveTrack";
import useStore from "@services/zustand/store";
import * as NavigationService from "react-navigation-helpers";

// import useStore from "@services/zustand/store";
// import { EnumModalContentType, EnumStyleModalType, showSuperModal } from "@helpers/super.modal.helper";
// const params = {
//   courseData: {
//     type: "Call 1-1",
//     user_id: {
//       is_creator: false,
//       _id: "666c162294f133507f9c87da",
//       user_login: "teacher2_gmail.com",
//       user_email: "teacher2@gmail.com",
//       user_address: "",
//       user_avatar:
//         "https://dev.api.ikigai.ikigroup.vn/api/nature/9_optimized.png",
//       user_avatar_thumbnail:
//         "https://dev.api.ikigai.ikigroup.vn/api/nature/9_optimized.png",
//       public_sound: "",
//       user_cover: "https://dev.api.ikigai.ikigroup.vn/api/nature/a12.png",
//       user_password:
//         "06c06b184179e829114f8d45fe171122dc02db5ea1818816a712d97a4c85c0bc",
//       display_name: "Teacher2",
//       user_role: "teacher",
//       bio: "",
//       description: "",
//       country: "VN",
//       verify_code: "",
//       block_users: [],
//       follow_users: ["666ffe3f715cee894e6f0a71"],
//       disagree_users: [],
//       user_status: 1,
//       phone_number: "",
//       phone_session: "",
//       is_validated_phone: false,
//       official_status: false,
//       links: [],
//       is_native: false,
//       is_verified: false,
//       organization_id: null,
//       rating: 0,
//       timezone: "Asia/Bangkok",
//       default_language: "",
//       ignore_followers: [],
//       point: 7,
//       point_exchange: 7,
//       level: 1,
//       invitation_code: "KUHQZ",
//       current_coin: 0,
//       current_token: 7020000,
//       taught_time: 10,
//       is_pending_to_became_teacher: false,
//       skills: [],
//       user_payment_address: [],
//       last_active: "2024-06-20T08:33:59.000Z",
//       certificates: [],
//       educations: [],
//       createdAt: "2024-06-14T10:06:26.472Z",
//       updatedAt: "2024-06-24T17:55:00.365Z",
//       __v: 0,
//       user_active: 0,
//     },
//   },
//   courseRoom: {
//     roomId: "667002fd570c57a537c7ad2e",
//     chatRoomId: "66700320570c57a537c7ad80",
//   },
//   isMakeCall: false,
//   event: {
//     title: "Call 1-1 với giáo viên Teacher2",
//     start: "2024-06-24T18:00:00.000Z",
//     end: "2024-06-24T18:30:00.000Z",
//     color: "#2BC456",
//     type: "Call 1-1",
//     student_name: "User7",
//     student_id: {
//       is_creator: false,
//       _id: "666ffe3f715cee894e6f0a71",
//       user_login: "user7_gmail.com",
//       user_email: "user7@gmail.com",
//       user_address: "",
//       user_avatar:
//         "https://dev.api.ikigai.ikigroup.vn/api/nature/14_optimized.png",
//       user_avatar_thumbnail:
//         "https://dev.api.ikigai.ikigroup.vn/api/nature/14_optimized.png",
//       public_sound: "",
//       user_cover: "https://dev.api.ikigai.ikigroup.vn/api/nature/a19.png",
//       user_password:
//         "06c06b184179e829114f8d45fe171122dc02db5ea1818816a712d97a4c85c0bc",
//       display_name: "User7",
//       user_role: "user",
//       bio: "",
//       description: "",
//       country: "VN",
//       verify_code: "",
//       block_users: [],
//       follow_users: ["666c162294f133507f9c87da", "6673d3eea639d99284320ba3"],
//       disagree_users: [],
//       user_status: 1,
//       phone_number: "",
//       phone_session: "",
//       is_validated_phone: false,
//       official_status: false,
//       links: [],
//       is_native: false,
//       is_verified: false,
//       organization_id: null,
//       rating: 0,
//       timezone: "Asia/Bangkok",
//       default_language: "",
//       ignore_followers: [],
//       point: 239,
//       point_exchange: 239,
//       level: 3,
//       invitation_code: "HLZBT",
//       current_coin: 0,
//       current_token: 0,
//       taught_time: 0,
//       is_pending_to_became_teacher: false,
//       skills: [],
//       user_payment_address: [],
//       last_active: "2024-06-20T07:50:20.000Z",
//       certificates: [],
//       educations: [],
//       createdAt: "2024-06-17T09:13:35.353Z",
//       updatedAt: "2024-06-20T07:50:20.887Z",
//       __v: 0,
//       user_active: 0,
//     },
//     teacher_name: "Teacher2",
//     teacher_id: {
//       is_creator: false,
//       _id: "666c162294f133507f9c87da",
//       user_login: "teacher2_gmail.com",
//       user_email: "teacher2@gmail.com",
//       user_address: "",
//       user_avatar:
//         "https://dev.api.ikigai.ikigroup.vn/api/nature/9_optimized.png",
//       user_avatar_thumbnail:
//         "https://dev.api.ikigai.ikigroup.vn/api/nature/9_optimized.png",
//       public_sound: "",
//       user_cover: "https://dev.api.ikigai.ikigroup.vn/api/nature/a12.png",
//       user_password:
//         "06c06b184179e829114f8d45fe171122dc02db5ea1818816a712d97a4c85c0bc",
//       display_name: "Teacher2",
//       user_role: "teacher",
//       bio: "",
//       description: "",
//       country: "VN",
//       verify_code: "",
//       block_users: [],
//       follow_users: ["666ffe3f715cee894e6f0a71"],
//       disagree_users: [],
//       user_status: 1,
//       phone_number: "",
//       phone_session: "",
//       is_validated_phone: false,
//       official_status: false,
//       links: [],
//       is_native: false,
//       is_verified: false,
//       organization_id: null,
//       rating: 0,
//       timezone: "Asia/Bangkok",
//       default_language: "",
//       ignore_followers: [],
//       point: 7,
//       point_exchange: 7,
//       level: 1,
//       invitation_code: "KUHQZ",
//       current_coin: 0,
//       current_token: 7020000,
//       taught_time: 10,
//       is_pending_to_became_teacher: false,
//       skills: [],
//       user_payment_address: [],
//       last_active: "2024-06-20T08:33:59.000Z",
//       certificates: [],
//       educations: [],
//       createdAt: "2024-06-14T10:06:26.472Z",
//       updatedAt: "2024-06-24T17:55:00.365Z",
//       __v: 0,
//       user_active: 0,
//     },
//     partner_id: {
//       is_creator: false,
//       _id: "666c162294f133507f9c87da",
//       user_login: "teacher2_gmail.com",
//       user_email: "teacher2@gmail.com",
//       user_address: "",
//       user_avatar:
//         "https://dev.api.ikigai.ikigroup.vn/api/nature/9_optimized.png",
//       user_avatar_thumbnail:
//         "https://dev.api.ikigai.ikigroup.vn/api/nature/9_optimized.png",
//       public_sound: "",
//       user_cover: "https://dev.api.ikigai.ikigroup.vn/api/nature/a12.png",
//       user_password:
//         "06c06b184179e829114f8d45fe171122dc02db5ea1818816a712d97a4c85c0bc",
//       display_name: "Teacher2",
//       user_role: "teacher",
//       bio: "",
//       description: "",
//       country: "VN",
//       verify_code: "",
//       block_users: [],
//       follow_users: ["666ffe3f715cee894e6f0a71"],
//       disagree_users: [],
//       user_status: 1,
//       phone_number: "",
//       phone_session: "",
//       is_validated_phone: false,
//       official_status: false,
//       links: [],
//       is_native: false,
//       is_verified: false,
//       organization_id: null,
//       rating: 0,
//       timezone: "Asia/Bangkok",
//       default_language: "",
//       ignore_followers: [],
//       point: 7,
//       point_exchange: 7,
//       level: 1,
//       invitation_code: "KUHQZ",
//       current_coin: 0,
//       current_token: 7020000,
//       taught_time: 10,
//       is_pending_to_became_teacher: false,
//       skills: [],
//       user_payment_address: [],
//       last_active: "2024-06-20T08:33:59.000Z",
//       certificates: [],
//       educations: [],
//       createdAt: "2024-06-14T10:06:26.472Z",
//       updatedAt: "2024-06-24T17:55:00.365Z",
//       __v: 0,
//       user_active: 0,
//     },
//     partner_name: "Teacher2",
//     plan_id: "667002fd570c57a537c7ad2e",
//     course_name: "Khoa hoc call 11 Dangth",
//   },
// };

// const params2 = {
//   courseData: {
//     type: "Call 1-1",
//     user_id: {
//       is_creator: false,
//       _id: "666c162294f133507f9c87da",
//       user_login: "teacher2_gmail.com",
//       user_email: "teacher2@gmail.com",
//       user_address: "",
//       user_avatar:
//         "https://dev.api.ikigai.ikigroup.vn/api/nature/9_optimized.png",
//       user_avatar_thumbnail:
//         "https://dev.api.ikigai.ikigroup.vn/api/nature/9_optimized.png",
//       public_sound: "",
//       user_cover: "https://dev.api.ikigai.ikigroup.vn/api/nature/a12.png",
//       user_password:
//         "06c06b184179e829114f8d45fe171122dc02db5ea1818816a712d97a4c85c0bc",
//       display_name: "Teacher2",
//       user_role: "teacher",
//       bio: "",
//       description: "",
//       country: "VN",
//       verify_code: "",
//       block_users: [],
//       follow_users: ["666ffe3f715cee894e6f0a71"],
//       disagree_users: [],
//       user_status: 1,
//       phone_number: "",
//       phone_session: "",
//       is_validated_phone: false,
//       official_status: false,
//       links: [],
//       is_native: false,
//       is_verified: false,
//       organization_id: null,
//       rating: 0,
//       timezone: "Asia/Bangkok",
//       default_language: "",
//       ignore_followers: [],
//       point: 7,
//       point_exchange: 7,
//       level: 1,
//       invitation_code: "KUHQZ",
//       current_coin: 0,
//       current_token: 7020000,
//       taught_time: 10,
//       is_pending_to_became_teacher: false,
//       skills: [],
//       user_payment_address: [],
//       last_active: "2024-06-20T08:33:59.000Z",
//       certificates: [],
//       educations: [],
//       createdAt: "2024-06-14T10:06:26.472Z",
//       updatedAt: "2024-06-24T17:55:00.365Z",
//       __v: 0,
//       user_active: 0,
//     },
//   },
//   courseRoom: {
//     roomId: "667002fd570c57a537c7ad2e",
//     chatRoomId: "66700320570c57a537c7ad80",
//   },
//   isMakeCall: true,
//   event: {
//     title: "Call 1-1 with student User7",
//     start: "2024-06-24T18:00:00.000Z",
//     end: "2024-06-24T18:30:00.000Z",
//     color: "#2BC456",
//     type: "Call 1-1",
//     student_name: "User7",
//     student_id: {
//       is_creator: false,
//       _id: "666ffe3f715cee894e6f0a71",
//       user_login: "user7_gmail.com",
//       user_email: "user7@gmail.com",
//       user_address: "",
//       user_avatar:
//         "https://dev.api.ikigai.ikigroup.vn/api/nature/14_optimized.png",
//       user_avatar_thumbnail:
//         "https://dev.api.ikigai.ikigroup.vn/api/nature/14_optimized.png",
//       public_sound: "",
//       user_cover: "https://dev.api.ikigai.ikigroup.vn/api/nature/a19.png",
//       user_password:
//         "06c06b184179e829114f8d45fe171122dc02db5ea1818816a712d97a4c85c0bc",
//       display_name: "User7",
//       user_role: "user",
//       bio: "",
//       description: "",
//       country: "VN",
//       verify_code: "",
//       block_users: [],
//       follow_users: ["666c162294f133507f9c87da", "6673d3eea639d99284320ba3"],
//       disagree_users: [],
//       user_status: 1,
//       phone_number: "",
//       phone_session: "",
//       is_validated_phone: false,
//       official_status: false,
//       links: [],
//       is_native: false,
//       is_verified: false,
//       organization_id: null,
//       rating: 0,
//       timezone: "Asia/Bangkok",
//       default_language: "",
//       ignore_followers: [],
//       point: 239,
//       point_exchange: 239,
//       level: 3,
//       invitation_code: "HLZBT",
//       current_coin: 0,
//       current_token: 0,
//       taught_time: 0,
//       is_pending_to_became_teacher: false,
//       skills: [],
//       user_payment_address: [],
//       last_active: "2024-06-20T07:50:20.000Z",
//       certificates: [],
//       educations: [],
//       createdAt: "2024-06-17T09:13:35.353Z",
//       updatedAt: "2024-06-20T07:50:20.887Z",
//       __v: 0,
//       user_active: 0,
//     },
//     teacher_name: "Teacher2",
//     partner_id: {
//       is_creator: false,
//       _id: "666ffe3f715cee894e6f0a71",
//       user_login: "user7_gmail.com",
//       user_email: "user7@gmail.com",
//       user_address: "",
//       user_avatar:
//         "https://dev.api.ikigai.ikigroup.vn/api/nature/14_optimized.png",
//       user_avatar_thumbnail:
//         "https://dev.api.ikigai.ikigroup.vn/api/nature/14_optimized.png",
//       public_sound: "",
//       user_cover: "https://dev.api.ikigai.ikigroup.vn/api/nature/a19.png",
//       user_password:
//         "06c06b184179e829114f8d45fe171122dc02db5ea1818816a712d97a4c85c0bc",
//       display_name: "User7",
//       user_role: "user",
//       bio: "",
//       description: "",
//       country: "VN",
//       verify_code: "",
//       block_users: [],
//       follow_users: ["666c162294f133507f9c87da", "6673d3eea639d99284320ba3"],
//       disagree_users: [],
//       user_status: 1,
//       phone_number: "",
//       phone_session: "",
//       is_validated_phone: false,
//       official_status: false,
//       links: [],
//       is_native: false,
//       is_verified: false,
//       organization_id: null,
//       rating: 0,
//       timezone: "Asia/Bangkok",
//       default_language: "",
//       ignore_followers: [],
//       point: 239,
//       point_exchange: 239,
//       level: 3,
//       invitation_code: "HLZBT",
//       current_coin: 0,
//       current_token: 0,
//       taught_time: 0,
//       is_pending_to_became_teacher: false,
//       skills: [],
//       user_payment_address: [],
//       last_active: "2024-06-20T07:50:20.000Z",
//       certificates: [],
//       educations: [],
//       createdAt: "2024-06-17T09:13:35.353Z",
//       updatedAt: "2024-06-20T07:50:20.887Z",
//       __v: 0,
//       user_active: 0,
//     },
//     partner_name: "User7",
//     teacher_id: {
//       is_creator: false,
//       _id: "666c162294f133507f9c87da",
//       user_login: "teacher2_gmail.com",
//       user_email: "teacher2@gmail.com",
//       user_address: "",
//       user_avatar:
//         "https://dev.api.ikigai.ikigroup.vn/api/nature/9_optimized.png",
//       user_avatar_thumbnail:
//         "https://dev.api.ikigai.ikigroup.vn/api/nature/9_optimized.png",
//       public_sound: "",
//       user_cover: "https://dev.api.ikigai.ikigroup.vn/api/nature/a12.png",
//       user_password:
//         "06c06b184179e829114f8d45fe171122dc02db5ea1818816a712d97a4c85c0bc",
//       display_name: "Teacher2",
//       user_role: "teacher",
//       bio: "",
//       description: "",
//       country: "VN",
//       verify_code: "",
//       block_users: [],
//       follow_users: ["666ffe3f715cee894e6f0a71"],
//       disagree_users: [],
//       user_status: 1,
//       phone_number: "",
//       phone_session: "",
//       is_validated_phone: false,
//       official_status: false,
//       links: [],
//       is_native: false,
//       is_verified: false,
//       organization_id: null,
//       rating: 0,
//       timezone: "Asia/Bangkok",
//       default_language: "",
//       ignore_followers: [],
//       point: 7,
//       point_exchange: 7,
//       level: 1,
//       invitation_code: "KUHQZ",
//       current_coin: 0,
//       current_token: 7020000,
//       taught_time: 10,
//       is_pending_to_became_teacher: false,
//       skills: [],
//       user_payment_address: [],
//       last_active: "2024-06-20T08:33:59.000Z",
//       certificates: [],
//       educations: [],
//       createdAt: "2024-06-14T10:06:26.472Z",
//       updatedAt: "2024-06-24T17:55:00.365Z",
//       __v: 0,
//       user_active: 0,
//     },
//     plan_id: "667002fd570c57a537c7ad2e",
//     course_name: "Khoa hoc call 11 Dangth",
//   },
// };

const NewHomeScreen = () => {
  const { isLoggedIn } = useUserHook();
  const activeTrack = useActiveTrack();
  const lastActiveTrack = useLastActiveTrack();
  const userData = useStore((state) => state.userData);

  const displayedTrack = activeTrack ?? lastActiveTrack;
  const hide =
    !displayedTrack ||
    displayedTrack.url ===
      "https://ia801304.us.archive.org/32/items/SilentRingtone/silence.mp3";

  useEffect(() => {
    if (isLoggedIn() && (!userData?.target_point || !userData?.current_point)) {
      setTimeout(() => {
        NavigationService.navigate(SCREENS.UPLOAD_CERTIFICATE);
      }, 30);
    }
  }, [userData]);
  // const _showSuperModalCourse = () => {
  //   showSuperModal({
  //     styleModalType: EnumStyleModalType.Bottom,
  //     contentModalType: EnumModalContentType.Schedule
  //   })
  // };
  // const userData = useStore((state) => state.userData);
  return (
    <View style={CS.flex1}>
      {/* <StatusBar backgroundColor="transparent" barStyle="dark-content" /> */}
      <View style={{ flex: 1 }}>
        <ListPostNew />
      </View>
      {isLoggedIn() && (
        <TouchableOpacity
          style={{
            position: "absolute",
            width: 50,
            height: 50,
            backgroundColor: palette.primary,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 25,
            bottom: !hide ? 80 : 10,
            right: 10,
            zIndex: 1,
          }}
          // onPress={_showSuperModalCourse}
          // onPress={() => NavigationService.navigate(SCREENS.AUDIO_PLAY)}
          // onPress={() => {
          //   navigate(
          //     SCREENS.ONEONE_SCREEN,
          //     userData?.user_role == "user" ? params : params2,
          //   );
          // }}
          onPress={() => navigate(SCREENS.POST_SCREEN)}
          // onPress={() => navigate(SCREENS.MANAGE_CERTIFICATE)}
        >
          <Icon
            name={"add-outline"}
            type={IconType.Ionicons}
            size={30}
            color={palette.white}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default NewHomeScreen;
