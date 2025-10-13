import { useForm } from "react-hook-form";
import type { Site } from "../../types/models.ts";
import { useEffect, useState } from "react";
import useSiteApi from "../../hooks/useSiteApi.ts";
import ModelTable from "../../components/ModelTable.tsx";

const SiteMaintenance = () => {
    const [showForm, setShowForm] = useState(false)
    const { register, handleSubmit, reset } = useForm<Site>({
        defaultValues: {
            name: "",
            type: "Aire Libre",
            address: "",
            closing: "",
            opening: "",
            capacity: 0,
            active: true,
        },
    });

    const {
        sites,
        loading,
        error,
        createSite,
        updateSite,
        deleteSite,
        setSelectedSite,
        selectedSite
    } = useSiteApi();

    const [action, setAction] = useState<"create" | "update" | "delete">("create")

    const onSubmit = async (data: Site) => {
        try {
            if (action === "create") {
                await createSite(data);
            } else if (action === "update" && selectedSite?.id) {
                await updateSite({ ...data, id: selectedSite.id });
            } else if (action === "delete" && selectedSite?.id) {
                await deleteSite(selectedSite.id);
            }

            reset(); // limpia el formulario
            setSelectedSite(null); // limpia la selección
        } catch (error) {
            console.error("Error en acción:", error);
        }
    };

    useEffect(() => {
        if (selectedSite) {
            setShowForm(true)
            reset(selectedSite);
        } else {
            reset({
                name: "",
                type: "Aire Libre",
                address: "",
                closing: "",
                opening: "",
                capacity: 0,
                active: true,
            });
        }
    }, [selectedSite, reset]);

    return (
        <div className="space-y-10">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-indigo-400 tracking-wide">
                    Mantenimiento de Sitios
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
                            <label className="text-sm font-medium text-gray-400">Nombre:</label>
                            <input
                                {...register("name", {required: true})}
                                type="text"
                                className="bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-400">Tipo:</label>
                            <select
                                {...register("type", {required: true})}
                                className="bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                            >
                                <option value="">Seleccione una opción</option>
                                <option>Aire Libre</option>
                                <option>Local</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-400">Dirección:</label>
                            <input
                                {...register("address", {required: true})}
                                type="text"
                                className="bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-400">Apertura:</label>
                            <input
                                {...register("opening", {required: true})}
                                type="time"
                                className="bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-400">Cierre:</label>
                            <input
                                {...register("closing", {required: true})}
                                type="time"
                                className="bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-400">Capacidad:</label>
                            <input
                                {...register("capacity", {required: true})}
                                type="number"
                                className="bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                            />
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
                    select={setSelectedSite}
                    models={sites}
                />
            )}
        </div>

    )
};

export default SiteMaintenance;