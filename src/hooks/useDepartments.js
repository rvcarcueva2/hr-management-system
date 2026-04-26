// useDepartments.js
import { useState, useEffect } from "react";
import supabase from "../utils/supabaseClient";

const useDepartments = () => {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDepartments = async () => {
            setLoading(true);
            setError(null);

            const { data, error } = await supabase
                .from("departments")
                .select("id, name")
                .order("name");

            if (error) {
                setError(error.message);
            } else {
                setDepartments(data);
            }

            setLoading(false);
        };

        fetchDepartments();
    }, []);

    return { departments, loading, error };
};

export default useDepartments;