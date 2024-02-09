import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import LoadingButton from './LoadingButton';
import { useState } from 'react';
import { roundFloatNumber } from '../helpers/roundFloatNumber';

interface RestaurantMenuItemsHandlerProps {
    restaurantId: string;
    showComponentCallback: (component: 'menu' | 'menu-item') => void;
}

export default function RestaurantMenuItemsHandler({
    restaurantId,
    showComponentCallback,
}: RestaurantMenuItemsHandlerProps): JSX.Element {
    const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
    const token = useSelector((state: RootState) => state.authentication.token);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [hasError, setHasError] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [errorMessages, setErrorMessages] = useState<string[]>([]);
    const [name, setName] = useState<string>('');
    const [type, setType] = useState<'starter' | 'main' | 'dessert' | 'drink'>(
        'starter'
    );
    // price is a float number
    const [price, setPrice] = useState<number>(0);

    const createMenuItem = async (
        e: React.FormEvent<HTMLFormElement>
    ): Promise<void> => {
        e.preventDefault();

        setIsLoading(true);
        setHasError(false);
        setSuccessMessage('');
        setErrorMessages([]);

        const menuItem = {
            data: {
                type: 'menu_items',
                attributes: {
                    name: name,
                    type: type,
                    price: price,
                },
            },
        };

        const response = await fetch(
            `${apiUrl}/restaurants/${restaurantId}/menu-items`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(menuItem),
            }
        );

        if (!response.ok) {
            if (response.status === 401) {
                setErrorMessages([
                    'Vous devez être connecté pour effectuer cette action.',
                ]);
                setIsLoading(false);
                setHasError(true);

                setTimeout(() => {
                    setHasError(false);
                }, 2000);

                return;
            }

            const json = await response.json();

            if (json.errors.length > 0) {
                setErrorMessages(
                    json.errors.map((error: { detail: string }) => error.detail)
                );
            } else {
                setErrorMessages(['Une erreur est survenue.']);
            }

            setIsLoading(false);

            return;
        }

        setIsLoading(false);

        setSuccessMessage('Ingrédient créé avec succès.');

        setTimeout(() => {
            setSuccessMessage('');
        }, 2000);

        setName('');
        setPrice(0);
    };

    return (
        <div className="container min-w-[500px] max-w-[500px] w-1/2">
            <div className="flex flex-col space-y-4 border border-gray-200 p-4 rounded shadow-md h-auto">
                <h2 className="text-xl font-bold">Nouvel ingrédient</h2>

                <p>Ajoutez un nouvel ingrédient à votre restaurant.</p>

                <form
                    onSubmit={createMenuItem}
                    className="flex flex-col space-y-4"
                >
                    <label htmlFor="menu-item-name">
                        Nom de l&#39;ingrédient
                    </label>
                    <input
                        type="text"
                        name="menu-item-name"
                        className="border border-gray-300 rounded p-2"
                        placeholder="Olives"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />

                    <label htmlFor="menu-item-type">Type</label>
                    <select
                        name="menu-item-type"
                        className="border border-gray-300 rounded p-2"
                        onChange={(e) =>
                            setType(
                                e.target.value as
                                    | 'starter'
                                    | 'main'
                                    | 'dessert'
                                    | 'drink'
                            )
                        }
                        required
                    >
                        <option value="starter" defaultChecked>
                            Entrée
                        </option>
                        <option value="main">Plat</option>
                        <option value="dessert">Dessert</option>
                        <option value="drink">Boisson</option>
                    </select>

                    <label htmlFor="menu-item-price">Prix</label>
                    <input
                        type="number"
                        step="0.01"
                        name="menu-item-price"
                        className="border border-gray-300 rounded p-2"
                        placeholder="5.99 €"
                        value={price}
                        onChange={(e) =>
                            setPrice(
                                roundFloatNumber(parseFloat(e.target.value))
                            )
                        }
                        required
                    />

                    {successMessage && (
                        <div className="mt-4 bg-green-400 rounded-lg p-4">
                            <p className="text-green-800 text-sm">
                                {successMessage}
                            </p>
                        </div>
                    )}

                    {errorMessages &&
                        errorMessages.map((error, index) => (
                            <div
                                className="flex flex-col items-center justify-center bg-red-400 p-4 rounded-lg mt-4"
                                key={index}
                            >
                                <p className="text-red-800 text-sm">{error}</p>
                            </div>
                        ))}

                    <LoadingButton
                        title="Créer un ingrédient"
                        isLoading={isLoading}
                        hasError={hasError}
                        buttonClass="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-800"
                        buttonType="submit"
                    />
                </form>

                <button
                    className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-800"
                    onClick={() => showComponentCallback('menu')}
                >
                    Ajouter un menu à mon restaurant
                </button>
            </div>
        </div>
    );
}
