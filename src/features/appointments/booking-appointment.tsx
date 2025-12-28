export default function BookingAppointment () {
    return (
      <div className="bg-white p-6 sm:p-8 rounded-lg border border-gray-200">
        <div className="mb-8">
          <span className="bg-orange-100 text-[var(--accent)] font-semibold px-4 py-1.5 rounded-full">Step 2</span>
          <h2 className="font-bold text-gray-900 mt-3">Booking an Appointment</h2>
          <p className="text-gray-600 mt-1">Fill all necessary process to complete this.</p>
        </div>
  
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <label htmlFor="webhook-url" className="block text-sm font-medium text-gray-700 mb-2">Webhook URL</label>
            <input 
                type="text"
                id="webhook-url"
                placeholder="Paste"
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
            />
            <div className="flex flex-col sm:flex-row justify-end gap-4 mt-6">
                <button className="w-full sm:w-auto bg-gray-200 text-gray-700 font-semibold py-3 px-8 rounded-lg hover:bg-gray-300 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50">
                    Close
                </button>
                <button className="w-full sm:w-auto bg-[var(--accent)] text-white font-semibold py-3 px-8 rounded-lg hover:bg-[var(--accent-dark)] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 shadow-sm">
                    Submit
                </button>
            </div>
        </div>
      </div>
    );
  };
