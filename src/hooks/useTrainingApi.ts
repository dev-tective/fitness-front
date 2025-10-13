import { useEffect, useState } from "react";
import type { Training } from "../types/models.ts";
import api from "../service/api.ts";

function useTrainingApi() {
    const [selectedTraining, setSelectedTraining] = useState<Training | null>(null);
    const [trainings, setTrainings] = useState<Training[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // ✅ Crear entrenamiento
    const createTraining = async (training: Training) => {
        try {
            setLoading(true);

            // Asegurar que duration esté en formato ISO-8601 (PTxHxM)
            const formattedTraining = {
                ...training,
                duration: training.duration || "PT1H", // por defecto 1 hora
            };

            const response = await api.post<Training>("/training", formattedTraining);
            setTrainings((prev) => [...prev, response.data]);
        } catch (err) {
            console.error("Error al crear entrenamiento:", err);
            setError("Error al crear entrenamiento");
        } finally {
            setLoading(false);
        }
    };

    // ✅ Actualizar entrenamiento
    const updateTraining = async (training: Training) => {
        try {
            setLoading(true);

            const formattedTraining = {
                ...training,
                duration: training.duration || "PT1H",
            };

            const response = await api.put<Training>("/training", formattedTraining);
            setTrainings((prev) =>
                prev.map((t) => (t.id === training.id ? response.data : t))
            );
        } catch (err) {
            console.error("Error al actualizar entrenamiento:", err);
            setError("Error al actualizar entrenamiento");
        } finally {
            setLoading(false);
        }
    };

    // ✅ Eliminar entrenamiento
    const deleteTraining = async (id: number) => {
        try {
            setLoading(true);
            await api.delete(`/training/${id}`);
            setTrainings((prev) => prev.filter((t) => t.id !== id));
        } catch (err) {
            console.error("Error al eliminar entrenamiento:", err);
            setError("Error al eliminar entrenamiento");
        } finally {
            setLoading(false);
        }
    };

    // ✅ Obtener todos los entrenamientos
    useEffect(() => {
        const fetchTrainings = async () => {
            try {
                const response = await api.get<Training[]>("/training");
                // En caso de que duration venga como objeto (según tu backend), lo normalizamos a string
                const parsedData = response.data.map((t) => ({
                    ...t,
                    duration: typeof t.duration === "string"
                        ? t.duration
                        : t.duration || "PT0H",
                }));
                setTrainings(parsedData);
            } catch (err) {
                console.error("Error al obtener entrenamientos:", err);
                setError("Error al cargar los entrenamientos");
            } finally {
                setLoading(false);
            }
        };

        fetchTrainings();
    }, []);

    return {
        trainings,
        loading,
        error,
        createTraining,
        updateTraining,
        deleteTraining,
        selectedTraining,
        setSelectedTraining,
    };
}

export default useTrainingApi;