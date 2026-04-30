import { useState } from 'react'
import useAuth from '../hooks/useAuth';
import Logo from '../assets/images/recruitease_logo.svg'
import { Link, useNavigate } from 'react-router-dom';
import { FaChevronLeft } from 'react-icons/fa';


const LoginForm = () => {

    const { login, loading, error } = useAuth()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const { error } = await login(email, password);
            if (error) {
                console.error(error.message);
                return;
            }
        } catch (err) {
            console.error("Unexpected error:", err.message);
        }

        return navigate('/');

    };



    return (
        <>
            <div className=" flex items-center justify-center bg-white px-8 py-12 -mt-20">
                <div className="w-full max-w-md">

                    <div className='container mb-2 '>
                        <Link
                            to='/'
                            className='text-gray-500 text-sm hover:text-gray-600 flex items-center group'
                        >
                            <FaChevronLeft className='mr-2 transition-transform duration-300 group-hover:-translate-x-1' />
                            Back to Home Page
                        </Link>
                    </div>


                    <img
                        className="h-20 w-auto object-contain -ml-4 mt-8 mb-2"
                        src={Logo}
                        alt="RecruitEase"
                    />

                    <h2 className="text-4xl font-bold text-gray-800 mb-2">
                        Welcome Back
                    </h2>
                    <p className="text-gray-500">
                        Sign in to your account
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

                            {/* Email */}
                            <label className="block mt-2 text-sm font-medium  text-gray-600 mb-1">
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
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                className="w-full px-4 py-3 border rounded-xl focus:outline-none "
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className='-mt-2 text-end'>
                            <a 
                            href='/auth/forgot-password'
                            className='text-sm text-gray-500 hover:underline cursor-pointer'>
                                Forgot Password?
                            </a>
                        </div>


                        {/* Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#0F6E56] text-white py-3 rounded-xl hover:shadow-md font-semibold cursor-pointer "
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>


                    </form>

                </div>
            </div>

        </>
    );
}

export default LoginForm