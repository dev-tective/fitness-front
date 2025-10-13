import { useEffect, useState } from "react";
import type { Membership } from "../types/models.ts";
import api from "../service/api.ts";

function useMembershipApi() {
    const [selectedMembership, setSelectedMembership] = useState<Membership | null>(null);
    const [memberships, setMemberships] = useState<Membership[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Crear membresía
    const createMembership = async (membership: Membership) => {
        try {
            setLoading(true);
            const response = await api.post<Membership>("/membership", membership);
            setMemberships((prev) => [...prev, response.data]);
        } catch (err) {
            console.error("Error al crear membresía:", err);
            setError("Error al crear membresía");
        } finally {
            setLoading(false);
        }
    };

    // Actualizar membresía
    const updateMembership = async (membership: Membership) => {
        try {
            setLoading(true);
            const response = await api.put<Membership>(`/membership`, membership);
            setMemberships((prev) =>
                prev.map((m) => (m.id === membership.id ? response.data : m))
            );
        } catch (err) {
            console.error("Error al actualizar membresía:", err);
            setError("Error al actualizar membresía");
        } finally {
            setLoading(false);
        }
    };

    // Eliminar membresía
    const deleteMembership = async (id: number) => {
        try {
            setLoading(true);
            await api.delete(`/membership/${id}`);
            setMemberships((prev) => prev.filter((m) => m.id !== id));
        } catch (err) {
            console.error("Error al eliminar membresía:", err);
            setError("Error al eliminar membresía");
        } finally {
            setLoading(false);
        }
    };

    // Obtener todas las membresías
    useEffect(() => {
        const fetchMemberships = async () => {
            try {
                const response = await api.get<Membership[]>("/membership");
                setMemberships(response.data);
            } catch (err) {
                console.error("Error al obtener membresías:", err);
                setError("Error al cargar las membresías");
            } finally {
                setLoading(false);
            }
        };

        fetchMemberships();
    }, []);

    return {
        memberships,
        loading,
        error,
        createMembership,
        updateMembership,
        deleteMembership,
        selectedMembership,
        setSelectedMembership,
    };
}

export default useMembershipApi;