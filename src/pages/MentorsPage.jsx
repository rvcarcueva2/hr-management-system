import { useEffect } from "react";
import MentorListings from '@/components/MentorListings'

const MentorsPage = () => {
    useEffect(() => {
        document.title = "Mentors | RecruitEase";
    }, []);

    return (
        <div className="max-w-6xl mx-auto">
            <MentorListings />
        </div>
    )
}

export default MentorsPage
