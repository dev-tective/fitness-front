import { useAuth } from "../context/AuthContext.tsx";
import { Navigate, Outlet, Link } from "react-router-dom";

const PrivateLayout = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-900 text-gray-300">
                <p className="text-lg animate-pulse">Cargando...</p>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-900 text-gray-200">
            {/* Navbar */}
            <nav className="bg-gray-800/70 backdrop-blur-md border-b border-gray-700 shadow-lg">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

                    <h1 className="text-xl font-bold text-indigo-400 tracking-wide">
                        Fitness
                    </h1>

                    <div className="flex space-x-6 text-sm font-medium">
                        <Link to="/home"
                            className="hover:text-indigo-400 transition-colors duration-200"
                        >
                            Inicio
                        </Link>

                        <Link to="/user"
                            className="hover:text-indigo-400 transition-colors duration-200"
                        >
                            Usuarios
                        </Link>

                        <Link to="/site"
                            className="hover:text-indigo-400 transition-colors duration-200"
                        >
                            Sitios
                        </Link>

                        <Link to="/training"
                            className="hover:text-indigo-400 transition-colors duration-200"
                        >
                            Entrenamientos
                        </Link>

                        <Link to="/membership"
                            className="hover:text-indigo-400 transition-colors duration-200"
                        >
                            Membresías
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Contenido principal */}
            <main className="flex-1 p-8 bg-gray-900/90">
                <div className="max-w-7xl mx-auto bg-gray-800/60 border border-gray-700 rounded-2xl p-6 shadow-xl backdrop-blur-md">
                    <Outlet />
                </div>
            </main>

            {/* Footer */}
            <footer className="text-center text-gray-500 text-sm py-4 border-t border-gray-700 bg-gray-800/60">
                © {new Date().getFullYear()} Fitness — Todos los derechos reservados
            </footer>
        </div>
    );
};

export default PrivateLayout;