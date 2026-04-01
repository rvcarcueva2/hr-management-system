import { Link } from 'react-router-dom'
import { FaChevronRight } from 'react-icons/fa'
import Logo from '../assets/images/recruitease_logo.svg'

const Footer = () => {
    return (
        <>
            <footer className="font-geist border-t bg-[white] mt-6 md:mt-8 lg:mt-12 xl:mt-16">
                <div className="text-black max-w-7xl mx-auto px-4 grid gap-6 md:grid-cols-2 lg:grid-cols-5 text-sm py-6 md:py-8 lg:py-10">

                    {/* Logo */}
                    <div className=" flex justify-center lg:justify-start">
                        <img
                            src={Logo}
                            alt="RecruitEase"
                            width={136}
                            height={136}
                            className="rounded-full w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28"
                        />
                    </div>

                    {/* Newsletter */}
                    <div className=" lg:col-span-2 text-center md:text-left">
                        <p className="mb-3 text-gray-800 text-md">
                            Get in touch with me and stay updated.
                        </p>

                        <form className="flex items-center border border-gray-300  rounded-lg w-96 max-w-md mx-auto md:mx-0">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                required
                                className="flex-1 px-3 py-2 text-sm text-gray-800 bg-transparent "
                            />
                            <button
                                type="submit"
                                className="px-3 text-gray-400 hover:text-gray-600 cursor-pointer"
                            >
                                <FaChevronRight className="w-4 h-4" />
                            </button>
                        </form>
                    </div>

                    {/* Links */}
                    <div className=" flex flex-col items-center lg:items-start">
                        <ul className="text-base font space-y-2 text-center lg:text-left">
                            {["Home", "Jobs", "About", "News"].map((item) => (
                                <li key={item}>
                                    <Link href={`/${item.toLowerCase()}`} className="relative group">
                                        <span className="relative">
                                            {item}
                                            <span className="absolute left-1/2 -bottom-1 w-0 h-[2px] bg-[#378ADD] transition-all duration-300 group-hover:w-full group-hover:-translate-x-1/2"></span>
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Social */}
                    <div className=" flex flex-col items-center lg:items-start">
                        <h4 className=" mb-2">Follow Me</h4>
                        <div className="flex items-center gap-2">

                        </div>
                    </div>


                </div>

                {/* Bottom bar */}
                <div className="  text-left text-xs md:text-sm py-2 md:py-4 ">
                    <p className="px-64 text-gray-500">
                        © 2026 / Reycel John Emmanuel Carcueva / RecruitEase
                    </p>
                </div>
            </footer>
        </>
    )
}

export default Footer