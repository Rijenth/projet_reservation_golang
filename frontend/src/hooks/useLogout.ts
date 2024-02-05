import { useDispatch } from 'react-redux';

export default function useLogout(): () => void {
    const dispatch = useDispatch();

    return () => {
        dispatch({ type: 'authentication/resetToDefault' });
    };
}
