import { useEffect, useState } from "react";
import type { Site } from "../types/models.ts";
import api from "../service/api.ts";

function useSiteApi() {
    const [selectedSite, setSelectedSite] = useState<Site | null>(null)
    const [sites, setSites] = useState<Site[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Crear sitio
    const createSite = async (site: Site) => {
        try {
            setLoading(true);
            const response = await api.post<Site>("/site", site);
            setSites((prev) => [...prev, response.data]);
        } catch (err) {
            console.error("Error al crear sitio:", err);
            setError("Error al crear sitio");
        } finally {
            setLoading(false);
        }
    };

    // Actualizar sitio
    const updateSite = async (site: Site) => {
        try {
            setLoading(true);
            const response = await api.put<Site>(`/site`, site);
            setSites((prev) =>
                prev.map((s) => (s.id === site.id ? response.data : s))
            ); // ✅ reemplaza el actualizado
        } catch (err) {
            console.error("Error al actualizar sitio:", err);
            setError("Error al actualizar sitio");
        } finally {
            setLoading(false);
        }
    };

    // Eliminar sitio
    const deleteSite = async (id: number) => {
        try {
            setLoading(true);
            await api.delete(`/site/${id}`);
            setSites(prev => prev.filter(s => s.id === id));
        } catch (err) {
            console.error("Error al eliminar sitio:", err);
            setError("Error al eliminar sitio");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchSites = async () => {
            try {
                const response = await api.get<Site[]>("/site");
                setSites(response.data);
            } catch (err) {
                console.error("Error al obtener sitios:", err);
                setError("Error al cargar los sitios");
            } finally {
                setLoading(false);
            }
        };

        fetchSites();
    }, []);

    return {
        sites,
        loading,
        error,
        createSite,
        updateSite,
        deleteSite,
        setSelectedSite,
        selectedSite
    };
}

export default useSiteApi;
