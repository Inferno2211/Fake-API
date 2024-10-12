'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import UserForm from '../../../components/UserForm';
import { User } from '../../../types/User'; // Adjust the import path as necessary

const EditUser: React.FC = () => {
    const router = useRouter();
    const { id } = useParams() as { id: string };
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            try {
                const localUsers = JSON.parse(localStorage.getItem('users') || '[]') as User[];
                const userToEdit = localUsers.find((user) => user.id === parseInt(id));

                if (userToEdit) {
                    setUser(userToEdit);
                } else {
                    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
                    if (!response.ok) throw new Error('Network response was not ok');
                    const data: User = await response.json();
                    setUser(data);

                    // Update localStorage with the new user data
                    const updatedLocalUsers = [...localUsers, data];
                    localStorage.setItem('users', JSON.stringify(updatedLocalUsers));
                }
            } catch (err) {
                setError('Error fetching user');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [id]);

    const handleSaveUser = async (userData: User) => {
        try {
            const storedUsers = JSON.parse(localStorage.getItem('users') || '[]') as User[];
            const updatedUsers = storedUsers.map((u) => (u.id === userData.id ? userData : u));
            localStorage.setItem('users', JSON.stringify(updatedUsers));

            // Simulate a fake PUT request
            // await axios.put(`https://jsonplaceholder.typicode.com/users/${id}`, userData);

            alert('User updated successfully!');
            router.push('/');
        } catch (err) {
            console.error(err);
            alert('Error updating user');
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    if (!user) return <p>User not found</p>;

    return (
        <div className='h-screen w-screen bg-dark-bg justify-center'>
            <UserForm
                isEditMode={true}
                user={user}
                onSave={handleSaveUser}
                onClose={() => router.push('/')}
            />
        </div>
    );
};

export default EditUser;