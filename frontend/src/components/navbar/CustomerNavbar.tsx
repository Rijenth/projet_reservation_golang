import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import LogoutButton from '../LogoutButton';

export default function CustomerNavbar(): JSX.Element {
    const username = useSelector(
        (state: RootState) => state.authentication.user?.username
    );

    return (
        <nav className="bg-gray-800 p-4 rounded flex">
            <div className="container mx-auto flex items-center justify-between">
                <a href="/" className="text-white">
                    FoodCourt - Espace client de {username}
                </a>

                <div className="space-x-4">
                    <a href="/dashboard/customer" className="text-white">
                        Voir tout les lieux
                    </a>
                    <a href="#" className="text-white">
                        Voir mes commandes
                    </a>

                    <LogoutButton />
                </div>
            </div>
        </nav>
    );
}
