import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import LogoutButton from '../LogoutButton';

export default function AdminNavbar(): JSX.Element {
    const username = useSelector(
        (state: RootState) => state.authentication.user?.username
    );

    return (
        <nav className="bg-gray-800 p-4 rounded flex">
            <div className="container mx-auto flex items-center justify-between">
                <a href="/" className="text-white">
                    FoodCourt - Espace administrateur(rice) de {username}
                </a>

                <div className="space-x-4">
                    <a href="/dashboard/admin" className="text-white">
                        Voir tous mes lieux
                    </a>

                    <LogoutButton />
                </div>
            </div>
        </nav>
    );
}
