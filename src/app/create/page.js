'use client'

import { useRouter } from 'next/navigation';
import axios from 'axios';
import UserForm from '../../components/UserForm';

const CreateUser = () => {
    const router = useRouter();

    const handleSaveUser = async (userData) => {
        try {
            const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
            const newUserId = storedUsers.length ? storedUsers[storedUsers.length - 1].id + 1 : 1;

            const newUser = { ...userData, id: newUserId };
            localStorage.setItem('users', JSON.stringify([...storedUsers, newUser]));

            await axios.post(`https://jsonplaceholder.typicode.com/users`, newUser);

            alert('User created successfully!');
            router.push('/');
        } catch (err) {
            console.error(err);
            alert('Error creating user');
        }
    };

    return (
        <div className='h-screen w-screen bg-dark-bg justify-center'>
            <UserForm
                isEditMode={false}
                user={null}
                onSave={handleSaveUser}
                onClose={() => router.push('/')}
            />
        </div>
    );
};

export default CreateUser;
