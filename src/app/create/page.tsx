'use client';

import { useRouter } from 'next/navigation';
import UserForm from '../../components/UserForm';
import { User } from '../../types/User'; // Adjust the import path as necessary

const CreateUser: React.FC = () => {
    const router = useRouter();

    const handleSaveUser = async (userData: Omit<User, 'id' | 'address' | 'company'> & {
        address: { street: string; city: string };
        company: { name: string };
    }) => {
        try {
            const storedUsers = JSON.parse(localStorage.getItem('users') || '[]') as User[];
            const newUserId = storedUsers.length ? storedUsers[storedUsers.length - 1].id + 1 : 1;

            const newUser: User = {
                id: newUserId,
                name: userData.name,
                email: userData.email,
                phone: userData.phone,
                username: userData.username,
                address: {
                    street: userData.address.street,
                    city: userData.address.city,
                },
                company: {
                    name: userData.company.name,
                },
                website: userData.website,
            };

            const updatedUsers = [...storedUsers, newUser];
            localStorage.setItem('users', JSON.stringify(updatedUsers));

            // Simulate a fake POST request
            await fetch('https://jsonplaceholder.typicode.com/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser),
            });

            alert('User created successfully!');
            router.push('/');
        } catch (err) {
            console.error(err);
            alert('Error creating user');
        }
    };

    return (
        <div className='h-screen w-screen bg-dark-bg justify-center items-center'>
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