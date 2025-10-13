import { useAuth } from "../context/AuthContext.tsx";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="text-gray-200">
            <div className="flex items-center justify-between p-3">
                <div className={'flex flex-col gap-6'}>
                    <h1 className="text-3xl font-bold text-indigo-400 tracking-wide">
                        Bienvenido 👋
                    </h1>
                    <div className="space-y-3">
                        <p className="text-gray-300">
                            <span className="font-semibold text-gray-100">Email:</span>{" "}
                            {user?.email || "No disponible"}
                        </p>

                        <p className="text-gray-300">
                            <span className="font-semibold text-gray-100">Rol:</span>{" "}
                            {user?.role || "Sin rol asignado"}
                        </p>
                    </div>
                </div>
                <div className={'flex flex-col gap-5'}>
                    <button
                        onClick={handleLogout}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold shadow-md hover:shadow-indigo-700/40 transition"
                    >
                        Cambiar Contraseña
                    </button>
                    <button
                        onClick={handleLogout}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold shadow-md hover:shadow-red-700/40 transition"
                    >
                        Cerrar Sesión
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Home;