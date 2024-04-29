import { format } from "date-fns";

/**
 * This helper will contain a set of functions that would help with date related operations
 */
export default class DateHelper {
  /**
   * Formats a price fetched from backend
   * @param date
   * @param formatStr
   *
   * @returns formatted date
   */
  public static format = (date: string, formatStr: string = "PPP"): string => {
    return format(new Date(date), formatStr);
  };
}
