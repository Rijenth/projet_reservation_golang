import React from 'react';

interface OverflowContainerProps {
    children: React.ReactNode;
    underlineTitle: string;
    errorMessage: string;
}

export default function OverflowContainer({
    children,
    underlineTitle,
    errorMessage,
}: OverflowContainerProps): JSX.Element {
    return (
        <div
            className="flex flex-col items-center justify-center border-2 border-gray-400 p-8 rounded-lg shadow-md w-1/2 max-w-[500px] bg-gray-800"
            style={{ height: '80vh' }}
        >
            {errorMessage && (
                <div className="w-full text-center bg-red-400 rounded-lg p-4">
                    <p className="text-red-800 text-sm mb-4">{errorMessage}</p>
                </div>
            )}

            {errorMessage === '' && (
                <>
                    <h1 className="text-white text-xl font-bold mb-4 underline">
                        {underlineTitle}
                    </h1>

                    {children}
                </>
            )}
        </div>
    );
}
