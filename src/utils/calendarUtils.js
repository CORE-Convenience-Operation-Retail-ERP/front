export function generateCalendarMatrix(year, month) {
  const matrix = [];
  const firstDay = new Date(year, month, 1);
  const startDay = new Date(firstDay);
  startDay.setDate(firstDay.getDate() - firstDay.getDay()); // 해당 주의 일요일로 맞춤

  for (let week = 0; week < 6; week++) {
    const weekRow = [];
    for (let day = 0; day < 7; day++) {
      const date = new Date(startDay);
      date.setDate(startDay.getDate() + week * 7 + day);
      weekRow.push(date);
    }
    matrix.push(weekRow);
  }

  return matrix;
}
