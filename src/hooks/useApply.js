import { useState } from "react";
import supabase from '../utils/supabaseClient';

const useApply = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Submitting an application
    const submitApplication = async (userId, jobId, resumeFile, coverLetterFile) => {
        setLoading(true);
        setError(null);
        try {
            // Upload resume
            const resumePath = `resumes/${userId}/${resumeFile.name}`
            const { error: resumeError } = await supabase.storage
                .from("applications")
                .upload(resumePath, resumeFile);

            if (resumeError) throw resumeError;

            // Upload cover letter
            let coverLetterPath = null
            if (coverLetterFile) {
                coverLetterPath = `cover-letters/${userId}/${coverLetterFile.name}`
                const { error: coverLetterError } = await supabase.storage
                    .from("applications")
                    .upload(coverLetterPath, coverLetterFile);

                if (coverLetterError) throw coverLetterError;
            }

            // Insert application record
            const { error: insertError } = await supabase
                .from("applications")
                .insert({
                    user_id: userId,
                    job_id: jobId,
                    resume_url: resumePath,
                    cover_letter_url: coverLetterPath,
                });

            if (insertError) throw insertError;

            return true;


        } catch (err) {
            console.error("Full error:", err);
            setError(err.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { submitApplication, loading, error };
};

export default useApply;