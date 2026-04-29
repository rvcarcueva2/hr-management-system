import { FaSearch } from "react-icons/fa"

const MentorSearch = ({ search, setSearch }) => {

    return (
        <>
            <form onSubmit={(e) => e.preventDefault()}
                className="ml-auto flex items-center border border-gray-300 rounded-lg w-80 max-w-md">
                <button
                    type="submit"
                    className="px-3 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                    <FaSearch className="w-4 h-4" />
                </button>
                <input
                    type="text"
                    placeholder="Search mentors..."
                    className="flex-1 px-1 py-2 text-sm text-gray-800 bg-transparent outline-none"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </form>

        </>
    )
}

export default MentorSearch