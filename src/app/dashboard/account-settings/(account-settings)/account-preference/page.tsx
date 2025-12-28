'use client'

import DeleteConfirmationModal from "@/components/toasts/delete-confirmation";
import PreferenceSelectField from "@/features/account-settings/preference/preference-select-field";
import { useState } from "react";

export default function PreferencesContent() {

  const [confirm, setConfirm] = useState(false);

  const toggle =()=> {
    setConfirm(!confirm)
  };

  const languageOptions = ["English (US)", "Spanish (ES)", "French (FR)"];
  const timezoneOptions = ["(UTC-08:00) Pacific Time (US & Canada)", "(UTC-05:00) Eastern Time (US & Canada)", "(UTC) Coordinated Universal Time"];

  return (
    <>
      <div className="p-6 space-y-8">
      {/* Account Preferences Header */}
      <div className="space-y-2">
        <h2 className="font-semibold text-gray-800">Account preferences</h2>
        <p className="text-gray-500">Control settings related to your account.</p>
      </div>
      
      {/* Language & Region Section */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-800">Language & Region</h3>
        <p className="text-gray-500">Update your language and timezone</p>
        <div className="flex flex-col gap-4">
          <PreferenceSelectField label="Language" value="English (US)" options={languageOptions} />
          <PreferenceSelectField label="Time zone" value="(UTC-08:00) Pacific Time (US & Canada)" options={timezoneOptions} />
        </div>
      </div>

      {/* Delete Account Section */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-800">Delete your account</h3>
        <p className="text-gray-500">
          When you delete your account, you lose access to Adora account services, and we permanently delete your personal data. You can cancel the deletion within 14 days.
        </p>
        <button onClick={toggle} className="w-fit px-6 py-3 bg-white text-red-500 font-semibold rounded-lg shadow-md border border-red-500 hover:bg-red-50 transition-colors duration-200">
          Delete account
        </button>
      </div>
      </div>
      {
        confirm && <DeleteConfirmationModal onConfirm={()=>{}} onCancel={toggle} />
      }
    </>
  );
}
