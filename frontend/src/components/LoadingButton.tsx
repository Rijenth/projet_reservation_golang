interface LoadingButtonProps {
    title: string;
    buttonClass: string;
    isLoading: boolean;
    hasError: boolean;
    onClickCallback?: () => void;
}

export default function LoadingButton({
    title,
    buttonClass,
    isLoading,
    hasError,
    onClickCallback,
}: LoadingButtonProps): JSX.Element {
    if (isLoading) {
        return (
            <button className={buttonClass} type="button" disabled>
                <div className="loading loading-dots loading-xs"></div>
            </button>
        );
    }

    if (hasError) {
        return (
            <button
                className={`${buttonClass} bg-red-800 hover:bg-red-900`}
                type="button"
                disabled
            >
                <span className="text-red-100">X</span>
            </button>
        );
    }

    return (
        <button className={buttonClass} type="button" onClick={onClickCallback}>
            {title}
        </button>
    );
}
