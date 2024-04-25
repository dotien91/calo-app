import { translations } from "@localization";

export const filterCourseKeys = [
  {
    name: translations.course.typeLearning,
    id: "types",
    keyFilters: [
      {
        name: translations.course.allForms,
        id: "All forms",
      },
      {
        name: translations.course.callOneVsOne,
        id: "Call 1-1",
      },
      {
        name: translations.course.salfLearning,
        id: "Self-learning",
      },
      {
        name: translations.course.callGroup,
        id: "Call group",
      },
      {
        name: translations.course.offline,
        id: "Offline",
      },
    ],
  },
  {
    name: translations.course.course,
    id: "skills",
    keyFilters: [
      {
        name: translations.course.allSkills,
        id: "All skills",
      },
      {
        name: translations.course.careerGuidance,
        id: "Career Guidance",
      },
      {
        name: translations.course.life,
        id: "Life",
      },
      {
        name: translations.course.finance,
        id: "Finance",
      },
      {
        name: translations.course.health,
        id: "Health",
      },
      {
        name: translations.course.business,
        id: "Business",
      },
    ],
  },
  {
    name: translations.course.pricePerCourse,
    id: "price",
  },
  // {
  //   name: translations.course.levelsOfStudy,
  //   id: "levels",
  //   keyFilters: [
  //     {
  //       name: "4+",
  //       id: "4+",
  //     },
  //     {
  //       name: "5+",
  //       id: "5+",
  //     },
  //     {
  //       name: "6+",
  //       id: "6+",
  //     },
  //     {
  //       name: "7+",
  //       id: "7+",
  //     },
  //     {
  //       name: "8+",
  //       id: "8+",
  //     },
  //     {
  //       name: "9",
  //       id: "9",
  //     },
  //   ],
  // },
  // {
  //   name: translations.course.onlyEnglish,
  //   id: "onlyEnglishNativeSpeakers",
  // },
];

export const filterTeacherKeys = [
  {
    name: translations.course.formLearning,
    id: "types",
    keyFilters: [
      {
        name: translations.course.allForms,
        id: "All forms",
      },
      {
        name: translations.course.callOneVsOne,
        id: "Call 1-1",
      },
      {
        name: translations.course.salfLearning,
        id: "Self-learning",
      },
      {
        name: translations.course.callGroup,
        id: "Call group",
      },
      {
        name: translations.course.offline,
        id: "Offline",
      },
    ],
  },
  {
    name: translations.course.skills,
    id: "skills",
    keyFilters: [
      {
        name: translations.course.allSkills,
        id: "All skills",
      },
      {
        name: translations.course.careerGuidance,
        id: "Career Guidance",
      },
      {
        name: translations.course.life,
        id: "Life",
      },
      {
        name: translations.course.finance,
        id: "Finance",
      },
      {
        name: translations.course.health,
        id: "Health",
      },
      {
        name: translations.course.bussiness,
        id: "Bussiness",
      },
    ],
  },
  // {
  //   name: translations.course.timeAvailable,
  //   id: "timeAvailable",
  //   keyFilters: [
  //     {
  //       name: "9 - 12",
  //       id: {
  //         time_start: "9:00",
  //         time_end: "12:00",
  //       },
  //     },
  //     {
  //       name: "12 - 15",
  //       id: {
  //         time_start: "12:00",
  //         time_end: "15:00",
  //       },
  //     },
  //     {
  //       name: "15 - 18",
  //       id: {
  //         time_start: "15:00",
  //         time_end: "18:00",
  //       },
  //     },
  //     {
  //       name: "18 - 21",
  //       id: {
  //         time_start: "18:00",
  //         time_end: "21:00",
  //       },
  //     },
  //     {
  //       name: "21 - 0",
  //       id: {
  //         time_start: "21:00",
  //         time_end: "0:00",
  //       },
  //     },
  //     {
  //       name: "0 - 3",
  //       id: {
  //         time_start: "0:00",
  //         time_end: "3:00",
  //       },
  //     },
  //   ],
  // },
  // {
  //   name: translations.course.onlyEnglish,
  //   id: "onlyEnglishNativeSpeakers",
  // },
  // {
  //   name: translations.course.levelsOfTutor,
  //   id: "levelOfTutor",
  //   keyFilters: [
  //     {
  //       name: "8",
  //       id: "8",
  //     },
  //     {
  //       name: "8.5",
  //       id: "8.5",
  //     },
  //     {
  //       name: "9",
  //       id: "9",
  //     },
  //   ],
  // },
];

