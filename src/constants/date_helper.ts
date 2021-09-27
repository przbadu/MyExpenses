export const numToMonthName = (number: number | string) => {
  switch (+number) {
    case 1:
      return 'Jan';
    case 2:
      return 'Feb';
    case 3:
      return 'Mar';
    case 4:
      return 'Apr';
    case 5:
      return 'May';
    case 6:
      return 'Jun';
    case 7:
      return 'Jul';
    case 8:
      return 'Aug';
    case 9:
      return 'Sep';
    case 10:
      return 'Oct';
    case 11:
      return 'Nov';
    case 12:
      return 'Dec';
  }
};

export const numToWeekName = (number: number | string) => {
  switch (+number) {
    case 1:
      return 'Sun';
    case 2:
      return 'Mon';
    case 3:
      return 'Tue';
    case 4:
      return 'Wed';
    case 5:
      return 'Thu';
    case 6:
      return 'Fri';
    case 7:
      return 'Sat';
  }
};
