import { useState } from 'react'
import useAuth from '../hooks/useAuth';
import Logo from '../assets/images/recruitease_logo.svg'
import { MdEmail } from "react-icons/md";



const ForgotPasswordForm = () => {

    const { resetPassword, loading, error } = useAuth()
    const [email, setEmail] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        setSuccessMessage('');

        try {
            const redirectTo = `${window.location.origin}/auth/reset-password`;
            const { error } = await resetPassword(email, redirectTo);

            if (error) {
                console.error(error.message);
                return;
            }

            setSuccessMessage("Check your email for the reset link.");
        } catch (err) {
            console.error("Unexpected error:", err.message);
        }

    };



    return (
        <>
            <div className=" flex items-center justify-center bg-white px-8 py-12 -mt-20">
                <div className="w-full max-w-md">


                    <img
                        className="h-20 w-auto object-contain -ml-4 mt-8 mb-2"
                        src={Logo}
                        alt="RecruitEase"
                    />

                    <h2 className="text-4xl font-bold text-gray-800 mb-2">
                        Forgot your password?
                    </h2>
                    <p className="text-gray-500">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>


                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5">

                        <div>
                            {/* Error */}
                            <div className="min-h-5 mt-3 mb-3 ">
                                {error && (
                                    <p className="text-red-500 text-sm">{error}</p>
                                )}
                            </div>

                            {/* Email input or success message */}
                            {successMessage ? (
                                <div className="w-full px-4 py-3 border border-green-300 rounded-xl bg-green-50 text-green-700 text-sm text-center">
                                    
                                    <p className="font-semibold text-md mt-2">Password reset link has been sent</p>
                                    <p className='mb-2'>Please check your email.</p>
                                </div>
                            ) : (
                                <>
                                    <label className="block mt-2 text-sm font-medium text-gray-600 mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        className="w-full px-4 py-3 border rounded-xl focus:outline-none "
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />


                                    {/* Button */}
                                    <button
                                        type="submit"
                                        disabled={loading || !!successMessage}
                                        className="w-full bg-[#0F6E56] mt-4 text-white py-3 rounded-xl hover:shadow-md font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-default"
                                    >
                                        {loading ? 'Sending link...' : 'Send reset link'}
                                    </button>
                                </>
                            )}
                        </div>

                        <div className='mt-4 text-center'>
                            <span className='text-sm text-gray-800'>
                                Remember your password?
                            </span>
                            <a
                                href='/auth/login'
                                className='text-sm ml-1 text-[#378ADD] hover:underline cursor-pointer '>
                                Sign In
                            </a>
                        </div>



                    </form>

                </div>
            </div>

        </>
    );
}

export default ForgotPasswordForm