export const quickFilterCourse = [
  // {
  //   name: translations.course.allForms,
  //   id: "All forms",
  //   type: "types",
  // },
  // {
  //   name: translations.course.callOneVsOne,
  //   id: "Call 1-1",
  //   type: "types",
  // },
  // {
  //   name: translations.course.salfLearning,
  //   id: "Self-learning",
  //   type: "types",
  // },
  // {
  //   name: translations.course.callGroup,
  //   id: "Call group",
  //   type: "types",
  // },
  {
    name: translations.course.allSkills,
    id: "All skills",
    type: "skills",
  },

  {
    name: translations.course.life,
    id: "Life",
    type: "skills",
  },
  {
    name: translations.course.health,
    id: "Health",
    type: "skills",
  },
  {
    name: translations.course.finance,
    id: "Finance",
    type: "skills",
  },
  {
    name: translations.course.business,
    id: "Business",
    type: "skills",
  },
  {
    name: translations.course.careerGuidance,
    id: "Career Guidance",
    type: "skills",
  },
];

export const sortCourseSelectData = [
  {
    id: "price_low",
    sort_by: "price",
    name: translations.course.price_low,
    order_by: "ASC",
  },
  {
    id: "price_high",
    sort_by: "price",
    name: translations.course.price_high,
    order_by: "DESC",
  },
  {
    id: "rating",
    sort_by: "rating",
    name: translations.course.rating,
    order_by: "DESC",
  },
  {
    id: "newest",
    sort_by: "createdAt",
    name: translations.course.newest,
    order_by: "DESC",
  },
];

export const sortTutorSelectData = [
  {
    id: "level_low",
    sort_by: "levelOfTutor",
    name: translations.course.level_low,
    order_by: "ASC",
  },
  {
    id: "level_high",
    sort_by: "levelOfTutor",
    name: translations.course.level_high,
    order_by: "DESC",
  },
];

export const daysOfWeek = [
  {
    value: 1,
    label: "Mon",
  },
  {
    value: 2,
    label: "Tue",
  },
  {
    value: 3,
    label: "Wed",
  },
  {
    value: 4,
    label: "Thu",
  },
  {
    value: 5,
    label: "Fri",
  },
  {
    value: 6,
    label: "Sat",
  },
  {
    value: 0,
    label: "Sun",
  },
];

export const timeOfDay = [
  {
    name: "7:00 - 8:00",
    id: {
      time_end: "8:00",
      time_start: "7:00",
    },
  },
  {
    name: "8:00 - 9:00",
    id: {
      time_end: "9:00",
      time_start: "8:00",
    },
  },
  {
    name: "9:00 - 10:00",
    id: {
      time_end: "10:00",
      time_start: "9:00",
    },
  },
  {
    name: "10:00 - 11:00",
    id: {
      time_end: "11:00",
      time_start: "10:00",
    },
  },
  {
    name: "10:00 - 12:00",
    id: {
      time_end: "8:00",
      time_start: "7:00",
    },
  },
  {
    name: "13:00 - 14:00",
    id: {
      time_end: "14:00",
      time_start: "13:00",
    },
  },
  {
    name: "14:00 - 15:00",
    id: {
      time_end: "15:00",
      time_start: "14:00",
    },
  },
  {
    name: "15:00 - 16:00",
    id: {
      time_end: "16:00",
      time_start: "15:00",
    },
  },
  {
    name: "16:00 - 17:00",
    id: {
      time_end: "17:00",
      time_start: "16:00",
    },
  },
  {
    name: "17:00 - 18:00",
    id: {
      time_end: "18:00",
      time_start: "17:00",
    },
  },
  {
    name: "13:00 - 14:00",
    id: {
      time_end: "14:00",
      time_start: "13:00",
    },
  },
  {
    name: "13:00 - 14:00",
    id: {
      time_end: "14:00",
      time_start: "13:00",
    },
  },
];

export interface TimeAvailableType {
  time_duration: number;
  label: string;
  times_in_utc: {
    label: string;
    is_picked: boolean;
    time_start: number;
  }[];
}

export interface TypeTimeAvailableRes {
  value: number;
  label: string;
  times: TimeAvailableType[];
}
[];

