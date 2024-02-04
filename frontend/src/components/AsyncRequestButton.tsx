import React, { useRef, useState } from 'react';

interface RequestParams {
    url: string;
    header?: {
        Authorization: string;
    };
    method: string;
    body?: string;
}

interface AsyncRequestButton {
    requestParams: RequestParams;
    buttonMessage?: string;
    buttonColor?: string;
}

const AsyncRequestButton: React.FC<AsyncRequestButton> = ({
    requestParams,
    buttonMessage = 'Appuyez ici',
    buttonColor = 'bg-gray-600 hover:bg-gray-800',
}: AsyncRequestButton) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);
    const buttonColorRef = useRef(buttonColor);
    const buttonColorError = 'bg-red-600 hover:bg-red-800';
    const buttonColorSuccess = 'bg-green-600 hover:bg-green-800';
    const className = `relative text-white rounded p-2 mr-4 min-w-20 min-h-10 ${buttonColorRef.current}`;

    const handleClick = async (): Promise<void> => {
        setLoading(true);
        setError(false);
        setSuccess(false);

        try {
            const response = await fetch(requestParams.url, {
                method: requestParams.method,
                headers: requestParams.header,
                body: requestParams.body,
            });

            if (!response.ok) {
                setError(true);

                buttonColorRef.current = buttonColorError;
            } else {
                setSuccess(true);

                buttonColorRef.current = buttonColorSuccess;

                setTimeout(() => {
                    setSuccess(false);
                    buttonColorRef.current = buttonColor;
                }, 2000);
            }
        } catch (e) {
            setError(true);

            buttonColorRef.current = buttonColorError;
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            className={className}
            disabled={loading || error}
            onClick={handleClick}
        >
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="loading loading-dots loading-xs"></div>
                </div>
            )}

            {error && (
                <>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-white mx-auto"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </>
            )}

            {success && (
                <>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-white mx-auto"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                </>
            )}

            {!loading && !error && !success && <span>{buttonMessage}</span>}
        </button>
    );
};

export default AsyncRequestButton;
