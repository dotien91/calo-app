export const filterCourseKeys = [
  {
    name: "Form of learning",
    id: "types",
    keyFilters: [
      {
        name: "All forms",
        id: "All forms",
      },
      {
        name: "Call 1-1",
        id: "Call 1-1",
      },
      {
        name: "Self-learning",
        id: "Self-learning",
      },
      {
        name: "Call group",
        id: "Call group",
      },
    ],
  },
  {
    name: "skills",
    id: "skills",
    keyFilters: [
      {
        name: "All skills",
        id: "All skills",
      },
      {
        name: "Listening",
        id: "Listening",
      },
      {
        name: "Reading",
        id: "Reading",
      },
      {
        name: "Writing",
        id: "Writing",
      },
      {
        name: "Speaking",
        id: "Speaking",
      },
    ],
  },
  {
    name: "Price per course",
    id: "price",
  },
  {
    name: "Levels of study",
    id: "levels",
    keyFilters: [
      {
        name: "4+",
        id: "4+",
      },
      {
        name: "5+",
        id: "5+",
      },
      {
        name: "6+",
        id: "6+",
      },
      {
        name: "7+",
        id: "7+",
      },
      {
        name: "8+",
        id: "8+",
      },
      {
        name: "9",
        id: "9+",
      },
    ],
  },
  {
    name: "Only English native speakers",
    id: "onlyEnglishNativeSpeakers",
  },
];

export const filterTeacherKeys = [
  {
    name: "Form of learning",
    id: "types",
    keyFilters: [
      {
        name: "All forms",
        id: "All forms",
      },
      {
        name: "Call 1-1",
        id: "Call 1-1",
      },
      {
        name: "Self-learning",
        id: "Self-learning",
      },
      {
        name: "Call group",
        id: "Call group",
      },
    ],
  },
  {
    name: "Skills",
    id: "skills",
    keyFilters: [
      {
        name: "All skills",
        id: "All skills",
      },
      {
        name: "Listening",
        id: "Listening",
      },
      {
        name: "Reading",
        id: "Reading",
      },
      {
        name: "Writing",
        id: "Writing",
      },
      {
        name: "Speaking",
        id: "Speaking",
      },
    ],
  },
  {
    name: "Time available",
    id: "timeAvailable",
    keyFilters: [
      {
        name: "9 - 12",
        id: {
          time_start: "9:00",
          time_end: "12:00",
        },
      },
      {
        name: "12 - 15",
        id: {
          time_start: "12:00",
          time_end: "15:00",
        },
      },
      {
        name: "15 - 18",
        id: {
          time_start: "15:00",
          time_end: "18:00",
        },
      },
      {
        name: "18 - 21",
        id: {
          time_start: "18:00",
          time_end: "21:00",
        },
      },
      {
        name: "21 - 0",
        id: {
          time_start: "21:00",
          time_end: "0:00",
        },
      },
      {
        name: "0 - 3",
        id: {
          time_start: "0:00",
          time_end: "3:00",
        },
      },
    ],
  },
  {
    name: "Only English native speakers",
    id: "onlyEnglishNativeSpeakers",
  },
  {
    name: "Levels of tutor",
    id: "levelOfTutor",
    keyFilters: [
      {
        name: "8",
        id: "8",
      },
      {
        name: "8.5",
        id: "8.5",
      },
      {
        name: "9",
        id: "9",
      },
    ],
  },
];

export const quickFilterCourse = [
  {
    name: "All forms",
    id: "All forms",
    type: "types",
  },
  {
    name: "Call 1-1",
    id: "Call 1-1",
    type: "types",
  },
  {
    name: "Self-learning",
    id: "Self-learning",
    type: "types",
  },
  {
    name: "Call group",
    id: "Call group",
    type: "types",
  },
  {
    name: "All skills",
    id: "All skills",
    type: "skills",
  },
  {
    name: "Listening",
    id: "Listening",
    type: "skills",
  },
  {
    name: "Reading",
    id: "Reading",
    type: "skills",
  },
  {
    name: "Writing",
    id: "Writing",
    type: "skills",
  },
  {
    name: "Speaking",
    id: "Speaking",
    type: "skills",
  },
];

export const sortCourseSelectData = [
  {
    id: "price_low",
    sort_by: "price",
    name: "Price: lowest first",
    order_by: "ASC",
  },
  {
    id: "price_high",
    sort_by: "price",
    name: "Price: highest first",
    order_by: "DESC",
  },
  { id: "rating", sort_by: "rating", name: "Highest rating", order_by: "DESC" },
  {
    id: "newest",
    sort_by: "createdAt",
    name: "Sort by newest",
    order_by: "ASC",
  },
];

export const sortTutorSelectData = [
  {
    id: "level_low",
    sort_by: "levelOfTutor",
    name: "Level: lowest first",
    order_by: "ASC",
  },
  {
    id: "level_high",
    sort_by: "levelOfTutor",
    name: "Level: highest first",
    order_by: "DESC",
  },
];
