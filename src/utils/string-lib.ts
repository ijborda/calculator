export class StringLib {
  static toTitleCase = (str?: string) => {
    if (!str) return '';
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  static toTitleCaseObj = <T extends Object>(obj: T): T => {
    return Object.fromEntries<T>(
      Object.entries(obj).map(([k, v]) => [
        k,
        typeof v === 'string' ? StringLib.toTitleCase(v) : v,
      ])
    ) as unknown as T;
  };

  static toLowerCaseObj = <T extends Object>(obj: T): T => {
    return Object.fromEntries<T>(
      Object.entries(obj).map(([k, v]) => [
        k,
        typeof v === 'string' ? v.toLowerCase() : v,
      ])
    ) as unknown as T;
  };

  static toNumberCommas = (num: number): string => {
    return Intl.NumberFormat().format(num);
  };
}
