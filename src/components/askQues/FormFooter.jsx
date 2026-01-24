import React from 'react';

const FormFooter = ({
  user,
  isSubmitting,
  onCancel,
  submitText,
  showSpinner = false
}) => {
  return (
    <div
      className="flex items-center justify-between pt-5 mt-6 border-t"
      style={{ borderColor: 'rgba(139, 92, 246, 0.15)' }}
    >
      <div className="text-sm text-gray-500">
        Posting as: <span className="font-medium text-violet-600">{user?.name}</span> ({user?.department} - Year {user?.year})
      </div>
      <div className="flex space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 text-violet-600 border-2 border-violet-200 rounded-xl hover:bg-violet-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 font-medium transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-6 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 flex items-center justify-center font-medium transition-all ${isSubmitting
              ? 'cursor-not-allowed opacity-70'
              : 'text-white hover:opacity-90'
            }`}
          style={{
            background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
            boxShadow: isSubmitting ? 'none' : '0 4px 15px rgba(139, 92, 246, 0.3)'
          }}
        >
          {isSubmitting && showSpinner ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Posting...
            </>
          ) : (
            submitText
          )}
        </button>
      </div>
    </div>
  );
};

export default FormFooter;
