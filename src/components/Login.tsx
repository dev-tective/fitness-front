import { useState } from "react";
import { useAuth } from "../context/AuthContext.tsx";
import { useNavigate } from "react-router-dom";
import {type SubmitHandler, useForm} from "react-hook-form";

interface ILoginForm {
    email: string;
    password: string;
}

const Login = () => {
    const { register, handleSubmit } = useForm<ILoginForm>();
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin: SubmitHandler<ILoginForm> = async (data) => {
        setError('');
        setLoading(true);

        const result =
            await login(data.email, data.password);

        setLoading(false);

        if (result.success) {
            navigate('/home');
        } else {
            setError(result.error || 'Error desconocido');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-900">
            <div className="bg-gray-800/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-sm border border-gray-700">
                <h2 className="text-3xl font-bold text-center text-white mb-6 tracking-wide">
                    Iniciar Sesión
                </h2>

                <form onSubmit={handleSubmit(handleLogin)} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Email
                        </label>
                        <input
                            {...register('email', { required: true })}
                            type="email"
                            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            placeholder="tucorreo@ejemplo.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            {...register('password', { required: true })}
                            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <div className="text-sm text-red-400 bg-red-900/30 border border-red-700 p-2 rounded-lg">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-indigo-700/40"
                    >
                        {loading ? "Cargando..." : "Iniciar Sesión"}
                    </button>
                </form>
            </div>
        </div>
    )
};

export default Login;