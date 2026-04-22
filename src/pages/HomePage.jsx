import Hero from '../components/Hero'
import JobCategories from '../components/JobCategories'
import JobListings from '../components/JobListings'
import MentorListings from '@/components/MentorListings'
import ViewAllJobsButton from '../components/ViewAllJobsButton'
import ViewAllMentorsButton from '@/components/ViewAllMentorsButton'


const HomePage = () => {

    return (
        <>
            <Hero />

            <div className='max-w-7xl mx-auto'>
                <JobCategories />
                <JobListings isHome={true} />
                <ViewAllJobsButton />
                <MentorListings isHome={true} />
                <ViewAllMentorsButton />
            </div>
        </>
    )
}

export default HomePage