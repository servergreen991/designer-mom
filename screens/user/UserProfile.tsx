
import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { User } from '../../types';

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};

const UserProfile: React.FC = () => {
    const { currentUser, updateUser } = useAppContext();
    const [formData, setFormData] = useState({
        name: currentUser?.name || '',
        mobile: currentUser?.mobile || '',
        password: '',
        avatar: currentUser?.avatar || '',
    });
    const [success, setSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const base64 = await fileToBase64(e.target.files[0]);
            setFormData({ ...formData, avatar: base64 });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (currentUser) {
            const updatedUser: User = {
                ...currentUser,
                name: formData.name,
                mobile: formData.mobile,
                avatar: formData.avatar,
                password: formData.password ? formData.password : currentUser.password,
            };
            updateUser(updatedUser);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        }
    };

    const isProfileIncomplete = !currentUser?.name || !currentUser?.mobile;

    return (
        <div className="p-6 bg-secondary min-h-full">
            <h2 className="text-3xl font-serif text-accent mb-6">My Profile</h2>

            {isProfileIncomplete && (
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6" role="alert">
                    <p className="font-bold">Profile Incomplete</p>
                    <p>Please provide your name and mobile number to help us serve you better.</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
                <div className="flex flex-col items-center mb-6">
                    <img src={formData.avatar || 'https://i.pravatar.cc/150'} alt="Avatar" className="w-24 h-24 rounded-full object-cover border-4 border-primary shadow-lg mb-2" />
                    <input type="file" id="avatar" onChange={handleFileChange} className="hidden" />
                    <label htmlFor="avatar" className="text-sm text-accent cursor-pointer hover:underline">Change Photo</label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-text-light">Full Name</label>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md" />
                    </div>
                    <div>
                        <label htmlFor="mobile" className="block text-sm font-medium text-text-light">Mobile Number</label>
                        <input type="tel" id="mobile" name="mobile" value={formData.mobile} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md" />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-text-light">Email Address</label>
                        <input type="email" id="email" value={currentUser?.email || ''} disabled className="mt-1 w-full p-2 border rounded-md bg-gray-100 cursor-not-allowed" />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-text-light">New Password</label>
                        <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} placeholder="Leave blank to keep current" className="mt-1 w-full p-2 border rounded-md" />
                    </div>
                </div>

                <div className="flex justify-end items-center">
                    {success && <p className="text-green-600 mr-4">Profile updated successfully!</p>}
                    <button type="submit" className="bg-accent text-white font-bold py-2 px-8 rounded-lg hover:bg-opacity-90 transition-colors">
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UserProfile;
