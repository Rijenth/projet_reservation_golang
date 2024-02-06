import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store/store';
import { useSelector } from 'react-redux';
import OverflowContainer from '../components/OverflowContainer';

interface CustomerDashboardMenuProps {
    restaurantId: number;
    restaurantName: string;
    selectedMenusHandler: (menu: Menu) => void;
}

export interface Menu {
    id: string;
    attributes: {
        name: string;
        price: number;
    };
}

export default function CustomerMenuList({
    restaurantId,
    restaurantName,
    selectedMenusHandler,
}: CustomerDashboardMenuProps): JSX.Element {
    const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

    const [menus, setMenus] = useState<Menu[]>([]);
    const token = useSelector((state: RootState) => state.authentication.token);
    const [errorMessage, setErrorMessage] = useState<string>('');

    const navigate = useNavigate();

    useEffect(() => {
        console.log('page restaurant list');

        setErrorMessage('');

        if (restaurantId === 0) {
            return;
        }

        fetch(`${apiUrl}/restaurants/${restaurantId}/menus`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    if (response.status === 401) {
                        navigate('/logout');
                        return;
                    }

                    throw new Error('Une erreur api est survenue');
                }

                return response.json();
            })
            .then((data) => {
                setMenus(data.data);
            })
            .catch((error) => {
                if (error?.message) {
                    setErrorMessage(error.message);
                    return;
                }

                setErrorMessage('Une erreur inconnue est survenue');
            });
    }, [apiUrl, token, navigate, restaurantId]);

    return (
        <>
            <OverflowContainer
                errorMessage={errorMessage}
                underlineTitle={`Les menus de "${restaurantName}"`}
            >
                <div className="flex flex-col space-y-4 overflow-y-auto h-full p-4 rounded-lg no-scrollbar">
                    {menus.map((menu) => (
                        <div
                            onClick={() => {
                                selectedMenusHandler(menu);
                            }}
                            key={menu.id}
                            className="flex flex-col items-center justify-center bg-white p-4 rounded-lg shadow-md w-96 hover:bg-gray-800 hover:text-white transition-all"
                        >
                            <h2 className="text-sm font-bold">
                                {menu.attributes.name}
                            </h2>
                            <p className="text-sm font-bold">
                                {menu.attributes.price} €
                            </p>
                        </div>
                    ))}
                </div>
            </OverflowContainer>
        </>
    );
}
