import React from "react";

interface SubmitButtonProps {
  onClick?: () => void;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="mt-4 w-full sm:w-40 bg-orange-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-orange-600 transition"
    >
      Submit
    </button>
  );
};

export default SubmitButton;
