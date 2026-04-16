import { useState, useMemo } from 'react'
import useJobs from "../hooks/useJobs"
import JobListing from "./JobListing"
import Spinner from "./Spinner"
import Search from './Search'
import CategoryDropdown from './CategoryDropdown'
import Pagination from './Pagination'
import JobType from './JobType'



const JobListings = ({ isHome = false }) => {
    const { jobs, loading } = useJobs(); // Hook loader

    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedType, setSelectedType] = useState('')
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1); // Default 1 page
    const [postsPerPage] = useState(6); // 6 posts per page


    // Filter
    const filteredJobs = useMemo(() => {
        let processed = jobs;

        //filter() is an array method used to create a new array containing only the elements that pass a condition.
        if (selectedCategory && selectedCategory !== 'All Categories') {
            processed = processed.filter(job => job.category === selectedCategory); // Each parameter (job) from job.category match the selectedCategory (in CategoryDropdown line 72);
        }

        if (selectedCategory === 'All Categories') {
            job => job.category
        }

        if (selectedType && selectedType !== 'All Types') {
            processed = processed.filter(
                job => job.type === selectedType);
        }
        if (selectedType == 'All Types') {
            processed = processed.filter(job => job.type);
        }

        if (search.trim() !== '') {
            processed = processed.filter(job =>
                job.title.toLowerCase().includes(search.toLowerCase()) ||
                job.description.toLowerCase().includes(search.toLowerCase()) ||
                job.companies?.name.toLowerCase().includes(search.toLowerCase())
            );
        }

        return processed;

    }, [jobs, selectedCategory, selectedType, search]);


    // Pagination
    const lastPostIndex = currentPage * postsPerPage // 1 * 6 lastPostIndex = 6 
    const firstPostIndex = lastPostIndex - postsPerPage // 6-6 firstPostIndex = 0


    // Default display of jobs
    const displayJobs = isHome
        ? filteredJobs.slice(0, 3)
        : filteredJobs.slice(firstPostIndex, lastPostIndex);// jobs.slice(0, 6)


    return (
        <>
            <section className=" mt-4 px-4 py-10">
                <div className="container lg:container m-auto p-4">

                    {/* Title */}
                    <h2 className={`${isHome ? 'text-3xl' : 'text-5xl'} font-bold text-black mb-6 ${isHome ? 'text-center' : 'text-left'}`}>
                        {isHome ? 'New Jobs' : 'Browse Jobs'}
                    </h2>
                    <p className="mb-4">{isHome ? '' : 'Browse opportunities that awaits you'}</p>


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
                            {displayJobs.map((job) => (
                                <JobListing key={job.id} job={job} />
                            ))}
                        </div>
                    )}


                    {!isHome && (
                        <Pagination totalPosts={filteredJobs.length} postsPerPage={postsPerPage} setCurrentPage={setCurrentPage} currentPage={currentPage} /> // setStateVariable defined on top name can also be passed as a props
                    )}

                </div>
            </section>
        </>
    )
}

export default JobListings