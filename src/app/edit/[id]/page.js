'use client'

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import UserForm from '../../../components/UserForm';

const EditUser = () => {
    const router = useRouter();
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true); // Start loading state
            try {
                const localUsers = JSON.parse(localStorage.getItem('users')) || [];
                console.log(localUsers);
                const user = localUsers.find((user) => user.id === parseInt(id));

                if (user) {
                    setUser(user);
                    console.log("found");
                }
                else {
                    const response = await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`);
                    setUser(response.data);
                    // Update localStorage with the new user data
                    localUsers.push(response.data); // Add new user to local storage
                    localStorage.setItem('users', JSON.stringify(localUsers));
                }
            } catch (err) {
                setError('Error fetching user');
            } finally {
                setLoading(false); // End loading state
            }
        };

        fetchUser();
    }, [id]);

    const handleSaveUser = async (userData) => {
        try {
            const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
            const updatedUsers = storedUsers.map((u) => (u.id === userData.id ? userData : u));
            localStorage.setItem('users', JSON.stringify(updatedUsers));

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

    return (
        <div className='h-screen w-screen bg-dark-bg flex justify-center'>
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