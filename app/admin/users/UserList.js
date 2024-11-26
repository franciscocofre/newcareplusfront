export default function UserList({ users, onSelect }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {users.map((user) => (
        <div
          key={user.id}
          className="p-4 bg-white shadow rounded-lg hover:shadow-md cursor-pointer"
          onClick={() => onSelect(user)}
        >
          <h3 className="text-lg font-bold">{user.name}</h3>
          <p className="text-gray-600">Email: {user.email}</p>
          <p className="text-gray-600">Rol: {user.role}</p>
        </div>
      ))}
    </div>
  );
}
