import { useState } from 'react';
import Logo from '../assets/images/recruitease_logo.svg'
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from "react-icons/fc";
import useAuth from '../hooks/useAuth';


const SignUpForm = () => {

    const { signUp, loading, error } = useAuth()
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (confirmPassword !== password) {
            alert('Password not match')
            return
        }

        const normalizeName = (name) =>
            name.trim().replace(/\s+/g, ' ');

        const cleanFirstName = normalizeName(firstName);
        const cleanLastName = normalizeName(lastName);

        try {
            const { error } = await signUp(email, password, cleanFirstName, cleanLastName);

            if (error) {
                return;
            }

            navigate("/");

        } catch (err) {
            console.error("Unexpected error:", err.message);
        }

    }

    return (
        <>
            <div className="h-full  px-8 py-12 flex justify-center scroll-smooth">
                <div className="w-full max-w-md -mt-10 ">

                    <img
                        className="h-20 w-auto object-contain -ml-4 mb-2"
                        src={Logo}
                        alt="RecruitEase"
                    />

                    <h2 className="text-4xl font-bold text-gray-800 mb-2">
                        Sign Up
                    </h2>
                    <p className="text-gray-500 ">
                        Create your account
                    </p>


                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5">


                        <div>
                            {error && (
                                <p className="text-red-500 text-sm">{error}</p>
                            )}
                        </div>


                        <div className='flex gap-2'>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    name="first_name"
                                    className="w-full px-4 py-3 border rounded-xl focus:outline-none transition"
                                    placeholder="Enter your first name"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    name="last_name"
                                    className="w-full px-4 py-3 border rounded-xl focus:outline-none transition"
                                    placeholder="Enter your last name"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                className="w-full px-4 py-3 border rounded-xl focus:outline-none transition"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                className="w-full px-4 py-3 border rounded-xl focus:outline-none transition"
                                placeholder="Create a password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>


                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                className="w-full px-4 py-3 border rounded-xl focus:outline-none transition"
                                placeholder="Confirm your password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>


                        {/* Submit */}
                        <button
                            type="submit"
                            //disabled={loading}
                            className="w-full bg-[#0F6E56] text-white py-3 rounded-xl hover:shadow-md font-semibold "
                        >
                            {loading ? 'Signing Up...' : 'Sign Up'}
                        </button>

                        {/* Divider */}
                        <div className="flex items-center gap-3 my-4">
                            <div className="flex-1 h-px bg-gray-200"></div>
                            <span className="text-gray-400 text-sm">or</span>
                            <div className="flex-1 h-px bg-gray-200"></div>
                        </div>

                        {/* Google */}
                        <button
                            type="button"
                            className="w-full flex items-center justify-center border py-3 rounded-xl hover:bg-gray-50 transition "
                        >
                            Continue with Google <FcGoogle className='mx-3 -mt-1.5 text-2xl' />
                        </button>

                        {/* Footer */}
                        <p className="text-sm text-gray-500 text-center mt-4">
                            Already have an account?{' '}
                            <Link to={'/auth/login'} className="text-[#378ADD] font-medium cursor-pointer">
                                Login
                            </Link>
                        </p>

                    </form>

                </div>
            </div>
        </>
    )
}

export default SignUpForm