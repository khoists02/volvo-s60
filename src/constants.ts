import { format } from "date-fns";

export const FORMAT_QUERY = "yyyy/MM/dd";
export const FORMAT_DISPLAY = "dd/MM/yyyy";
export enum FilterType {
  "last-week",
  "this-week",
  "last-month",
  "this-month",
  "last-6-month",
  "range",
  "yearly",
}

export const CURRENT_YEAR = format(new Date(), "yyyy");

export const HOLIDAYS = [
  `${CURRENT_YEAR}-01-02`,
  `${CURRENT_YEAR}-01-16`,
  `${CURRENT_YEAR}-02-20`,
  `${CURRENT_YEAR}-04-27`,
  `${CURRENT_YEAR}-05-29`,
  `${CURRENT_YEAR}-06-19`,
  `${CURRENT_YEAR}-07-04`,
  `${CURRENT_YEAR}-09-04`,
  `${CURRENT_YEAR}-11-23`,
  `${CURRENT_YEAR}-12-25`,
];

export const FED_DAYS_STR =
  "2023-11-02, 2023-12-14, 2024-02-01, 2024-03-11, 2024-05-02, 2024-06-20, 2024-08-01, 2024-10-06, 2024-11-07";

export const FED_DAYS = FED_DAYS_STR.split(",");
