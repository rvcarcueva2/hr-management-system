import { useState, useEffect } from "react";
import supabase from "../utils/supabaseClient";


const useAuth = () => {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get initial session + listen to changes
    useEffect(() => {
        const init = async () => {
            setLoading(true);

            const { data, error } = await supabase.auth.getSession();

            if (error) {
                setError(error.message);
            } else {
                setSession(data.session);
                setUser(data.session?.user ?? null);
            }

            setLoading(false);
        };

        init();

        //  Real-time auth listener
        const { data: listener } = supabase.auth.onAuthStateChange(
            (event, session) => {
                setSession(session);
                setUser(session?.user ?? null);
                setLoading(false);
            }
        );

        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);

    //  Sign Up
    const signUp = async (email, password, firstName, lastName) => {
        setLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        first_name: firstName,
                        last_name: lastName,
                        display_name: `${firstName} ${lastName}`,
                    },
                },
            });

            if (error) {
                setError(error.message);
                return { data: null, error };
            }

            return { data, error: null };
        } catch (err) {
            return { data: null, error: err };
        } finally {
            setLoading(false);
        }
    };

    // Login
    const login = async (email, password) => {
        setLoading(true);
        setError(null);

        try {

            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                setError(error.message);
                return { data, error };
            }
        } finally {
            setLoading(false);
        }

    };

    //  Logout
    const logout = async () => {
        const { error } = await supabase.auth.signOut();


        if (error) {
            console.error("Logout error:", error.message);
            return false;
        }
        return true;

    };

    return {
        user,
        session,
        loading,
        error,
        signUp,
        login,
        logout,
    };
};

export default useAuth;