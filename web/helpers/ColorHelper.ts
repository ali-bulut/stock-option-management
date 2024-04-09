/**
 * This helper will contain a set of functions that would help with color related operations
 */
export class ColorHelper {
  static COLORS = [
    "#ff453a",
    "#6ac4dc",
    "#ffd60a",
    "#98989d",
    "#0a84ff",
    "#5e5ce6",
    "#5ac8f5",
    "#ac8e68",
    "#32d74b",
    "#66d4cf",
    "#ff9f0a",
    "#ff375f",
    "#bf5af2",
  ];

  /**
   * Returns a color by checking the index
   * @param index
   *
   * @returns color
   */
  public static generateColor = (index: number): string => {
    return this.COLORS[index];
  };
}
