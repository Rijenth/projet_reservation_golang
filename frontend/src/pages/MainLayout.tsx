interface MainLayoutProps {
    children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps): JSX.Element {
    return <div>{children}</div>;
}
