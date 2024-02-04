type Model = {
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
};

export type User = {
    first_name: string;
    last_name: string;
    username: string;
    password: string;
    role: 'admin' | 'customer' | 'owner';
} & Model;

export type Res = {
    title: string;
    detail: string;
    status: string;
};
