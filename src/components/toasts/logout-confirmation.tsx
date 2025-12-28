'use client'

import { FC } from "react"
import { LogOut, AlertCircle } from 'lucide-react'

const LogoutConfirmationModal: FC<{ onConfirm: () => void; onCancel: () => void }> = ({ onConfirm, onCancel }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
    onClick={onCancel}
  >
    <div
      className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="p-4 bg-red-50 rounded-full">
          <AlertCircle className="w-12 h-12 text-red-500" />
        </div>
        
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Logout</h2>
          <p className="text-base text-gray-600 leading-relaxed">
            Are you sure you want to logout? You will need to login again to access your account.
          </p>
        </div>

        <div className="flex gap-4 pt-4 w-full">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-3 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors duration-200 font-semibold text-sm"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-6 py-3 rounded-lg text-white bg-red-500 hover:bg-red-600 transition-colors duration-200 font-semibold text-sm flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Yes, Logout
          </button>
        </div>
      </div>
    </div>
  </div>
)

export default LogoutConfirmationModal
