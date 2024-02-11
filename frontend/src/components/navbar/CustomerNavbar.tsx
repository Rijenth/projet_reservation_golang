import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import LogoutButton from '../LogoutButton';
import { Link } from 'react-router-dom';

export default function CustomerNavbar(): JSX.Element {
    const username = useSelector(
        (state: RootState) => state.authentication.user?.username
    );

    return (
        <nav className="bg-gray-800 p-4 rounded flex">
            <div className="container mx-auto flex items-center justify-between">
                <Link to="/" className="text-white">
                    FoodCourt - Espace client de {username}
                </Link>

                <div className="space-x-4">
                    <Link to="/dashboard/customer" className="text-white">
                        Accueil
                    </Link>

                    <Link
                        to="/dashboard/customer/places"
                        className="text-white"
                    >
                        Voir les lieux
                    </Link>

                    <Link
                        to="/dashboard/customer/commands"
                        className="text-white"
                    >
                        Mes commandes
                    </Link>

                    <LogoutButton />
                </div>
            </div>
        </nav>
    );
}
