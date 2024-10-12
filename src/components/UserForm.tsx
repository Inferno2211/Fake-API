import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { User } from '../types/User'; // Adjust the import path as necessary

interface UserFormProps {
    user: User | null;
    isEditMode: boolean;
    onSave: (userData: User | any) => Promise<void>;
    onClose: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, isEditMode, onSave, onClose }) => {
    const [step, setStep] = useState<number>(1);
    const [formData, setFormData] = useState<{
        name: string;
        email: string;
        phone: string;
        username: string;
        address: {
            street: string;
            city: string;
        };
        company: {
            name: string;
        };
        website: string;
    }>({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        username: isEditMode ? user?.username : '',
        address: {
            street: user?.address.street || '',
            city: user?.address.city || '',
        },
        company: {
            name: user?.company.name || '',
        },
        website: user?.website || '',
    });

    const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
    const [globalError, setGlobalError] = useState<string>('');

    useEffect(() => {
        if (!isEditMode) {
            setFormData((prev) => ({
                ...prev,
                username: formData.name ? `USER-${formData.name}` : '',
            }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData.name, isEditMode]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name.startsWith('address.')) {
            const field = name.split('.')[1];
            setFormData({
                ...formData,
                address: { ...formData.address, [field]: value },
            });
            setValidationErrors({ ...validationErrors, [name]: '' });
        } else if (name.startsWith('company.')) {
            const field = name.split('.')[1];
            setFormData({
                ...formData,
                company: { ...formData.company, [field]: value },
            });
            setValidationErrors({ ...validationErrors, [name]: '' });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
            setValidationErrors({ ...validationErrors, [name]: '' });
        }
    };

    const nextStep = () => {
        if (validateStep(step)) {
            setStep(step + 1);
        }
    };

    const prevStep = () => setStep(step - 1);

    const validateStep = (step: number): boolean => {
        let errors: { [key: string]: string } = {};

        if (step === 1) {
            if (!formData.name || formData.name.length < 3)
                errors.name = 'Name is required and must be at least 3 characters long.';
            if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email))
                errors.email = 'Valid email is required.';
            if (!formData.phone || !/^\d{10,15}$/.test(formData.phone))
                errors.phone = 'Phone number must be between 10-15 digits.';
            if (!isEditMode && (!formData.username || formData.username.length < 3))
                errors.username = 'Username is required and must be at least 3 characters long.';
        }

        if (step === 2) {
            if (!formData.address.street) errors['address.street'] = 'Street address is required.';
            if (!formData.address.city) errors['address.city'] = 'City is required.';
        }

        if (step === 3) {
            if (formData.company.name && formData.company.name.length < 3)
                errors['company.name'] = 'Company name must be at least 3 characters long.';
            if (formData.website && !/^https?:\/\/[^\s$.?#].[^\s]*$/.test(formData.website))
                errors.website = 'Website must be a valid URL.';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validateStep(3)) return;

        try {
            const finalData = {
                ...formData,
                address: {
                    street: formData.address.street,
                    city: formData.address.city,
                },
                company: {
                    name: formData.company.name || '',
                },
            };
            await onSave(isEditMode ? { ...user!, ...finalData } : finalData);
            onClose();
        } catch (error) {
            setGlobalError('There was an issue saving the user. Please try again.');
        }
    };

    return (
        <div className="modal py-16">
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-8 shadow-lg bg-dark-blue rounded-lg space-y-6 text-soft-white">
                <h2 className="text-2xl font-semibold mb-4">{isEditMode ? 'Update User' : 'Create User'}</h2>

                {/* Step 1: Basic Information */}
                {step === 1 && (
                    <div>
                        <div>
                            <label className="block font-medium mb-2">Name:</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className={`w-full p-2 border ${validationErrors.name ? 'border-red-500' : 'border-light-blue'} bg-gray-600 rounded-lg`}
                            />
                            {validationErrors.name && <p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>}
                        </div>

                        <div>
                            <label className="block font-medium mb-2">Email:</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className={`w-full p-2 border ${validationErrors.email ? 'border-red-500' : 'border-light-blue'} bg-gray-600 rounded-lg`}
                            />
                            {validationErrors.email && <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>}
                        </div>

                        <div>
                            <label className="block font-medium mb-2">Phone:</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                className={`w-full p-2 border ${validationErrors.phone ? 'border-red-500' : 'border-light-blue'} bg-gray-600 rounded-lg`}
                            />
                            {validationErrors.phone && <p className="text-red-500 text-sm mt-1">{validationErrors.phone}</p>}
                        </div>

                        <div>
                            <label className="block font-medium mb-2">Username:</label>
                            <input
                                type="text"
                                name="username"
                                value={isEditMode ? formData.username : `USER-${formData.name}`}
                                readOnly={isEditMode}
                                onChange={handleChange}
                                required
                                className={`w-full font-black p-2 border ${validationErrors.username ? 'border-red-500' : 'border-light-blue'} rounded-lg bg-gray-600 cursor-${isEditMode ? 'not-allowed' : 'default'}`}
                            />
                            {!isEditMode && <p className="text-sm text-gray-400">Auto-generated as USER-&lt;name&gt;</p>}
                            {validationErrors.username && <p className="text-red-500 text-sm mt-1">{validationErrors.username}</p>}
                        </div>

                        <button
                            type="button"
                            onClick={nextStep}
                            className="w-full bg-light-blue text-dark-blue py-2 rounded-lg mt-4"
                        >
                            Next: Address Info
                        </button>
                    </div>
                )}

                {/* Step 2: Address Information */}
                {step === 2 && (
                    <div>
                        <div>
                            <label className="block font-medium mb-2">Street:</label>
                            <input
                                type="text"
                                name="address.street"
                                value={formData.address.street}
                                onChange={handleChange}
                                required
                                className={`w-full p-2 border ${validationErrors['address.street'] ? 'border-red-500' : 'border-light-blue'} bg-gray-600 rounded-lg`}
                            />
                            {validationErrors['address.street'] && <p className="text-red-500 text-sm mt-1">{validationErrors['address.street']}</p>}
                        </div>

                        <div>
                            <label className="block font-medium mb-2">City:</label>
                            <input
                                type="text"
                                name="address.city"
                                value={formData.address.city}
                                onChange={handleChange}
                                required
                                className={`w-full p-2 border ${validationErrors['address.city'] ? 'border-red-500' : 'border-light-blue'} bg-gray-600 rounded-lg`}
                            />
                            {validationErrors['address.city'] && <p className="text-red-500 text-sm mt-1">{validationErrors['address.city']}</p>}
                        </div>

                        <div className="flex justify-between gap-4 mt-4">
                            <button
                                type="button"
                                onClick={prevStep}
                                className="w-1/2 bg-gray-600 text-white py-2 rounded-lg"
                            >
                                Previous
                            </button>
                            <button
                                type="button"
                                onClick={nextStep}
                                className="w-1/2 bg-light-blue text-dark-blue py-2 rounded-lg"
                            >
                                Next: Company Info
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Company Information */}
                {step === 3 && (
                    <div>
                        <div>
                            <label className="block font-medium mb-2">Company:</label>
                            <input
                                type="text"
                                name="company.name"
                                value={formData.company.name}
                                onChange={handleChange}
                                className={`w-full p-2 border ${validationErrors['company.name'] ? 'border-red-500' : 'border-light-blue'} bg-gray-600 rounded-lg`}
                            />
                            {validationErrors['company.name'] && <p className="text-red-500 text-sm mt-1">{validationErrors['company.name']}</p>}
                        </div>

                        <div>
                            <label className="block font-medium mb-2">Website:</label>
                            <input
                                type="text"
                                name="website"
                                value={formData.website}
                                onChange={handleChange}
                                className={`w-full p-2 border ${validationErrors.website ? 'border-red-500' : 'border-light-blue'} bg-gray-600 rounded-lg`}
                            />
                            {validationErrors.website && <p className="text-red-500 text-sm mt-1">{validationErrors.website}</p>}
                        </div>

                        <div className="flex justify-between gap-4 mt-4">
                            <button
                                type="button"
                                onClick={prevStep}
                                className="w-1/2 bg-gray-600 text-white py-2 rounded-lg"
                            >
                                Previous
                            </button>
                            <button
                                type="submit"
                                className="w-1/2 bg-light-blue text-dark-blue py-2 rounded-lg"
                            >
                                {isEditMode ? 'Update User' : 'Create User'}
                            </button>
                        </div>

                        {globalError && <p className="text-red-500 text-sm mt-4">{globalError}</p>}
                    </div>
                )}
            </form>
        </div>
    );
};

export default UserForm;