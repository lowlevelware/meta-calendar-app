import { isLeapYear, format, setDay, getDaysInMonth } from "date-fns";
import * as React from "react";

import "./styles.css";

const now = new Date();

const days = [...new Array(7).keys()].map((i) => format(setDay(now, i), "ccc"));
const rows = [...new Array(5).keys()];

export default function App() {
  const [value, setValue] = React.useState(new Date().getFullYear().toString());
  const [year, setYear] = React.useState(value);

  React.useEffect(() => {
    const nextYear = value.padStart(4, "0");
    if (!isNaN(new Date(`${nextYear}-01-01T00:00:00`).getTime())) {
      setYear(nextYear);
    }
  }, [value]);

  const isLY = isLeapYear(new Date(`${year}-01-01T00:00:00`));

  const monthsByFirstDay: { [firstDay: number]: string[] } = {};
  const bgByMonth: { [month: string]: string } = {};
  for (let i = 1; i <= 12; i++) {
    const isoMonth = i.toString().padStart(2, "0");
    const month = new Date(`${year}-${isoMonth}-01T00:00:00`);
    const firstDay = month.getDay();
    const formattedMonth = format(month, "LLL").toUpperCase();
    monthsByFirstDay[firstDay] = monthsByFirstDay[firstDay] || [];
    monthsByFirstDay[firstDay].push(formattedMonth);

    const daysInMonth = getDaysInMonth(month);
    bgByMonth[formattedMonth] =
      daysInMonth === 31
        ? "bg-red"
        : daysInMonth === 30
        ? "bg-green"
        : "bg-blue";
  }

  return (
    <div className="app">
      <table>
        <thead>
          {days.map((row, i) => (
            <tr key={row}>
              {days.map((col, j) => {
                const dayEl = (
                  <th
                    key={col}
                    className={`day ${i === 0 ? "border-top" : ""} ${
                      j === 6 ? "border-right" : "border-right-dotted"
                    } ${i === 6 ? "border-bottom" : "border-bottom-dotted"} ${
                      j === 0 ? "border-left" : ""
                    } ${j % 2 === 0 ? "bg-gray" : ""}`}
                  >
                    {days[(j - i + 7) % 7]}
                  </th>
                );
                if (!j) {
                  const months = monthsByFirstDay[(7 - i) % 7].reverse();
                  const monthEls = [...Array(3).keys()].map((i) => {
                    const month = months[2 - i] || "";
                    const bg = bgByMonth[month] || "";
                    return (
                      <th key={2 - i} className={`month ${bg}`}>
                        {months[2 - i] || ""}
                      </th>
                    );
                  });
                  return (
                    <React.Fragment key={col}>
                      {monthEls}
                      {dayEl}
                    </React.Fragment>
                  );
                }
                return dayEl;
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row}>
              {days.map((day, j) => {
                const date = 7 * i + j + 1;
                const bg =
                  date === 31
                    ? "bg-red"
                    : date === 30
                    ? "bg-green"
                    : (isLY && date === 29) || (!isLY && date === 28)
                    ? "bg-blue"
                    : j % 2 === 0
                    ? "bg-gray"
                    : "";
                const dateEl =
                  date <= 31 ? (
                    <td
                      key={day}
                      className={`${bg} ${i === 0 ? "border-top" : ""} ${
                        j === 6 || date === 31
                          ? "border-right"
                          : "border-right-dotted"
                      } ${
                        date >= 25 ? "border-bottom" : "border-bottom-dotted"
                      } ${j === 0 ? "border-left" : ""}`}
                    >
                      {date}
                    </td>
                  ) : null;
                if (!i && !j) {
                  return (
                    <React.Fragment key={day}>
                      <td colSpan={3} rowSpan={5}>
                        <input
                          type="text"
                          value={value}
                          onChange={(e) => setValue(e.target.value)}
                        />
                      </td>
                      {dateEl}
                    </React.Fragment>
                  );
                }
                return dateEl;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
