import { useEffect, useState } from "react";
import {
  Users,
  Search,
  Pencil,
  Trash2,
  Shield,
  UserCheck,
  UserX,
  X,
  Save,
} from "lucide-react";
import { useAppContext } from "../../context/AppContext";



export default function UserManagement() {
  const {
    getUsers,
    updateUser,
    deleteUser,
  } = useAppContext();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const [editingUser, setEditingUser] = useState(null);

  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "CASHIER",
    is_active: true,
  });

  /* =========================================
     LOAD USERS
  ========================================= */

  const loadUsers = async () => {
    const data = await getUsers();

    if (data) {
      setUsers(data);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  /* =========================================
     DELETE USER
  ========================================= */

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Deactivate this user?"
    );

    if (!confirmDelete) return;

    await deleteUser(id);

    loadUsers();
  };

  /* =========================================
     OPEN EDIT MODAL
  ========================================= */

  const handleEdit = (user) => {
    setEditingUser(user);

    setEditForm({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      role: user.role || "CASHIER",
      is_active: user.is_active,
    });
  };

  /* =========================================
     UPDATE USER
  ========================================= */

  const handleUpdate = async (e) => {
    e.preventDefault();

    await updateUser(editingUser.id, editForm);

    setEditingUser(null);

    loadUsers();
  };

  /* =========================================
     FILTER USERS
  ========================================= */

  const filteredUsers = users.filter((user) =>
    `${user.name} ${user.email} ${user.phone}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="h-7 w-7 text-blue-600" />
            User Management
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Manage cashiers, managers and administrators
          </p>
        </div>

        {/* SEARCH */}
        <div className="relative w-full lg:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />

          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-full
              pl-10
              pr-4
              py-3
              rounded-xl
              border
              border-gray-300
              bg-white
              focus:ring-2
              focus:ring-blue-500
              outline-none
            "
          />
        </div>
      </div>

      {/* USERS TABLE */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">

        {/* DESKTOP */}
        <div className="hidden lg:block overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-left">
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  User
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  Phone
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  Role
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  Status
                </th>

                <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition"
                >

                  {/* USER */}
                  <td className="px-6 py-5">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {user.name}
                      </h3>

                      <p className="text-sm text-gray-500">
                        {user.email}
                      </p>
                    </div>
                  </td>

                  {/* PHONE */}
                  <td className="px-6 py-5 text-sm text-gray-700">
                    {user.phone || "-"}
                  </td>

                  {/* ROLE */}
                  <td className="px-6 py-5">
                    <span
                      className={`
                        px-3 py-1 rounded-full text-xs font-semibold
                        ${
                          user.role === "ADMIN"
                            ? "bg-red-100 text-red-700"
                            : user.role === "MANAGER"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                        }
                      `}
                    >
                      {user.role}
                    </span>
                  </td>

                  {/* STATUS */}
                  <td className="px-6 py-5">
                    {user.is_active ? (
                      <span className="flex items-center gap-2 text-green-600 text-sm font-medium">
                        <UserCheck className="h-4 w-4" />
                        Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 text-red-500 text-sm font-medium">
                        <UserX className="h-4 w-4" />
                        Disabled
                      </span>
                    )}
                  </td>

                  {/* ACTIONS */}
                  <td className="px-6 py-5">
                    <div className="flex items-center justify-end gap-3">

                      <button
                        onClick={() => handleEdit(user)}
                        className="
                          flex items-center gap-2
                          px-4 py-2
                          rounded-lg
                          bg-blue-50
                          text-blue-600
                          hover:bg-blue-100
                          transition
                        "
                      >
                        <Pencil className="h-4 w-4" />
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(user.id)}
                        className="
                          flex items-center gap-2
                          px-4 py-2
                          rounded-lg
                          bg-red-50
                          text-red-600
                          hover:bg-red-100
                          transition
                        "
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>

                    </div>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>

        {/* MOBILE */}
        <div className="lg:hidden p-4 space-y-4">

          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="border border-gray-100 rounded-2xl p-4 shadow-sm"
            >

              <div className="flex items-start justify-between gap-3">

                <div>
                  <h3 className="font-bold text-gray-900">
                    {user.name}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {user.email}
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    {user.phone}
                  </p>
                </div>

                <span
                  className={`
                    px-3 py-1 rounded-full text-xs font-semibold
                    ${
                      user.role === "ADMIN"
                        ? "bg-red-100 text-red-700"
                        : user.role === "MANAGER"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-green-100 text-green-700"
                    }
                  `}
                >
                  {user.role}
                </span>

              </div>

              <div className="flex gap-3 mt-5">

                <button
                  onClick={() => handleEdit(user)}
                  className="
                    flex-1
                    py-2.5
                    rounded-xl
                    bg-blue-600
                    text-white
                    text-sm
                    font-medium
                  "
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(user.id)}
                  className="
                    flex-1
                    py-2.5
                    rounded-xl
                    bg-red-600
                    text-white
                    text-sm
                    font-medium
                  "
                >
                  Delete
                </button>

              </div>

            </div>
          ))}

        </div>
      </div>

      {/* EDIT MODAL */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">

            {/* HEADER */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">

              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Edit User
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Update user information and permissions
                </p>
              </div>

              <button
                onClick={() => setEditingUser(null)}
                className="
                  w-10 h-10 rounded-full
                  bg-gray-100 hover:bg-red-100
                  flex items-center justify-center
                  text-gray-500 hover:text-red-600
                  transition
                "
              >
                <X className="h-5 w-5" />
              </button>

            </div>

            {/* FORM */}
            <form
              onSubmit={handleUpdate}
              className="p-6 space-y-5"
            >

              {/* NAME */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>

                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      name: e.target.value,
                    })
                  }
                  className="
                    w-full
                    px-4 py-3
                    rounded-xl
                    border border-gray-300
                    focus:ring-2 focus:ring-blue-500
                    outline-none
                  "
                />
              </div>

              {/* EMAIL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>

                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      email: e.target.value,
                    })
                  }
                  className="
                    w-full
                    px-4 py-3
                    rounded-xl
                    border border-gray-300
                    focus:ring-2 focus:ring-blue-500
                    outline-none
                  "
                />
              </div>

              {/* PHONE */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>

                <input
                  type="text"
                  value={editForm.phone}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      phone: e.target.value,
                    })
                  }
                  className="
                    w-full
                    px-4 py-3
                    rounded-xl
                    border border-gray-300
                    focus:ring-2 focus:ring-blue-500
                    outline-none
                  "
                />
              </div>

              {/* ROLE */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Role
                </label>

                <select
                  value={editForm.role}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      role: e.target.value,
                    })
                  }
                  className="
                    w-full
                    px-4 py-3
                    rounded-xl
                    border border-gray-300
                    focus:ring-2 focus:ring-blue-500
                    outline-none
                  "
                >
                  <option value="CASHIER">CASHIER</option>
                  <option value="MANAGER">MANAGER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>

              {/* STATUS */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={editForm.is_active}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      is_active: e.target.checked,
                    })
                  }
                  className="w-5 h-5"
                />

                <label className="text-sm font-medium text-gray-700">
                  Active User
                </label>
              </div>

              {/* BUTTONS */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">

                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="
                    flex-1
                    py-3
                    rounded-xl
                    border border-gray-300
                    text-gray-700
                    font-medium
                  "
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="
                    flex-1
                    py-3
                    rounded-xl
                    bg-blue-600
                    hover:bg-blue-700
                    text-white
                    font-medium
                    flex items-center justify-center gap-2
                  "
                >
                  <Save className="h-4 w-4" />
                  Save Changes
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}