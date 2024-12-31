import React, { useState } from 'react';
import { useLoginMutation } from '../authApi';


interface loginProps {
    onLogin: () => void;
}
const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [login, { isLoading, error }] = useLoginMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await login({ email, password }).unwrap();
            console.log('Login successful:', response);
            localStorage.setItem('token', response.token);
            onLogin()
        } catch (err) {
            console.error('Login failed:', err);
        }
    };

    return (
        <form
            className="w-full max-w-md mx-auto bg-white p-6 shadow rounded"
            onSubmit={handleSubmit}
        >
            <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Email:</label>
                <input
                    type="email"
                    value={email}
                    className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Password:</label>
                <input
                    type="password"
                    value={password}
                    className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <button
                type="submit"
                className="w-full px-6 py-2 mt-4 text-white rounded bg-blue-500 hover:bg-blue-600 focus:outline-none"
                disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login'}
            </button>
            {error && <p className="error">Error: {error.toString()}</p>}
        </form>
    );
};

export default Login;
