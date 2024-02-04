import React, { useState } from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import ChangePageButton from '../components/ChangePageButton';
import Title from '../components/Title';
import Response from '../components/Response';
import { Res } from '../types/Types';

const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

const Register: React.FC = () => {
    const [FirstName, setFirstName]: [string, (nom: string) => void] =
        useState('');
    const [LastName, setLastName]: [string, (prenom: string) => void] =
        useState('');
    const [Username, setUsername]: [string, (email: string) => void] =
        useState('');
    const [Password, setPassword]: [string, (password: string) => void] =
        useState('');
    const [Role, setRole]: [string, (Role: string) => void] = useState('');

    const [response, setResponse] = useState<[] | Res[]>([]);

    const navigate: NavigateFunction = useNavigate();

    const register = (e: React.FormEvent): void => {
        e.preventDefault();

        fetch(`${apiUrl}/register`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/vnd.api+json',
            },
            body: JSON.stringify({
                Data: {
                    Type: 'users',
                    Attributes: {
                        FirstName,
                        LastName,
                        Username,
                        Password,
                        Role,
                    },
                },
            }),
        })
            .then((response: Response) => {
                if (!response.ok) {
                    return response.json().then((err: Error) => {
                        throw err;
                    });
                }
                return response.json();
            })
            .then((data) => {
                if (data && data.data) {
                    navigate('/');
                }
            })

            .catch((error) => {
                console.error('Error:', error);

                setResponse(error.errors);
            });
    };

    const connexion = (): void => {
        navigate('/');
    };

    return (
        <div>
            <Title title="Create an Account !"></Title>
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <div className="space-y-6">
                    <form className="space-y-5" onSubmit={register}>
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                LastName
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    value={LastName}
                                    onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                    ): void => setLastName(e.target.value)}
                                ></input>
                            </div>
                        </div>
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                FirstName
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    value={FirstName}
                                    onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                    ): void => setFirstName(e.target.value)}
                                ></input>
                            </div>
                        </div>
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Username
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    required
                                    value={Username}
                                    onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                    ): void => setUsername(e.target.value)}
                                ></input>
                            </div>
                        </div>
                        <div>
                            <label
                                htmlFor="role"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Role
                            </label>
                            <div className="mt-2">
                                <select
                                    required
                                    className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    value={Role}
                                    onChange={(
                                        e: React.ChangeEvent<HTMLSelectElement>
                                    ): void => setRole(e.target.value)}
                                >
                                    <option value="">Select a role</option>
                                    <option value="owner">Owner</option>
                                    <option value="customer">Customer</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Password
                            </label>
                            <div className="mt-2">
                                <input
                                    type="password"
                                    required
                                    className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    value={Password}
                                    onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                    ): void => setPassword(e.target.value)}
                                ></input>
                            </div>
                        </div>
                        <div>
                            <input
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                value="Register"
                            ></input>
                        </div>
                    </form>
                    <ChangePageButton
                        buttonFunction={connexion}
                        page="Login"
                    ></ChangePageButton>
                    <Response response={response}></Response>
                </div>
            </div>
        </div>
    );
};

export default Register;
