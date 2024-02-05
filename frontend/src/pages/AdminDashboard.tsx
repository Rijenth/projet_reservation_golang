import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import useLogout from '../hooks/useLogout';

export default function AdminDashboard(): JSX.Element {
    const userRole = useSelector(
        (state: RootState) => state.authentication.user?.role
    );
    const navigate = useNavigate();
    const logout = useLogout();

    useEffect(() => {
        if (userRole !== 'admin') {
            logout();

            navigate('/');

            return;
        }
    }, [userRole, navigate, logout]);

    return (
        <div>
            <h1>Admin Dashboard</h1>
        </div>
    );
}
