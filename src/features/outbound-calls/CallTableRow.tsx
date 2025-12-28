import React from "react";

interface CallTableRowProps {
  date: string;
  time: string;
  name: string;
  number: string;
  cycle: number;
  highlight?: boolean;
}

const CallTableRow: React.FC<CallTableRowProps> = ({ date, time, name, number, cycle, highlight }) => {
  return (
    <tr className={highlight ? "bg-gray-50" : ""}>
      <td className="px-3 py-3 text-gray-700 whitespace-nowrap">{date}</td>
      <td className="px-3 py-3 text-gray-700 whitespace-nowrap">{time}</td>
      <td className="px-3 py-3 text-gray-700">
        <div>{name}</div>
        <div className="text-xs text-gray-500">{number}</div>
      </td>
      <td className="px-3 py-3 text-gray-700 text-center">{cycle}</td>
    </tr>
  );
};

export default CallTableRow;
