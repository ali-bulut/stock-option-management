/**
 * This helper will contain a set of functions that would help with Currency related operations
 */
export default class CurrencyHelper {
  /**
   * Formats a price fetched from backend
   * @param price
   * @returns formatted price with a currency
   */
  public static format = (
    price: number,
    floatingPoints: number = 2,
    inCents: boolean = false
  ) => {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: floatingPoints,
      maximumFractionDigits: floatingPoints,
    });
    price = inCents ? price / 100 : price;
    return formatter.format(price);
  };
}
