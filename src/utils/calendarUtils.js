// 주 단위 달력 행렬(6주 × 7일) 생성
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

//  YYYY-MM-DD 형태로 로컬 Date를 포맷팅
export function formatLocalDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}