'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import "./globals.css";

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const localUsers = JSON.parse(localStorage.getItem('users')) || [];
        if (localUsers.length > 0) {
          setUsers(localUsers);
        } else {
          const response = await axios.get('https://jsonplaceholder.typicode.com/users');
          setUsers(response.data);
          localStorage.setItem('users', JSON.stringify(response.data));
        }
      } catch (err) {
        setError('Error fetching users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const deleteUser = async (id) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`);

        const updatedUsers = users.filter(user => user.id !== id);
        setUsers(updatedUsers);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
      } catch (err) {
        alert('Error deleting user');
      }
    }
  };

  const addUser = async (newUser) => {
    try {
      // Simulate a fake POST request
      await axios.post('https://jsonplaceholder.typicode.com/users', newUser);

      // Add user to local state and local storage
      const updatedUsers = [...users, { ...newUser, id: users.length + 1 }]; // Assign a fake ID
      setUsers(updatedUsers);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
    } catch (err) {
      alert('Error adding user');
    }
  };

  const updateUser = async (id, updatedData) => {
    try {
      await axios.put(`https://jsonplaceholder.typicode.com/users/${id}`, updatedData);

      const updatedUsers = users.map(user =>
        user.id === id ? { ...user, ...updatedData } : user
      );
      setUsers(updatedUsers);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
    } catch (err) {
      alert('Error updating user');
    }
  };

  const clearData = async () => {
    if (confirm("Are you sure you want to clear local data?")) {
      try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/users');
        setUsers(response.data);
        localStorage.setItem('users', JSON.stringify(response.data));

      } catch (err) {
        alert('Error deleting data');
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="min-w-screen bg-dark-bg flex justify-center py-8">
      <div className="flex flex-col container bg-dark-blue mx-auto px-16 py-12 mt-4 mb-auto rounded-lg shadow-lg">

        <table className="min-w-full bg-dark-gray shadow-md rounded-lg text-soft-white">
          <thead className="bg-light-blue text-dark-blue">
            <tr>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Email</th>
              <th className="py-2 px-4 text-left">Phone</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b border-soft-white">
                <td className="py-2 px-4">{user.name}</td>
                <td className="py-2 px-4">{user.email}</td>
                <td className="py-2 px-4">{user.phone}</td>
                <td className="py-2 px-4 space-x-2">
                  <button onClick={() => router.push(`/edit/${user.id}`)} className="bg-blue-500 text-soft-white px-2 py-1 rounded-lg">Edit</button>
                  <button onClick={() => deleteUser(user.id)} className="bg-red-500 text-soft-white px-2 py-1 rounded-lg">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className='flex justify-center gap-16'>
          <button onClick={() => router.push('/create')} className="bg-light-blue text-xl text-dark-blue px-6 py-3 rounded-lg mt-12 self-center">
            Create New User
          </button>

          <button onClick={clearData} className="bg-light-blue text-xl text-dark-blue px-6 py-3 rounded-lg mt-12 self-center">
            Clear local data
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserPage;