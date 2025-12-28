'use client'

import { useState } from "react";

/**
 * A component for the business number input with a country code dropdown.
 */
export default function WritableBusinessNumberField() {
  const [countryCode, setCountryCode] = useState('+1');
  const [number, setNumber] = useState('23456789');

  return (
    <div className="flex flex-col space-y-2">
      <label className="font-medium text-gray-700">Business Number</label>
      <div className="flex gap-2 overflow-hidden">
        <select
          value={countryCode}
          onChange={(e) => setCountryCode(e.target.value)}
          className="p-3 text-gray-800 rounded-md appearance-none bg-gray-100"
        >
          <option>+1</option>
          <option>+44</option>
          <option>+91</option>
        </select>
        <input
          type="text"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          className="flex-1 p-3 rounded-md bg-gray-100 text-gray-800 focus:outline-none"
        />
      </div>
    </div>
  );
}