import React, { useEffect, useContext } from "react";
import { AppContext } from "../../context/AppContext";

const ContactList = () => {
  const { contacts, getAllContacts, deleteContact } = useContext(AppContext);
  console.log("all contacts", getAllContacts)

  // Fetch contacts when the component mounts
  useEffect(() => {
    getAllContacts();
  }, []);

  return (
    <div className="p-2 sm:p-5">
      <h2 className="mb-4 text-lg sm:text-xl font-semibold text-gray-700">
        Messages Clients
      </h2>

      {/* Main Responsive Container */}
      <div className="w-full overflow-hidden bg-white rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-3 sm:px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-3 sm:px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Email / Tel
                </th>
                <th className="hidden sm:table-cell px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Message
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
              {contacts && contacts.length > 0 ? (
                contacts.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-3 sm:px-5 py-4 border-b border-gray-200 text-xs sm:text-sm">
                      <p className="text-gray-900 font-medium break-words max-w-[80px] sm:max-w-none">
                        {item.name}
                      </p>
                    </td>

                    {/* UPDATED EMAIL AND TEL SECTION */}
                    <td className="px-3 sm:px-5 py-4 border-b border-gray-200 text-xs sm:text-sm">
                      <div className="flex flex-col gap-1">
                        <a
                          href={`mailto:${item.email}`}
                          className="text-indigo-600 hover:underline truncate max-w-[120px] sm:max-w-none"
                          title="Envoyer un email"
                        >
                          {item.email}
                        </a>
                        <a
                          href={`tel:${item.telephone}`}
                          className="text-gray-500 hover:text-indigo-600 text-[10px] sm:text-xs font-medium"
                          title="Appeler le client"
                        >
                          {item.telephone}
                        </a>
                      </div>
                    </td>

                    <td className="hidden sm:table-cell px-5 py-4 border-b border-gray-200 text-sm">
                      <p className="text-gray-600 line-clamp-2 max-w-xs">
                        {item.message}
                      </p>
                    </td>
                    <td className="px-3 sm:px-5 py-4 border-b border-gray-200 text-xs sm:text-sm">
                      <p className="text-gray-600 whitespace-nowrap">
                        {new Date(item.createdAt).toLocaleDateString("fr-FR")}
                      </p>
                    </td>
                    <td className="px-3 sm:px-5 py-4 border-b border-gray-200 text-sm text-center">
                      <button
                        onClick={() => deleteContact(item.id)}
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
                    Aucun message trouvé.
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

export default ContactList;
