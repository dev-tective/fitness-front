import ModelTable from "../../components/ModelTable.tsx";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { Membership } from "../../types/models.ts";
import useMembershipApi from "../../hooks/useMembershipApi.ts";

const MembershipMaintenance = () => {
    const [showForm, setShowForm] = useState(false);
    const { register, handleSubmit, reset } = useForm<Membership>({
        defaultValues: {
            name: "",
            sessionPersonalized: 0,
            sessionGroup: 0,
            price: 0,
            active: true,
        },
    });

    const {
        memberships,
        loading,
        error,
        createMembership,
        updateMembership,
        deleteMembership,
        setSelectedMembership,
        selectedMembership,
    } = useMembershipApi();

    const [action, setAction] = useState<"create" | "update" | "delete">("create");

    const onSubmit = async (data: Membership) => {
        try {
            if (action === "create") {
                await createMembership(data);
            } else if (action === "update" && selectedMembership?.id) {
                await updateMembership({ ...data, id: selectedMembership.id });
            } else if (action === "delete" && selectedMembership?.id) {
                await deleteMembership(selectedMembership.id);
            }

            reset();
            setSelectedMembership(null);
        } catch (error) {
            console.error("Error en acción:", error);
        }
    };

    useEffect(() => {
        if (selectedMembership) {
            setShowForm(true);
            reset(selectedMembership);
        } else {
            reset({
                name: "",
                sessionPersonalized: 0,
                sessionGroup: 0,
                price: 0,
                active: true,
            });
        }
    }, [selectedMembership, reset]);

    return (
        <div className="space-y-10">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-indigo-400 tracking-wide">
                    Mantenimiento de Membresías
                </h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                >
                    {showForm ? "✕ Ocultar Formulario" : "+ Mostrar Formulario"}
                </button>
            </div>

            {showForm && (
                <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-6 backdrop-blur-sm">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-400">Nombre:</label>
                            <input
                                {...register("name", { required: true })}
                                type="text"
                                className="bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-gray-200 focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-400">Duración:</label>
                            <input
                                {...register("duration", { required: true })}
                                type="number"
                                placeholder="Ej. 3 meses"
                                className="bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-gray-200 focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-400">Sesiones Personalizadas:</label>
                            <input
                                {...register("sessionPersonalized", { required: true })}
                                type="number"
                                className="bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-gray-200 focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-400">Sesiones Grupales:</label>
                            <input
                                {...register("sessionGroup", { required: true })}
                                type="number"
                                className="bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-gray-200 focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-400">Precio:</label>
                            <input
                                {...register("price", { required: true })}
                                type="number"
                                step="0.01"
                                className="bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-gray-200 focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div className="flex gap-3 mt-6 pt-4 border-t border-gray-700">
                            <button
                                type="submit"
                                onClick={() => setAction("create")}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                            >
                                Crear
                            </button>
                            <button
                                type="submit"
                                onClick={() => setAction("update")}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                            >
                                Actualizar
                            </button>
                            <button
                                type="submit"
                                onClick={() => setAction("delete")}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                            >
                                Eliminar
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {loading && <p className="text-gray-400 text-center animate-pulse">Cargando...</p>}

            {error && (
                <div className="bg-red-900/20 border border-red-800 rounded-lg p-4">
                    <p className="text-red-400">{error}</p>
                </div>
            )}

            {!loading && !error && (
                <ModelTable
                    select={setSelectedMembership}
                    models={memberships}
                />
            )}
        </div>
    );
};

export default MembershipMaintenance;