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
