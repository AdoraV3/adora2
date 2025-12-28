import { CheckCircle, X } from "lucide-react";
import { FC } from "react";

const SuccessToast: FC<{ title: string; message: string; onClose: () => void }> = ({ title, message, onClose }) => (
    <div className="fixed top-5 right-5 z-50 bg-white rounded-xl shadow-lg p-4 w-full max-w-sm">
        <div className="flex items-start">
            <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
            <div className="ml-3 w-0 flex-1 pt-0.5">
                <p className="text-md font-bold text-gray-900">{title}</p>
                <p className="mt-1 text-sm text-gray-600">{message}</p>
            </div>
            <div className="ml-4 flex-shrink-0 flex">
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                    <X size={20} />
                </button>
            </div>
        </div>
    </div>
);

export default SuccessToast