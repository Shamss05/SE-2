import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { deleteUser, getUsers, updateUserRole } from "../api/userApi.js";
import Loading from "../components/Loading.jsx";
import { getApiMessage } from "../utils/formatters.js";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    getUsers()
      .then(setUsers)
      .catch((err) => setError(getApiMessage(err, "Unable to load users.")))
      .finally(() => setLoading(false));
  }, []);

  const changeRole = async (id, role) => {
    try {
      await updateUserRole(id, role);
      setUsers((items) => items.map((user) => (user.id === id ? { ...user, role } : user)));
      setMessage("User role updated.");
    } catch (err) {
      setError(getApiMessage(err, "Role update is not available yet."));
    }
  };

  const remove = async (id) => {
    try {
      await deleteUser(id);
      setUsers((items) => items.filter((user) => user.id !== id));
      setMessage("User deleted.");
    } catch (err) {
      setError(getApiMessage(err, "Delete user is not available yet."));
    }
  };

  if (loading) return <Loading label="Loading users" />;

  return (
    <section className="page-section">
      <span className="eyebrow">Manage users</span>
      <h1>Platform members</h1>
      {error && <p className="form-error">{error}</p>}
      {message && <p className="form-success">{message}</p>}
      <div className="responsive-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.fullName || user.name}</td>
                <td>{user.email}</td>
                <td>
                  <select value={user.role} onChange={(event) => changeRole(user.id, event.target.value)}>
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </td>
                <td>
                  <button className="icon-button danger-soft" type="button" onClick={() => remove(user.id)} aria-label="Delete user">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
