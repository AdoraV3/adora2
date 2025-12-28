'use client'

import React, { useState } from "react";
import TabButton from "./TabButton";

const Tabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"recent" | "past">("recent");

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
      <div className="flex gap-2">
        <TabButton
          label="Recent Call Logs"
          active={activeTab === "recent"}
          onClick={() => setActiveTab("recent")}
        />
        <TabButton
          label="Past Call Logs"
          active={activeTab === "past"}
          onClick={() => setActiveTab("past")}
        />
      </div>
    </div>
  );
};

export default Tabs;
