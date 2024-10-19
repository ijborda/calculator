export class DateUtil {
  static getMonths = () => {
    return [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
  };

  static unixToDateDisplay = (unix: number) => {
    // Create date object
    const date = new Date(unix);

    // Extract year, month, date, hours, and minutes
    const year = date.getFullYear();
    const month = DateUtil.getMonths()[date.getMonth()];
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    // Convert hours to 12-hour format and determine AM/PM
    const period = hours < 12 ? 'AM' : 'PM';
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;

    // Pad minutes with leading zero if necessary
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

    // Construct the formatted date string
    const formattedDate = `${year} ${month} ${day}, ${formattedHours}:${formattedMinutes} ${period}`;

    return formattedDate;
  };
}
