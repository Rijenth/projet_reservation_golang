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
    customClass?: string;
    buttonMessage?: string;
    buttonColor?: string;
    handleDataCallback?: (data: unknown) => void;
}

const AsyncRequestButton: React.FC<AsyncRequestButton> = ({
    requestParams,
    customClass,
    buttonMessage = 'Appuyez ici',
    buttonColor = 'bg-gray-600 hover:bg-gray-800',
    handleDataCallback,
}: AsyncRequestButton) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);
    const buttonColorRef = useRef(buttonColor);
    const buttonColorError = 'bg-red-600 hover:bg-red-800';
    const buttonColorSuccess = 'bg-green-600 hover:bg-green-800';
    let className = `relative text-white rounded p-2 mr-4 min-w-20 ${buttonColorRef.current}`;

    if (customClass) {
        className = `${customClass} ${buttonColorRef.current}`;
    }

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

                setTimeout(() => {
                    setError(false);
                    buttonColorRef.current = buttonColor;
                }, 2000);
            } else {
                setSuccess(true);

                buttonColorRef.current = buttonColorSuccess;

                setTimeout(() => {
                    setSuccess(false);
                    buttonColorRef.current = buttonColor;
                }, 2000);

                if (handleDataCallback) {
                    const data = await response.json();

                    handleDataCallback(data);
                }
            }
        } catch (e) {
            setError(true);

            buttonColorRef.current = buttonColorError;

            setTimeout(() => {
                setError(false);
                buttonColorRef.current = buttonColor;
            }, 2000);
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
            {loading && <div className="loading loading-dots loading-xs"></div>}

            {error && (
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
            )}

            {success && (
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
            )}

            {!loading && !error && !success && (
                <span className="text-sm">{buttonMessage}</span>
            )}
        </button>
    );
};

export default AsyncRequestButton;
