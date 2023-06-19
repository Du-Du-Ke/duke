export const getHumanizedDate = (): string => {
  const currentDate = new Date();

  const day = currentDate.getDate();
  const month = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  // Add the appropriate ordinal suffix to the day
  let dayWithSuffix;
  if (day === 1 || day === 21 || day === 31) {
    dayWithSuffix = day + "st";
  } else if (day === 2 || day === 22) {
    dayWithSuffix = day + "nd";
  } else if (day === 3 || day === 23) {
    dayWithSuffix = day + "rd";
  } else {
    dayWithSuffix = day + "th";
  }

  return `${dayWithSuffix} ${month}, ${year}`;
}
