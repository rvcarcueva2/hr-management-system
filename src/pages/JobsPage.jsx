import { useEffect } from "react";
import JobListings from "../components/JobListings"

const JobsPage = () => {

    useEffect(() => {
        document.title = "Jobs | RecruitEase";
    }, []);

    return (
        <>
            <div className="max-w-6xl mx-auto">
                <JobListings />
            </div>

        </>
    )
}

export default JobsPage