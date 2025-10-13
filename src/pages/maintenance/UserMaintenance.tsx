import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import ModelTable from "../../components/ModelTable.tsx";
import useUserApi from "../../hooks/useUserApi.ts";
import type { User } from "../../types";

const UserMaintenance = () => {
    const [showForm, setShowForm] = useState(false);
    const { register, handleSubmit, reset } = useForm<User>({
        defaultValues: {
            email: "",
            password: "",
            active: true,
            role: "CLIENT",
        },
    });

    const {
        users,
        loading,
        error,
        createUser,
        updateUser,
        deleteUser,
        selectedUser,
        setSelectedUser,
    } = useUserApi();

    const [action, setAction] = useState<"create" | "update" | "delete">("create");

    const onSubmit = async (data: User) => {
        try {
            if (action === "create") {
                data.active = true;
                await createUser(data);
            } else if (action === "update" && selectedUser?.id) {
                await updateUser({ ...data, id: selectedUser.id });
            } else if (action === "delete" && selectedUser?.id) {
                await deleteUser(selectedUser.id);
            }

            reset();
            setSelectedUser(null);
        } catch (error) {
            console.error("Error en acción:", error);
        }
    };

    useEffect(() => {
        if (selectedUser) {
            setShowForm(true);
            reset(selectedUser);
        } else {
            reset({
                email: "",
                password: "",
                active: true,
                role: "CLIENT",
            });
        }
    }, [selectedUser, reset]);


    return (
        <div className="space-y-10">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-indigo-400 tracking-wide">
                    Mantenimiento de Usuarios
                </h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                >
                    {showForm ? '✕ Ocultar Formulario' : '+ Mostrar Formulario'}
                </button>
            </div>

            {showForm && (
                <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-6 backdrop-blur-sm">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-400">Correo:</label>
                            <input
                                {...register("email", { required: true })}
                                type="email"
                                className="bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-400">Contraseña:</label>
                            <input
                                {...register("password", { required: true })}
                                type="password"
                                className="bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-400">Rol:</label>
                            <select
                                {...register("role", { required: true })}
                                className="bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                            >
                                <option value="ADMIN">Administrador</option>
                                <option value="CLIENT">Cliente</option>
                                <option value="EMPLOYEE">Empleado</option>
                            </select>
                        </div>

                        <div className="flex gap-3 mt-6 pt-4 border-t border-gray-700">
                            <button
                                type="submit"
                                onClick={() => setAction("create")}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                            >
                                Crear
                            </button>

                            <button
                                type="submit"
                                onClick={() => setAction("update")}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                            >
                                Actualizar
                            </button>

                            <button
                                type="submit"
                                onClick={() => setAction("delete")}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                            >
                                Eliminar
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {loading && (
                <div className="flex items-center justify-center py-12">
                    <p className="text-lg text-gray-400 animate-pulse">Cargando...</p>
                </div>
            )}

            {error && (
                <div className="bg-red-900/20 border border-red-800 rounded-lg p-4">
                    <p className="text-red-400">{error}</p>
                </div>
            )}

            {!loading && !error && (
                <ModelTable
                    select={setSelectedUser}
                    models={users}
                />
            )}
        </div>
    );
};

export default UserMaintenance;