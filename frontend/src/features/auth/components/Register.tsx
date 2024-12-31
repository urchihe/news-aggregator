import React from 'react';
import { useForm } from '@mantine/form';
import { useRegisterMutation } from '../authApi';

interface RegisterProps {
    onRegister: () => void;
}
interface RegisterFormValues {
    username: string;
    email: string;
    password: string;
}

const Register: React.FC<RegisterProps> = ({ onRegister }) => {
    const [register, { isLoading, error }] = useRegisterMutation();

    const form = useForm<RegisterFormValues>({
        initialValues: {
            name: '',
            email: '',
            password: '',
            password_confirmation: '',
        },
    });

    const handleRegister = async (values: typeof form.initialValues) => {
        try {
            await register(values).unwrap();
            alert('Registered successfully, you can now log in');
            onRegister();
            form.reset();
        } catch (err) {
            console.error('Registration failed:', err);
        }
    };

    return (
        <form
            className="w-full max-w-md mx-auto bg-white p-6 shadow rounded"
            onSubmit={form.onSubmit(handleRegister)}
        >
            {isLoading && <div className="fixed inset-0 bg-black bg-opacity-25 z-50" />}

            <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                    type="text"
                    placeholder="Your name"
                    className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                    {...form.getInputProps('name')}
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                    type="email"
                    placeholder="Your email"
                    className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                    {...form.getInputProps('email')}
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Password</label>
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                    {...form.getInputProps('password')}
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Confirm Password</label>
                <input
                    type="password"
                    placeholder="Confirm password"
                    className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                    {...form.getInputProps('password_confirmation')}
                />
            </div>

            {error && (
                <div className="text-red-500 text-sm mt-2">
                    {error?.data?.message || 'Registration failed. Please try again.'}
                </div>
            )}

            <button
                type="submit"
                className="w-full px-6 py-2 mt-4 text-white rounded bg-blue-500 hover:bg-blue-600 focus:outline-none"
                disabled={isLoading}
            >
                {isLoading ? 'Registering...' : 'Register'}
            </button>
        </form>
    );
};

export default Register;
