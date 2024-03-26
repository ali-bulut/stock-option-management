/**
 * This helper will contain a set of functions that would help with number related operations
 */
export default class NumberHelper {
  /**
   * Formats a price fetched from backend
   * @param number
   * @returns formatted percentage value
   */
  public static formatPercentage = (num: number) => {
    return num.toLocaleString("en", {
      style: "percent",
      minimumFractionDigits: 2,
    });
  };
}
