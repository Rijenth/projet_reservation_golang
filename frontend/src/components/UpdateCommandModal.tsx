import { useEffect, useState } from 'react';
import getCommandStatusTranslation from '../helpers/getCommandStatusTranslation';
import { CommandStatus, ICommand } from '../interfaces/ICommand';
import LoadingButton from './LoadingButton';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

interface UpdateCommandModalProps {
    command: ICommand;
    handleCloseModal: () => void;
}

export default function UpdateCommandModal({
    command,
    handleCloseModal,
}: UpdateCommandModalProps): JSX.Element {
    const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
    const token = useSelector((state: RootState) => state.authentication.token);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string>('dazfafeafae');
    const [errorMessages, setErrorMessages] = useState<string[]>([]);
    const [status, setStatus] = useState<CommandStatus>(
        command.attributes.status
    );

    useEffect(() => {
        return () => {
            setIsLoading(false);
            setSuccessMessage('');
            setErrorMessages([]);
        };
    }, []);

    const updateCommandStatus = async (): Promise<void> => {
        setIsLoading(true);

        if (status === command.attributes.status) {
            handleCloseModal();
            return;
        }

        const response = await fetch(`${apiUrl}/commands/${command.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                data: {
                    type: 'commands',
                    id: command.id,
                    attributes: {
                        status: status,
                    },
                },
            }),
        });

        if (!response.ok) {
            if (response.status === 401) {
                const data = await response.json();

                setErrorMessages(
                    data.errors.map((error: { detail: string }) => error.detail)
                );
                setIsLoading(false);
                return;
            }

            const data = await response.json();
            setErrorMessages(
                data.errors.map((error: { detail: string }) => error.detail)
            );
            setIsLoading(false);
            return;
        }

        setIsLoading(false);
        setSuccessMessage('La commande a été mise à jour avec succès');

        setTimeout(() => {
            handleCloseModal();
        }, 1500);
    };

    return (
        <div className="flex justify-center items-center fixed left-0 bottom-0 w-full h-full bg-black bg-opacity-50 z-50">
            <div className="flex flex-col bg-white p-4 rounded-lg shadow-md w-96 text-black">
                <h2 className="text-left text-xl font-bold mb-4 underline">
                    Mise à jour d&#39;une commande
                </h2>

                <p className="text-sm font-bold mb-4">
                    Status actuel de la commande :
                    <br />
                    {getCommandStatusTranslation(
                        command.attributes.status
                    ).toUpperCase()}
                </p>

                <label className="text-sm font-bold" htmlFor="status">
                    Nouveau status de la commande :
                </label>

                <select
                    className="w-full p-2 mt-2"
                    name="status"
                    id="status"
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>): void =>
                        setStatus(e.target.value as CommandStatus)
                    }
                >
                    {/* default */}
                    <option
                        value={command.attributes.status}
                        selected
                        className="text-sm"
                        disabled
                    >
                        -
                    </option>

                    {command.attributes.status === 'delivered' && <></>}
                    {command.attributes.status === 'ready' && (
                        <>
                            <option value="ongoing">En cours</option>
                            <option value="delivered">Livrée</option>
                        </>
                    )}

                    {command.attributes.status === 'ongoing' && (
                        <>
                            <option value="ready">Prêt</option>
                            <option value="delivered">Livrée</option>
                        </>
                    )}
                </select>

                {errorMessages.length > 0 && (
                    <div className="text-red-800 text-center border-2 border-red-500 p-1 mt-2 mx-4 rounded-lg bg-red-400">
                        {errorMessages.map((error) => (
                            <p key={error}>{error}</p>
                        ))}
                    </div>
                )}

                {successMessage && (
                    <p className="text-green-800 text-center border-2 border-green-500 p-1 mt-2 mx-4 rounded-lg bg-green-400">
                        {successMessage}
                    </p>
                )}

                <LoadingButton
                    title="Mettre à jour la commande"
                    buttonClass="bg-green-500 hover:bg-green-600 px-4 py-2 text-white rounded mt-2"
                    isLoading={isLoading}
                    hasError={errorMessages.length > 0}
                    onClickCallback={updateCommandStatus}
                />

                <button
                    className="bg-gray-500 hover:bg-gray-600 px-4 py-2 text-white rounded mt-2"
                    onClick={handleCloseModal}
                >
                    Fermer
                </button>
            </div>
        </div>
    );
}