export const exampleData = [
  {
    value: 0,
    label: "Sun",
    times: [
      {
        time_duration: 1,
        label: "1 hour",
        times_in_utc: [
          {
            label: "0:00 - 1:00",
            is_picked: false,
            time_start: 0,
          },
          {
            label: "1:00 - 2:00",
            is_picked: false,
            time_start: 1,
          },
          {
            label: "2:00 - 3:00",
            is_picked: false,
            time_start: 2,
          },
          {
            label: "3:00 - 4:00",
            is_picked: false,
            time_start: 3,
          },
          {
            label: "4:00 - 5:00",
            is_picked: false,
            time_start: 4,
          },
          {
            label: "5:00 - 6:00",
            is_picked: false,
            time_start: 5,
          },
          {
            label: "6:00 - 7:00",
            is_picked: false,
            time_start: 6,
          },
          {
            label: "7:00 - 8:00",
            is_picked: false,
            time_start: 7,
          },
          {
            label: "8:00 - 9:00",
            is_picked: false,
            time_start: 8,
          },
          {
            label: "9:00 - 10:00",
            is_picked: false,
            time_start: 9,
          },
          {
            label: "10:00 - 11:00",
            is_picked: false,
            time_start: 10,
          },
          {
            label: "11:00 - 12:00",
            is_picked: false,
            time_start: 11,
          },
          {
            label: "12:00 - 13:00",
            is_picked: false,
            time_start: 12,
          },
          {
            label: "13:00 - 14:00",
            is_picked: false,
            time_start: 13,
          },
          {
            label: "14:00 - 15:00",
            is_picked: false,
            time_start: 14,
          },
          {
            label: "15:00 - 16:00",
            is_picked: false,
            time_start: 15,
          },
          {
            label: "16:00 - 17:00",
            is_picked: false,
            time_start: 16,
          },
          {
            label: "17:00 - 18:00",
            is_picked: false,
            time_start: 17,
          },
          {
            label: "18:00 - 19:00",
            is_picked: false,
            time_start: 18,
          },
          {
            label: "19:00 - 20:00",
            is_picked: false,
            time_start: 19,
          },
          {
            label: "20:00 - 21:00",
            is_picked: false,
            time_start: 20,
          },
          {
            label: "21:00 - 22:00",
            is_picked: false,
            time_start: 21,
          },
          {
            label: "22:00 - 23:00",
            is_picked: false,
            time_start: 22,
          },
          {
            label: "23:00 - 24:00",
            is_picked: false,
            time_start: 23,
          },
        ],
      },
      {
        time_duration: 2,
        label: "2 hours",
        times_in_utc: [
          {
            label: "0:00 - 2:00",
            is_picked: false,
            time_start: 0,
          },
          {
            label: "1:00 - 3:00",
            is_picked: false,
            time_start: 1,
          },
          {
            label: "2:00 - 4:00",
            is_picked: false,
            time_start: 2,
          },
          {
            label: "3:00 - 5:00",
            is_picked: false,
            time_start: 3,
          },
          {
            label: "4:00 - 6:00",
            is_picked: false,
            time_start: 4,
          },
          {
            label: "5:00 - 7:00",
            is_picked: false,
            time_start: 5,
          },
          {
            label: "6:00 - 8:00",
            is_picked: false,
            time_start: 6,
          },
          {
            label: "7:00 - 9:00",
            is_picked: false,
            time_start: 7,
          },
          {
            label: "8:00 - 10:00",
            is_picked: false,
            time_start: 8,
          },
          {
            label: "9:00 - 11:00",
            is_picked: false,
            time_start: 9,
          },
          {
            label: "10:00 - 12:00",
            is_picked: false,
            time_start: 10,
          },
          {
            label: "11:00 - 13:00",
            is_picked: false,
            time_start: 11,
          },
          {
            label: "12:00 - 14:00",
            is_picked: false,
            time_start: 12,
          },
          {
            label: "13:00 - 15:00",
            is_picked: false,
            time_start: 13,
          },
          {
            label: "14:00 - 16:00",
            is_picked: false,
            time_start: 14,
          },
          {
            label: "15:00 - 17:00",
            is_picked: false,
            time_start: 15,
          },
          {
            label: "16:00 - 18:00",
            is_picked: false,
            time_start: 16,
          },
          {
            label: "17:00 - 19:00",
            is_picked: false,
            time_start: 17,
          },
          {
            label: "18:00 - 20:00",
            is_picked: false,
            time_start: 18,
          },
          {
            label: "19:00 - 21:00",
            is_picked: false,
            time_start: 19,
          },
          {
            label: "20:00 - 22:00",
            is_picked: false,
            time_start: 20,
          },
          {
            label: "21:00 - 23:00",
            is_picked: false,
            time_start: 21,
          },
          {
            label: "22:00 - 24:00",
            is_picked: false,
            time_start: 22,
          },
          {
            label: "23:00 - 1:00",
            is_picked: false,
            time_start: 23,
          },
        ],
      },
    ],
  },
];

export const listTypeCourse = [
  {
    value: "Call 1-1",
    index: 1,
  },
  {
    value: "Self-learning",
    index: 2,
  },
  {
    value: "Call group",
    index: 3,
  },
];

export const listLevel = [
  { value: "4+", index: 1 },
  { value: "5+", index: 2 },
  { value: "6+", index: 3 },
  { value: "7+", index: 4 },
  { value: "8+", index: 5 },
  { value: "9", index: 6 },
];

