import Hero from '../components/Hero'
import JobCategories from '../components/JobCategories'
import JobListings from '../components/JobListings'
import ViewAllJobsButton from '../components/ViewAllJobsButton'


const HomePage = () => {

    return (
        <>
        
            <Hero />

            <div className='max-w-7xl mx-auto'>
                <JobCategories />
                <JobListings isHome={true} />
                <ViewAllJobsButton />
            </div>
        </>
    )
}

export default HomePage