import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import OwnerNavbar from '../components/navbar/OwnerNavbar';
import CustomerNavbar from '../components/navbar/CustomerNavbar';

interface MainLayoutProps {
    children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps): JSX.Element {
    const authentication = useSelector(
        (state: RootState) => state.authentication
    );

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 lg:px-8">
            {authentication.user?.role === 'customer' && (
                <div className="py-6">
                    <CustomerNavbar />
                </div>
            )}

            {authentication.user?.role === 'owner' && (
                <div className="py-6">
                    <OwnerNavbar />
                </div>
            )}

            {children}
        </div>
    );
}