export const listSkill = [
  { value: "Career Guidance", index: 1 },
  { value: "Life", index: 2 },
  { value: "Finance", index: 3 },
  { value: "Health", index: 4 },
  { value: "Business", index: 5 },
];

export const timesInUtc = [
  {
    label: "0:00 - 1:00",
    is_picked: false,
    time_start: "0:00",
  },
  {
    label: "1:00 - 2:00",
    is_picked: false,
    time_start: "1:00",
  },
  {
    label: "2:00 - 3:00",
    is_picked: false,
    time_start: "2:00",
  },
  {
    label: "3:00 - 4:00",
    is_picked: false,
    time_start: "3:00",
  },
  {
    label: "4:00 - 5:00",
    is_picked: false,
    time_start: "4:00",
  },
  {
    label: "5:00 - 6:00",
    is_picked: false,
    time_start: "05:00",
  },
  {
    label: "6:00 - 7:00",
    is_picked: false,
    time_start: "6:00",
  },
  {
    label: "7:00 - 8:00",
    is_picked: false,
    time_start: "7:00",
  },
  {
    label: "8:00 - 9:00",
    is_picked: false,
    time_start: "8:00",
  },
  {
    label: "9:00 - 10:00",
    is_picked: false,
    time_start: "9:00",
  },
  {
    label: "10:00 - 11:00",
    is_picked: false,
    time_start: "10:00",
  },
  {
    label: "11:00 - 12:00",
    is_picked: false,
    time_start: "11:00",
  },
  {
    label: "12:00 - 13:00",
    is_picked: false,
    time_start: "12:00",
  },
  {
    label: "13:00 - 14:00",
    is_picked: false,
    time_start: "13:00",
  },
  {
    label: "14:00 - 15:00",
    is_picked: false,
    time_start: "14:00",
  },
  {
    label: "15:00 - 16:00",
    is_picked: false,
    time_start: "15:00",
  },
  {
    label: "16:00 - 17:00",
    is_picked: false,
    time_start: "16:00",
  },
  {
    label: "17:00 - 18:00",
    is_picked: false,
    time_start: "17:00",
  },
  {
    label: "18:00 - 19:00",
    is_picked: false,
    time_start: "18:00",
  },
  {
    label: "19:00 - 20:00",
    is_picked: false,
    time_start: "19:00",
  },
  {
    label: "20:00 - 21:00",
    is_picked: false,
    time_start: "20:00",
  },
  {
    label: "21:00 - 22:00",
    is_picked: false,
    time_start: "21:00",
  },
  {
    label: "22:00 - 23:00",
    is_picked: false,
    time_start: "22:00",
  },
  {
    label: "23:00 - 24:00",
    is_picked: false,
    time_start: "23:00",
  },
];

export const timeFullWeek = [
  { value: 0, label: "Sun", times: timesInUtc },
  { value: 1, label: "Mon", times: timesInUtc },
  { value: 2, label: "Tue", times: timesInUtc },
  { value: 3, label: "Wed", times: timesInUtc },
  { value: 4, label: "Thu", times: timesInUtc },
  { value: 5, label: "Fri", times: timesInUtc },
  { value: 6, label: "Sat", times: timesInUtc },
];

export const quickFilterLife = [
  {
    name: translations.setup.lifeCoaching,
    id: "Life coaching",
    type: "skills",
  },

  {
    name: translations.setup.personalDevelopment,
    id: "Personal development",
    type: "skills",
  },
  {
    name: translations.setup.goalSetting,
    id: "Goal Setting",
    type: "skills",
  },
  {
    name: translations.setup.timeMana,
    id: "Time Management",
    type: "skills",
  },
  {
    name: translations.setup.stressMana,
    id: "Stress management",
    type: "skills",
  },
];

export const quickFilterHealthAndWell = [
  {
    name: translations.setup.healthAndWell,
    id: "Health & wellness",
    type: "skills",
  },

  {
    name: translations.setup.nutri,
    id: "Nutri & diet",
    type: "skills",
  },
  {
    name: translations.setup.fitness,
    id: "Fitness & exercise",
    type: "skills",
  },
  {
    name: translations.setup.mental,
    id: "Mental health",
    type: "skills",
  },
  {
    name: translations.setup.sleep,
    id: "Sleep improvement",
    type: "skills",
  },
];

export const quickFilterBusinessAndCareer = [
  {
    name: translations.setup.businessCoa,
    id: "Business coaching",
    type: "skills",
  },

  {
    name: translations.setup.careerDeve,
    id: "Career development",
    type: "skills",
  },
  {
    name: translations.setup.entre,
    id: "Entrepreneurship",
    type: "skills",
  },
  {
    name: translations.setup.leaderSkill,
    id: "Leadership skills",
    type: "skills",
  },
  {
    name: translations.setup.workLife,
    id: "Work-life balance",
    type: "skills",
  },
];
