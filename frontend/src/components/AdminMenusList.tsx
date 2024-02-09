import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store/store';
import { useSelector } from 'react-redux';
import OverflowContainer from './OverflowContainer';
import { IMenu } from '../interfaces/IMenu';

interface CustomerDashboardMenuProps {
    restaurantId: number;
    restaurantName: string;
}

export default function AdminMenusList({
    restaurantId,
    restaurantName,
}: CustomerDashboardMenuProps): JSX.Element {
    const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
    const token = useSelector((state: RootState) => state.authentication.token);

    const [menus, setMenus] = useState<IMenu[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>('');

    const navigate = useNavigate();

    useEffect(() => {
        console.log('page menus list for admin');

        setErrorMessage('');

        if (restaurantId === 0) {
            return;
        }

        const fetchMenus = async (): Promise<void> => {
            await fetch(`${apiUrl}/restaurants/${restaurantId}/menus`, {
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

                    setErrorMessage(
                        'Une erreur inconnue est survenue lors de la récupération des menus'
                    );
                });
        };

        fetchMenus();
    }, [apiUrl, token, navigate, restaurantId]);

    return (
        <>
            <OverflowContainer
                errorMessage={errorMessage}
                underlinedTitle={`Les menus de "${restaurantName}"`}
            >
                <div className="flex flex-col space-y-4 overflow-y-auto h-full p-4 rounded-lg no-scrollbar">
                    {menus.map((menu) => (
                        <div
                            key={menu.id}
                            className="flex flex-col items-center justify-center bg-white p-4 rounded-lg shadow-md w-96"
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
