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
    const signUp = async (email, password, firstName, lastName, role, departmentId, jobId) => {
        setLoading(true);
        setError(null);

        try {
            const previousSession = session;
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        first_name: firstName,
                        last_name: lastName,
                        display_name: `${firstName} ${lastName}`,
                        role,
                        department_id: departmentId,
                        job_id: jobId,
                    },
                },
            });

            console.log("signUp result", {
                error,
                userId: data?.user?.id,
                userMetadata: data?.user?.user_metadata,
                sessionCreated: Boolean(data?.session),
            })

            if (error) {
                console.log("signUp error details", {
                    message: error.message,
                    status: error.status,
                    name: error.name,
                    code: error.code,
                })
            }

            if (error) {
                setError(error.message);
                return { data: null, error };
            }

            if (data?.session && previousSession) {
                // Restore the existing session so admin stays logged in.
                await supabase.auth.setSession({
                    access_token: previousSession.access_token,
                    refresh_token: previousSession.refresh_token,
                });
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

    // Deactivate (ban) a user via edge function
    const deactivateUser = async (userId) => {
        setLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase.functions.invoke("deactivate-user", {
                body: { userId, isActive: false },
            });

            if (error) {
                setError(error.message || "Failed to deactivate user");
                return { data: null, error };
            }

            return { data, error: null };
        } catch (err) {
            setError(err.message || "Failed to deactivate user");
            return { data: null, error: err };
        } finally {
            setLoading(false);
        }
    };

    // Reactivate a user via edge function
    const reactivateUser = async (userId) => {
        setLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase.functions.invoke("reactivate-user", {
                body: { userId, isActive: true },
            });

            if (error) {
                setError(error.message || "Failed to reactivate user");
                return { data: null, error };
            }

            return { data, error: null };
        } catch (err) {
            setError(err.message || "Failed to reactivate user");
            return { data: null, error: err };
        } finally {
            setLoading(false);
        }
    };

    

    return {
        user,
        session,
        loading,
        error,
        signUp,
        login,
        logout,
        deactivateUser,
        reactivateUser,
    };
};

export default useAuth;