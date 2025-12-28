import { FC } from "react";
import ModalWrapper from "./modal-wrapper";

const UpgradePlanModal: FC<{ onConfirm: () => void; onCancel: () => void }> = ({ onConfirm, onCancel }) => (
  <ModalWrapper onClose={onCancel}>
    <div className="text-left">
      <h2 className="text-xl font-bold text-gray-900">Upgrade Plan</h2>
      <p className="text-gray-600 mt-2">
        It looks like you've reached the limit of your current plan! To continue enjoying Adora's full features, please upgrade your plan.
      </p>
      <div className="flex gap-4 mt-6">
        <button onClick={onCancel} className="flex-1 py-2.5 px-4 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50">
          Cancel
        </button>
        <button onClick={onConfirm} className="flex-1 py-2.5 px-4 bg-amber-800 text-white rounded-lg font-semibold hover:bg-amber-900">
          Upgrade Plan
        </button>
      </div>
    </div>
  </ModalWrapper>
);

export default UpgradePlanModal;