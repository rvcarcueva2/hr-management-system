import { useState } from 'react'
import useAuth from '../hooks/useAuth';
import Logo from '../assets/images/recruitease_logo.svg'
import { Link, useNavigate } from 'react-router-dom';
import { FaChevronLeft } from 'react-icons/fa';

const PasswordResetForm = () => {

    const { updatePassword, loading, error } = useAuth()
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [formError, setFormError] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();

        setFormError('')
        setSuccessMessage('')

        if (password !== confirmPassword) {
            setFormError("Passwords don't match.");
            return;
        }

        try {
            const { error } = await updatePassword(password);
            if (error) {
                console.error(error.message);
                return;
            }

            setSuccessMessage('Password updated. You can sign in now.');
            setTimeout(() => navigate('/auth/login'), 800);
        } catch (err) {
            console.error("Unexpected error:", err.message);
        }

    };



    return (
        <>
            <div className=" flex items-center justify-center bg-white px-8 py-12 -mt-20">
                <div className="w-full max-w-md">

                    <div className='container mb-2 '>
                        <Link
                            to='/auth/login'
                            className='text-gray-500 text-sm hover:text-gray-600 flex items-center group'
                        >
                            <FaChevronLeft className='mr-2 transition-transform duration-300 group-hover:-translate-x-1' />
                            Back to Sign In
                        </Link>
                    </div>
                    <img
                        className="h-20 w-auto object-contain -ml-4 mt-8 mb-2"
                        src={Logo}
                        alt="RecruitEase"
                    />

                    <h2 className="text-4xl font-bold text-gray-800 mb-2">
                        Reset your password
                    </h2>
                    <p className="text-gray-500">
                        Enter your password below.
                    </p>


                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5">

                        <div>
                            {/* Error */}

                            <div className="min-h-5 mt-3 mb-3 ">
                                {formError && (
                                    <p className="text-red-500 text-sm">{formError}</p>
                                )}
                                {error && (
                                    <p className="text-red-500 text-sm">{error}</p>
                                )}
                                {successMessage && (
                                    <p className="text-green-600 text-sm">{successMessage}</p>
                                )}
                            </div>

                            {/* Email */}
                            <label className="block mt-2 text-sm font-medium  text-gray-600 mb-1">
                                New Password
                            </label>
                            <input
                                type="password"
                                className="w-full px-4 py-3 border rounded-xl focus:outline-none "
                                placeholder="Enter your new password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required

                            />
                            <label className="block mt-4 text-sm font-medium  text-gray-600 mb-1">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                className="w-full px-4 py-3 border rounded-xl focus:outline-none "
                                placeholder="Confirm your new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required

                            />
                        </div>



                        {/* Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#0F6E56] mt-2 text-white py-3 rounded-xl hover:shadow-md font-semibold cursor-pointer "
                        >
                            {loading ? 'Updating...' : 'Update password'}
                        </button>


                    </form>

                </div>
            </div>

        </>
    );
}

export default PasswordResetForm