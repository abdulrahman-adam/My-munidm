import React, { useEffect, useContext } from "react";
import { AppContext } from "../../context/AppContext";

const PartenaireList = () => {
  const { partenaires, getAllPartenaires, deletePartenaire } = useContext(AppContext);

  // Fetch partenaires when the component mounts
  useEffect(() => {
    getAllPartenaires();
  }, []);

  return (
    <div className="p-2 sm:p-5">
      <h2 className="mb-4 text-lg sm:text-xl font-semibold text-gray-700">
        Candidatures Partenaires
      </h2>

      {/* Main Responsive Container */}
      <div className="w-full overflow-hidden bg-white rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-3 sm:px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Entreprise / SIRET
                </th>
                <th className="px-3 sm:px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Email / Secteur
                </th>
                <th className="hidden lg:table-cell px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Motivation
                </th>
                <th className="px-3 sm:px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-3 sm:px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {partenaires && partenaires.length > 0 ? (
                partenaires.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* COMPANY & SIRET */}
                    <td className="px-3 sm:px-5 py-4 border-b border-gray-200 text-xs sm:text-sm">
                      <div className="flex flex-col">
                        <p className="text-gray-900 font-bold break-words">
                          {item.companyName}
                        </p>
                        <p className="text-gray-500 text-[10px]">
                          SIRET: {item.siret}
                        </p>
                      </div>
                    </td>

                    {/* EMAIL & PROFESSION */}
                    <td className="px-3 sm:px-5 py-4 border-b border-gray-200 text-xs sm:text-sm">
                      <div className="flex flex-col gap-1">
                        <a
                          href={`mailto:${item.contactEmail}`}
                          className="text-indigo-600 hover:underline truncate max-w-[120px] sm:max-w-none"
                        >
                          {item.contactEmail}
                        </a>
                        <span className="text-gray-500 bg-indigo-50 px-2 py-0.5 rounded-full text-[10px] w-fit">
                          {item.profession}
                        </span>
                      </div>
                    </td>

                    {/* DESCRIPTION (Hidden on small screens) */}
                    <td className="hidden lg:table-cell px-5 py-4 border-b border-gray-200 text-sm">
                      <p className="text-gray-600 line-clamp-2 max-w-xs">
                        {item.description}
                      </p>
                    </td>

                    {/* DATE */}
                    <td className="px-3 sm:px-5 py-4 border-b border-gray-200 text-xs sm:text-sm">
                      <p className="text-gray-600 whitespace-nowrap">
                        {new Date(item.createdAt).toLocaleDateString("fr-FR")}
                      </p>
                    </td>

                    {/* ACTIONS */}
                    <td className="px-3 sm:px-5 py-4 border-b border-gray-200 text-sm text-center">
                      <button
                        onClick={() => deletePartenaire(item.id)}
                        className="text-red-500 hover:text-red-700 font-semibold transition-colors text-xs sm:text-sm"
                      >
                        <span className="hidden sm:inline">Supprimer</span>
                        <i className="bi bi-trash sm:hidden text-lg"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-5 py-10 border-b border-gray-200 bg-white text-center text-gray-500"
                  >
                    Aucune candidature partenaire trouvée.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PartenaireList;