import { Link } from 'react-router-dom'
import { FaTriangleExclamation, FaChevronLeft } from 'react-icons/fa6'

const NotFoundPage = () => {
    return (
        <>
            <section class="text-center flex flex-col justify-center items-center h-135">
                <FaTriangleExclamation className='text-[#378ADD] text-6xl mb-4' />
                <h1 class="text-5xl font-bold mb-4">404 Not Found</h1>
                <p class="text-xl mb-5">This page does not exist</p>
                <div className='flex'>

                    <Link
                        to='/'
                        className='text-[#378ADD]  flex items-center'
                    >
                        <FaChevronLeft className='mr-2'/> Back to Home
                    </Link>
                </div>
            </section>
        </>
    )
}

export default NotFoundPage