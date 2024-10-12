import { useState, useEffect } from 'react';

const UserForm = ({ user, isEditMode, onSave, onClose }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        username: user?.username || '',
        address: {
            street: user?.address?.street || '',
            city: user?.address?.city || '',
        },
        company:{
            name: user?.company?.name || '',
        },
        website: user?.website || '',
    });

    const [validationErrors, setValidationErrors] = useState({});
    const [globalError, setGlobalError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('address')) {
            const field = name.split('.')[1];
            setFormData({
                ...formData,
                address: { ...formData.address, [field]: value },
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
        setValidationErrors({ ...validationErrors, [name]: '' });
    };

    const nextStep = () => {
        if (validateStep(step)) {
            setStep(step + 1);
        }
    };
    const prevStep = () => setStep(step - 1);

    const validateStep = (step) => {
        let errors = {};

        if (step === 1) {
            if (!formData.name || formData.name.length < 3)
                errors.name = 'Name is required and must be at least 3 characters long.';
            if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email))
                errors.email = 'Valid email is required.';
            if (!formData.phone || !/^\d{10,15}$/.test(formData.phone))
                errors.phone = 'Phone number must be between 10-15 digits.';
        }

        if (step === 2) {
            if (!formData.address.street) errors['address.street'] = 'Street address is required.';
            if (!formData.address.city) errors['address.city'] = 'City is required.';
        }

        if (step === 3 && formData.company) {
            if (formData.company.length < 3)
                errors.company = 'Company name must be at least 3 characters long.';
            if (formData.website && !/^https?:\/\/[^\s$.?#].[^\s]*$/.test(formData.website))
                errors.website = 'Website must be a valid URL.';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
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
                    name: formData.company || '',
                },
            };
            await onSave(finalData);
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
                                className={`w-full p-2 border ${validationErrors.name ? 'border-red-500' : 'border-light-blue'} rounded-lg`}
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
                                className={`w-full p-2 border ${validationErrors.email ? 'border-red-500' : 'border-light-blue'} rounded-lg`}
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
                                className={`w-full p-2 border ${validationErrors.phone ? 'border-red-500' : 'border-light-blue'} rounded-lg`}
                            />
                            {validationErrors.phone && <p className="text-red-500 text-sm mt-1">{validationErrors.phone}</p>}
                        </div>

                        <div>
                            <label className="block font-medium mb-2">Username:</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border border-light-blue rounded-lg bg-gray-100 cursor-not-allowed"
                            />
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
                                className={`w-full p-2 border ${validationErrors['address.street'] ? 'border-red-500' : 'border-light-blue'} rounded-lg`}
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
                                className={`w-full p-2 border ${validationErrors['address.city'] ? 'border-red-500' : 'border-light-blue'} rounded-lg`}
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
                                name="company"
                                value={formData.company.name}
                                onChange={handleChange}
                                className={`w-full p-2 border ${validationErrors.company ? 'border-red-500' : 'border-light-blue'} rounded-lg`}
                            />
                            {validationErrors.company && <p className="text-red-500 text-sm mt-1">{validationErrors.company}</p>}
                        </div>

                        <div>
                            <label className="block font-medium mb-2">Website:</label>
                            <input
                                type="text"
                                name="website"
                                value={formData.website}
                                onChange={handleChange}
                                className={`w-full p-2 border ${validationErrors.website ? 'border-red-500' : 'border-light-blue'} rounded-lg`}
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