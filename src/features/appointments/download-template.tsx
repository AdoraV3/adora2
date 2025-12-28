export default function DownloadTemplate () {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-lg border border-gray-200">
      <div className="mb-8">
        <span className="bg-orange-100 text-[var(--accent)] font-semibold px-4 py-1.5 rounded-full">Step 1</span>
        <h2 className="font-bold text-gray-900 mt-3">Set Up Calendar Availability</h2>
        <p className="text-gray-600 mt-1">Fill all necessary process to complete this.</p>
      </div>

      <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-6 text-center">
        <h3 className="font-semibold text-gray-900">Download Template</h3>
        <p className="text-gray-600 mt-1 mb-6">Get the make.com template her on Adora.</p>
        <div className="flex flex-col justify-center gap-4">
            <button className="w-full sm:w-auto bg-[var(--accent)] text-white font-semibold py-3 px-8 rounded-lg hover:bg-[var(--accent)] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-opacity-50 shadow-sm">
                Download
            </button>
            <button className="w-full sm:w-auto bg-gray-200 text-gray-700 font-semibold py-3 px-8 rounded-lg hover:bg-gray-300 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50">
                Close
            </button>
        </div>
      </div>
    </div>
  );
};