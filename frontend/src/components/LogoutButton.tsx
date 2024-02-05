import { useNavigate } from 'react-router-dom';

export default function LogoutButton(): JSX.Element {
    const navigate = useNavigate();

    return (
        <button className="text-white" onClick={() => navigate('/logout')}>
            Déconnexion
        </button>
    );
}
