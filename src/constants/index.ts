interface AgeFilter {
  value: string;
  label: string;
}

export const ageOptions: AgeFilter[] = [
  {
    value: "all",
    label: "All age",
  },
  {
    value: "15-25",
    label: "15-25",
  },
  {
    value: ">25",
    label: "25",
  },
];

export const genderOptions: AgeFilter[] = [
  {
    value: "all ",
    label: "All",
  },
  {
    value: "Male ",
    label: "Male",
  },
  {
    value: "Female",
    label: "Female",
  },
];
