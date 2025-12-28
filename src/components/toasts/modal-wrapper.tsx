import { X } from "lucide-react";
import { FC, ReactNode } from "react";

const ModalWrapper: FC<{ children: ReactNode; onClose: () => void }> = ({ children, onClose }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000086]"
    onClick={onClose}
  >
    <div
      className="relative bg-white rounded-xl shadow-lg p-8 w-full max-w-md m-4"
      onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
    >
      <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
        <X size={24} />
      </button>
      {children}
    </div>
  </div>
);

export default ModalWrapper;