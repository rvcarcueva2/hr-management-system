import { Link } from "react-router-dom"

const ViewAllJobsButton = () => {
    return (
        <>
            <section className=" m-auto max-w-lg my-10 px-6">
                <Link
                    to="/jobs"
                    className="block bg-[#0d624d] text-white text-center py-4 px-6 rounded-xl hover:shadow-md transition-shadow"
                >View All Jobs</Link>
            </section>
        </>
    )
}

export default ViewAllJobsButton