'use client';

import axios from 'axios';
import { useEffect, useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '../types/User';
import useDebounce from '../hooks/useDebounce';

import "./globals.css";

const UserPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const debouncedSearchTerm = useDebounce<string>(searchTerm, 300); // 300ms debounce
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const localUsers = JSON.parse(localStorage.getItem('users') || '[]') as User[];
        if (localUsers.length > 0) {
          setUsers(localUsers);
          setFilteredUsers(localUsers);
        } else {
          const response = await axios.get<User[]>('https://jsonplaceholder.typicode.com/users');
          setUsers(response.data);
          setFilteredUsers(response.data);
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

  useEffect(() => {
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  useEffect(() => {
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [debouncedSearchTerm, users]);

  const deleteUser = async (id: number) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        // Simulate a fake delete request
        await axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`);

        const updatedUsers = users.filter(user => user.id !== id);
        setUsers(updatedUsers);
        setFilteredUsers(updatedUsers);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
      } catch (err) {
        alert('Error deleting user');
      }
    }
  };

  const addUser = async (newUser: Omit<User, 'id'>) => {
    try {
      // Simulate a fake POST request
      await axios.post('https://jsonplaceholder.typicode.com/users', newUser);

      // Assign a fake ID
      const fakeId = users.length > 0 ? users[users.length - 1].id + 1 : 1;
      const userWithId: User = { ...newUser, id: fakeId };

      const updatedUsers = [...users, userWithId];
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
    } catch (err) {
      alert('Error adding user');
    }
  };

  const updateUser = async (id: number, updatedData: Partial<User>) => {
    try {
      await axios.put(`https://jsonplaceholder.typicode.com/users/${id}`, updatedData);

      const updatedUsers = users.map(user =>
        user.id === id ? { ...user, ...updatedData } : user
      );
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
    } catch (err) {
      alert('Error updating user');
    }
  };

  const clearData = async () => {
    if (confirm("Are you sure you want to clear local data?")) {
      try {
        const response = await axios.get<User[]>('https://jsonplaceholder.typicode.com/users');
        setUsers(response.data);
        setFilteredUsers(response.data);
        localStorage.setItem('users', JSON.stringify(response.data));
      } catch (err) {
        alert('Error clearing data');
      }
    }
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const highlightText = (text: string, highlight: string) => {
    if (!highlight) return text;
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
      <>
        {parts.map((part, index) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <span key={index} className="bg-yellow-200">
              {part}
            </span>
          ) : (
            part
          )
        )}
      </>
    );
  };

  if (loading) {
    return (
      <div className="min-w-screen bg-dark-bg flex justify-center items-center h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen min-w-screen bg-dark-bg flex justify-center py-8">
      <div className="flex flex-col container bg-dark-blue mx-auto px-16 py-12 mt-4 mb-auto rounded-lg shadow-lg">

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search by name..."
            className="w-full p-2 border border-light-blue rounded-lg bg-gray-600"
          />
        </div>

        {/* Table */}
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
            {filteredUsers.map(user => (
              <tr key={user.id} className="border-b border-soft-white">
                <td className="py-2 px-4">{highlightText(user.name, searchTerm)}</td>
                <td className="py-2 px-4">{user.email}</td>
                <td className="py-2 px-4">{user.phone}</td>
                <td className="py-2 px-4 space-x-2">
                  <button
                    onClick={() => router.push(`/edit/${user.id}`)}
                    className="bg-blue-500 text-soft-white px-2 py-1 rounded-lg"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteUser(user.id)}
                    className="bg-red-500 text-soft-white px-2 py-1 rounded-lg"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className='flex justify-center gap-16'>
          <button
            onClick={() => router.push('/create')}
            className="bg-light-blue text-xl text-dark-blue px-6 py-3 rounded-lg mt-12 self-center"
          >
            Create New User
          </button>

          <button
            onClick={clearData}
            className="bg-light-blue text-xl text-dark-blue px-6 py-3 rounded-lg mt-12 self-center"
          >
            Clear local data
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserPage;