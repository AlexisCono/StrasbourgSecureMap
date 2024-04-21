export function timeConvert(dateTime) {
  const [date, time] = dateTime.split("T");
  const [year, moth, day] = date.split("-");

  const dateTimeConvert = `${day}/${moth}/${year}-${time}`;
  return dateTimeConvert;
}
