import useJobs from "../hooks/useJobs"
import { FaCode, FaUsers, FaPlay, FaChartLine, FaChartPie, FaBook, FaHandshake, FaHeadset } from 'react-icons/fa'
import JobCategoryCard from './JobCategoryCard'
import useUsers from '@/hooks/useUsers'

const JobCategories = () => {
    const { jobs } = useJobs() // Hook loader
    const { user } = useUsers();
    const visibleJobs = jobs.filter((job) => {
        if (!job.is_visible) return false;
        // Only apply salary filter if user data is available
        if (user?.job?.salary != null) {
            return job.salary > user.job.salary;
        }
        return true; // show all visible jobs while user is loading
    });
    const countOpenings = (target) => {
        return visibleJobs.filter(job => job.category === target).length; // count from filtered list
    }

    return (
        <>
            <section className="container lg:container m-auto">
                <div className="flex flex-wrap gap-4 p-4 rounded-lg">
                    <JobCategoryCard
                        icon={FaCode}
                        label="Technology"
                        openings={countOpenings('Technology')}
                    />
                    <JobCategoryCard
                        icon={FaPlay}
                        label="Marketing"
                        openings={countOpenings('Marketing')}
                    />
                    <JobCategoryCard
                        icon={FaUsers}
                        label="Human Resources"
                        openings={countOpenings('Human Resources')}
                    />
                    <JobCategoryCard
                        icon={FaChartLine}
                        label="Bussiness Management"
                        openings={countOpenings('Business Management')}
                    />
                    <JobCategoryCard
                        icon={FaHeadset}
                        label="Technical Support"
                        openings={countOpenings('Technical Support')}
                    />
                    <JobCategoryCard
                        icon={FaHandshake}
                        label="Leadership"
                        openings={countOpenings('Leadership')}
                    />
                    <JobCategoryCard
                        icon={FaChartPie}
                        label="Data & Analytics"
                        openings={countOpenings('Data & Analytics')}
                    />
                    <JobCategoryCard
                        icon={FaBook}
                        label="Knowledge & Developement"
                        openings={countOpenings('Knowledge & Developement')}
                    />

                </div>
            </section>
        </>
    )
}

export default JobCategories