import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { Training } from "../../types/models.ts";
import useTrainingApi from "../../hooks/useTrainingApi.ts";
import ModelTable from "../../components/ModelTable.tsx";

const TrainingMaintenance = () => {
    const [showForm, setShowForm] = useState(false);
    const { register, handleSubmit, reset } = useForm<Training>({
        defaultValues: {
            name: "",
            description: "",
            duration: "PT1H", // 1 hora por defecto
            maxParticipants: 1,
            active: true,
        },
    });

    const {
        trainings,
        loading,
        error,
        createTraining,
        updateTraining,
        deleteTraining,
        selectedTraining,
        setSelectedTraining,
    } = useTrainingApi();

    const [action, setAction] = useState<"create" | "update" | "delete">("create");

    const onSubmit = async (data: Training) => {
        try {
            if (action === "create") {
                await createTraining(data);
            } else if (action === "update" && selectedTraining?.id) {
                await updateTraining({ ...data, id: selectedTraining.id });
            } else if (action === "delete" && selectedTraining?.id) {
                await deleteTraining(selectedTraining.id);
            }

            reset();
            setSelectedTraining(null);
        } catch (error) {
            console.error("Error en acción:", error);
        }
    };

    useEffect(() => {
        if (selectedTraining) {
            setShowForm(true);
            reset(selectedTraining);
        } else {
            reset({
                name: "",
                description: "",
                duration: "PT1H",
                maxParticipants: 1,
                active: true,
            });
        }
    }, [selectedTraining, reset]);

    const convertToDurationISO = (hours: number, minutes: number) => {
        return `PT${hours}H${minutes > 0 ? `${minutes}M` : ""}`;
    };

    return (
        <div className="space-y-10">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-indigo-400 tracking-wide">
                    Mantenimiento de Entrenamientos
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
                    <form
                        onSubmit={handleSubmit((formData) => {
                            // Convertimos horas y minutos a formato ISO antes de enviar
                            const hours = Number(formData.durationHours || 0);
                            const minutes = Number(formData.durationMinutes || 0);
                            const durationISO = convertToDurationISO(hours, minutes);
                            onSubmit({ ...formData, duration: durationISO });
                        })}
                        className="space-y-4"
                    >
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-400">
                                Nombre:
                            </label>
                            <input
                                {...register("name", { required: true })}
                                type="text"
                                className="bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-400">
                                Descripción:
                            </label>
                            <textarea
                                {...register("description", { required: true })}
                                rows={3}
                                className="bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                            />
                        </div>

                        <div className="flex gap-4">
                            <div className="flex flex-col flex-1 gap-2">
                                <label className="text-sm font-medium text-gray-400">
                                    Horas:
                                </label>
                                <input
                                    {...register("durationHours")}
                                    type="number"
                                    min={0}
                                    className="bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                />
                            </div>

                            <div className="flex flex-col flex-1 gap-2">
                                <label className="text-sm font-medium text-gray-400">
                                    Minutos:
                                </label>
                                <input
                                    {...register("durationMinutes")}
                                    type="number"
                                    min={0}
                                    max={59}
                                    className="bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-400">
                                Máximo de Participantes:
                            </label>
                            <input
                                {...register("maxParticipants", { required: true })}
                                type="number"
                                className="bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
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

            {/* Estados */}
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
                <ModelTable select={setSelectedTraining} models={trainings} />
            )}
        </div>
    );
};

export default TrainingMaintenance;
