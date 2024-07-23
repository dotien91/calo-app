import { translations } from "@localization";

export const ieltsPointList = [
    { index: 1, value: "4.0" },
    { index: 2, value: "4.5" },
    { index: 3, value: "5.0" },
    { index: 4, value: "5.5" },
    { index: 5, value: "6.0" },
    { index: 6, value: "6.5" },
    { index: 7, value: "7.0" },
    { index: 8, value: "7.5" },
    { index: 9, value: "8.0" },
    { index: 10, value: "8.5" },
    { index: 11, value: "9.0" },
];
export const chooseOptions = [
    {
        title: translations.uploadCertificate.title1,
        options: [
            {
                id: "uploadCertificate",
                name: translations.uploadCertificate.haveIelts,
            },
            {
                id: "enterIELTS",
                name: translations.uploadCertificate.haveNoIelts,
            }
        ],
    },
    {
        title: translations.uploadCertificate.title2,
        options: [
            {
                id: "master",
                name: translations.uploadCertificate.beMaster
            },
            {
                id: "upgrade",
                name: translations.uploadCertificate.upgradeBand
            }
        ],
    },
];
export const typeCoachingList = [
    {
        value: "Call 1-1",
        label: "Call 1-1",
      },
      {
        value: "Self-learning",
        label: "Self-learning",
      },
      {
        value: "Call group",
        label: "Call group",
      },
]