import React from 'react';

interface ChangePageButtonProps {
    buttonFunction: () => void;
    page: string;
}

const ChangePageButton: React.FC<ChangePageButtonProps> = ({
    buttonFunction,
    page,
}) => {
    return (
        <button
            className="flex w-full justify-center rounded-md bg-indigo-400 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={buttonFunction}
        >
            {page}
        </button>
    );
};

export default ChangePageButton;
