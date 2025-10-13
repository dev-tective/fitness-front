import { useState } from "react";
import type { ApiEntity } from "../types/models.ts";

interface ModelTableProps<T extends ApiEntity> {
    models: T[];
    select: (model: T) => void;
}

const ModelTable = <T extends ApiEntity>({ models, select }: ModelTableProps<T>) => {
    const [filter, setFilter] = useState("");
    const [viewAll, setViewAll] = useState(false);

    if (!models || models.length === 0) {
        return (
            <div className="flex items-center justify-center py-12 bg-gray-800/30 border border-gray-700 rounded-lg">
                <p className="text-gray-500">No hay datos para mostrar</p>
            </div>
        );
    }

    // Obtenemos las claves de los objetos, excluyendo contraseñas
    const keys = Object.keys(models[0] ?? {}).filter(key => key !== "password") as (keyof T)[];

    // Determinamos si el modelo tiene "name" o "email" para usar en el filtro
    const getFilterValue = (model: T) => {
        const anyModel = model as any;
        return anyModel.name || anyModel.email || "";
    };

    const filteredModels = models.filter(model => {
        const value = getFilterValue(model).toLowerCase();
        const matchesFilter = value.includes(filter.toLowerCase());
        const matchesActive = viewAll ? true : (model as any).active !== false;
        return matchesFilter && matchesActive;
    });

    return (
        <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-4 justify-between">
                <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-gray-400">
                        Buscar:
                    </label>
                    <input
                        type="text"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        placeholder="Filtrar por nombre o email..."
                        className="bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <input
                        id="viewAll"
                        type="checkbox"
                        checked={viewAll}
                        onChange={(e) => setViewAll(e.target.checked)}
                        className="accent-indigo-500 cursor-pointer"
                    />
                    <label htmlFor="viewAll" className="text-sm font-medium text-gray-400 cursor-pointer">
                        Ver todos
                    </label>
                </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-700 bg-gray-800/30">
                <table className="w-full">
                    <thead>
                    <tr className="bg-gray-800/60 border-b border-gray-700">
                        {keys.map((key) => (
                            <th
                                key={String(key)}
                                className="text-center px-6 py-3 text-sm font-semibold text-indigo-400 tracking-wide"
                            >
                                {String(key).toUpperCase()}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {filteredModels.map((model, index) => (
                        <tr
                            key={(model as any).id ?? index}
                            onClick={() => select(model)}
                            className="border-b border-gray-700/50 hover:bg-gray-700/30 cursor-pointer transition-colors duration-150"
                        >
                            {keys.map((key) => (
                                <td
                                    key={String(key)}
                                    className="px-6 py-4 text-sm text-gray-300 text-center"
                                >
                                    {String((model as any)[key])}
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <p className="text-sm text-gray-500 text-center">
                Mostrando {filteredModels.length} de {models.length} registros
            </p>
        </div>
    );
};

export default ModelTable;