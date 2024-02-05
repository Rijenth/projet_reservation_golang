import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function OwnerDashboard(): JSX.Element {
    const userRole = useSelector(
        (state: RootState) => state.authentication.user?.role
    );
    const navigate = useNavigate();

    useEffect(() => {
        if (userRole !== 'owner') {
            navigate('/logout');

            return;
        }
    }, [userRole, navigate]);

    return (
        <div>
            <h1>Owner Dashboard</h1>
        </div>
    );
}
