import { Trash2 } from "lucide-react";
import ModalWrapper from "./modal-wrapper";
import { FC } from "react";

const DeleteConfirmationModal: FC<{ onConfirm: () => void; onCancel: () => void }> = ({ onConfirm, onCancel }) => (
  <ModalWrapper onClose={onCancel}>
    <div className="flex flex-col items-center text-center">
      <div className="bg-red-100 rounded-full p-3 mb-4">
        <Trash2 className="text-red-600" size={28} />
      </div>
      <h2 className="text-xl font-bold text-gray-900">Delete knowledge base</h2>
      <p className="text-gray-600 mt-2">
        Are you sure you want to delete this knowledge base? This action cannot be undone.
      </p>
      <div className="flex gap-4 mt-6 w-full">
        <button onClick={onCancel} className="flex-1 py-2.5 px-4 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50">
          Cancel
        </button>
        <button onClick={onConfirm} className="flex-1 py-2.5 px-4 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700">
          Delete
        </button>
      </div>
    </div>
  </ModalWrapper>
);

export default DeleteConfirmationModal;