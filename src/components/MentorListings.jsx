import { useState, useMemo } from 'react'
import usePrograms from "../hooks/usePrograms"
import useUsers from "../hooks/useUsers"
import MentorListing from './MentorListing'
import Spinner from "./Spinner"
import Search from './Search'
import CategoryDropdown from './CategoryDropdown'
import Pagination from './Pagination'
import JobType from './JobType'


const MentorListings = ({ isHome = false }) => {
    const { programs, loading } = usePrograms(); // Hook loader
    const { users } = useUsers();

    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedType, setSelectedType] = useState('')
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1); // Default 1 page
    const [postsPerPage] = useState(6); // 6 posts per page


    // Filter
    const filteredPrograms = useMemo(() => {
        const visiblePrograms = programs.filter((program) => program.is_visible === true);
        let processed = visiblePrograms;

        //filter() is an array method used to create a new array containing only the elements that pass a condition.
        if (selectedCategory && selectedCategory !== 'All Categories') {
            processed = processed.filter(program => program.topic === selectedCategory);
        }

        if (selectedCategory === 'All Categories') {
            program => program.topic
        }

        if (selectedType && selectedType !== 'All Types') {
            processed = processed.filter(
                program => program.type === selectedType);
        }
        if (selectedType == 'All Types') {
            processed = processed.filter(program => program.type);
        }

        if (search.trim() !== '') {
            processed = processed.filter(program =>
                program.title.toLowerCase().includes(search.toLowerCase()) ||
                program.description?.toLowerCase().includes(search.toLowerCase()) ||
                program.mentor?.display_name?.toLowerCase().includes(search.toLowerCase())
            );
        }

        return processed;

    }, [programs, selectedCategory, selectedType, search]);


    // Pagination
    const lastPostIndex = currentPage * postsPerPage // 1 * 6 lastPostIndex = 6 
    const firstPostIndex = lastPostIndex - postsPerPage // 6-6 firstPostIndex = 0


    // Default display of jobs
    const displayPrograms = isHome
        ? filteredPrograms.slice(0, 3)
        : filteredPrograms.slice(firstPostIndex, lastPostIndex);


    return (
        <>
            <section className=" mt-4 px-4 py-10 ">
                <div className="container lg:container m-auto p-4">

                    {/* Title */}
                    <h2 className={`${isHome ? 'text-3xl' : 'text-5xl'} font-bold text-black mb-6 ${isHome ? 'text-center' : 'text-left'}`}>
                        {isHome ? 'Mentorships' : 'Mentorship Programs'}
                    </h2>
                    {/* Description */}
                    <p className="mb-4">{isHome ? '' : 'Browse mentors that will guide you through out your journey'}</p>


                    {!isHome && (
                        <div className="flex flex-wrap gap-2 mb-6 items-center">
                            <JobType selectedType={selectedType} setSelectedType={setSelectedType} />
                            <Search search={search} setSearch={setSearch} />
                            <CategoryDropdown selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />


                        </div>
                    )}

                    {/* Jobs */}
                    {loading ? (
                        <Spinner loading={loading} />
                    ) : (
                        <div className={`grid grid-cols-3 md:${isHome ? 'grid-cols-3' : 'grid-cols-2'} gap-6`}>
                            {displayPrograms.map((program) => {
                                const mentorUser = users?.find((user) => user.id === program.mentor?.id);

                                return (
                                    <MentorListing
                                        key={program.id}
                                        program={program}
                                        mentorAvatarUrl={mentorUser?.avatar_url}
                                        isHomePage={true}
                                    />
                                );
                            })}
                        </div>
                    )}


                    {!isHome && (
                        <Pagination totalPosts={filteredPrograms.length} postsPerPage={postsPerPage} setCurrentPage={setCurrentPage} currentPage={currentPage} /> // setStateVariable defined on top name can also be passed as a props
                    )}

                </div>
            </section>
        </>
    )
}

export default MentorListings