import React from "react";
import CallTableRow from "./CallTableRow";

const CallTable: React.FC = () => {
  const calls = [
    { date: "Jan-12-24", time: "8:00 am", name: "Ola Johnson", number: "08011122233", cycle: 2 },
    { date: "Jan-12-24", time: "8:00 pm", name: "Ola Johnson", number: "08011122233", cycle: 2 },
    { date: "Jan-12-24", time: "8:00 am", name: "Ola Johnson", number: "08011122233", cycle: 2 },
    { date: "Jan-12-24", time: "8:00 pm", name: "Ola Johnson", number: "08011122233", cycle: 2 },
    // more rows...
  ];

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[500px] border-collapse">
        <thead>
          <tr className="border-b bg-gray-50 text-left text-gray-600">
            <th className="px-3 py-3 font-medium">Date</th>
            <th className="px-3 py-3 font-medium">Time</th>
            <th className="px-3 py-3 font-medium">Name & Number</th>
            <th className="px-3 py-3 font-medium text-center">Call Cycle</th>
          </tr>
        </thead>
        <tbody>
          {calls.map((call, idx) => (
            <CallTableRow
              key={idx}
              date={call.date}
              time={call.time}
              name={call.name}
              number={call.number}
              cycle={call.cycle}
              highlight={idx % 2 === 1}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CallTable;
