interface MainLayoutProps {
    children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps): JSX.Element {
    return (
        <div className="bg-red-500">
            <h1>This is the main layout</h1>
            {children}
        </div>
    );
}
