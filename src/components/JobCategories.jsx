import useJobs from "../hooks/useJobs"
import { FaCode, FaUsers, FaPlay, FaChartLine, FaChartPie, FaBook , FaHandshake, FaHeadset } from 'react-icons/fa'
import JobCategoryCard from './JobCategoryCard'

const JobCategories = () => {
    const { jobs } = useJobs() // Hook loader

    const countOpenings = (target) => {
       
        return jobs.filter(job => job.category === target).length;
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
                        icon={FaBook }
                        label="Knowledge & Developement"
                        openings={countOpenings('Knowledge & Developement')}
                    />

                </div>
            </section>
        </>
    )
}

export default JobCategories