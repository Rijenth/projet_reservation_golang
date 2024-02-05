import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function Logout(): JSX.Element {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        console.log('page logout');
        dispatch({ type: 'authentication/resetToDefault' });

        navigate('/');
    }, [dispatch, navigate]);

    return <div />;
}
