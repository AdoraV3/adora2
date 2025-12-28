'use client' 

import { FC, useState } from "react";
import ModalWrapper from "./modal-wrapper";

const ApiInputModal: FC<{ onSubmit: (apiKey: string) => void; onCancel: () => void }> = ({ onSubmit, onCancel }) => {
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = () => {
    if (apiKey.trim()) {
      onSubmit(apiKey);
    }
  };

  return (
    <ModalWrapper onClose={onCancel}>
      <div className="text-left">
        <h2 className="text-xl font-bold text-gray-900 mb-4">API</h2>
        <input
          type="text"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="enter YOUR API"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-[var(--accent)] focus:border-[var(--accent-dark)]"
        />
        <div className="flex justify-end mt-6">
          <button onClick={handleSubmit} className="py-2.5 px-8 bg-[var(--accent)] text-white rounded-lg font-semibold hover:bg-[var(--accent-dark)]">
            Submit
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default ApiInputModal;