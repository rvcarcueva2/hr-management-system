import Hero from '../components/Hero'
import JobCategories from '../components/JobCategories'
import JobListings from '../components/JobListings'
import MentorListings from '@/components/MentorListings'
import ViewAllJobsButton from '../components/ViewAllJobsButton'
import ViewAllMentorsButton from '@/components/ViewAllMentorsButton'
import ApplyMentor from '@/components/ApplyMentor'
import BotpressChat from '@/components/BotpressChat'


const HomePage = () => {

    return (
        <>
            <Hero />

            <div className='max-w-7xl mx-auto'>
                <BotpressChat />
                <JobCategories />
                <JobListings isHome={true} />
                <ViewAllJobsButton />
                <MentorListings isHome={true} />
                <ViewAllMentorsButton />
                <ApplyMentor />
            </div>
        </>
    )
}

export default HomePage