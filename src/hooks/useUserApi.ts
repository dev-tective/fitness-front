import { useEffect, useState } from "react";
import api from "../service/api.ts";
import type { User } from "../types";

function useUserApi() {
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const createUser = async (user: User) => {
        try {
            setLoading(true);
            const response = await api.post<User>("/user", user);
            setUsers((prev) => [...prev, response.data]);
        } catch (err) {
            console.error("Error al crear usuario:", err);
            setError("Error al crear usuario");
        } finally {
            setLoading(false);
        }
    };

    const updateUser = async (user: User) => {
        try {
            setLoading(true);
            const response = await api.put<User>("/user", user);
            setUsers((prev) =>
                prev.map((u) => (u.id === user.id ? response.data : u))
            );
        } catch (err) {
            console.error("Error al actualizar usuario:", err);
            setError("Error al actualizar usuario");
        } finally {
            setLoading(false);
        }
    };

    const deleteUser = async (id: number) => {
        try {
            setLoading(true);
            await api.delete(`/user/${id}`);
            setUsers((prev) => prev.filter((u) => u.id !== id));
        } catch (err) {
            console.error("Error al eliminar usuario:", err);
            setError("Error al eliminar usuario");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get<User[]>("/user");
                setUsers(response.data);
            } catch (err) {
                console.error("Error al obtener usuarios:", err);
                setError("Error al cargar los usuarios");
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    return {
        users,
        loading,
        error,
        createUser,
        updateUser,
        deleteUser,
        selectedUser,
        setSelectedUser,
    };
}

export default useUserApi;