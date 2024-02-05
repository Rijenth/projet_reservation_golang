import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function AdminDashboard(): JSX.Element {
    const userRole = useSelector(
        (state: RootState) => state.authentication.user?.role
    );
    const navigate = useNavigate();

    useEffect(() => {
        if (userRole !== 'admin') {
            navigate('/logout');

            return;
        }
    }, [userRole, navigate]);

    return (
        <div>
            <h1>Admin Dashboard</h1>
        </div>
    );
}
