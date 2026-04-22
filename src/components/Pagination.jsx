

const Pagination = ({ totalPosts, postsPerPage, setCurrentPage, currentPage }) => {

    let pages = [];

    for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) { // 13 / 6 = 2.16 with Math.ceil() it will round the number to 2
        pages.push(i); // Push index to pages array
    }

    return (
        <div className='flex items-center justify-start gap-2 mt-8'>
            {pages.map((page, index) => (
                <button
                    key={index}
                    onClick={() => {
                        setCurrentPage(page) // Sets the current page to parameter(page:number)
                        window.scrollTo({ top: 0, behavior: 'smooth' }) // parent container needs to have h-screen to work
                    }}
                    className={`w-9 h-9  border border-[#0d624d]/70 rounded-xl text-sm font-semibold  transition-colors duration-200 focus:outline-none cursor-pointer
                        ${currentPage === page
                            ? 'bg-[#0d624d] text-white'
                            : 'text-[#0d624d] hover:bg-[#0d624d] hover:text-white'
                        }`
                    }
                >
                    {page}
                </button>
            ))}
        </div>
    )
}

export default Pagination