import { useEffect, useState } from "react";
import supabase from "../utils/supabaseClient";

const DEFAULT_LIMIT = 5;
const storageKeyForUser = (userId) => `notifications_cleared_at:${userId}`;

const useNotifications = (userId, limit = DEFAULT_LIMIT, options = {}) => {
    const { role } = options;
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userId) {
            setNotifications([]);
            setLoading(false);
            return;
        }

        const fetchNotifications = async () => {
            setLoading(true);
            setError(null);

            try {
                const clearedAtRaw = localStorage.getItem(storageKeyForUser(userId));
                const clearedAt = clearedAtRaw ? new Date(clearedAtRaw) : null;

                let data;
                let fetchError;

                if (role === "Mentor") {
                    const mentorResponse = await supabase
                        .from("apprentice")
                        .select(`
                            id,
                            created_at,
                            updated_at,
                            applicant:users!apprentice_user_id_fkey (
                                id,
                                display_name
                            ),
                            program:programs!apprentice_program_id_fkey (
                                id,
                                mentor
                            )
                        `)
                        .eq("program.mentor", userId)
                        .order("created_at", { ascending: false })
                        .limit(limit);

                    data = mentorResponse.data;
                    fetchError = mentorResponse.error;
                } else {
                    const response = await supabase
                        .from("applications")
                        .select(`
                            id,
                            created_at,
                            updated_at,
                            user_id,
                            assigned,
                            applicant:users!applications_user_id_fkey (
                                id,
                                display_name
                            )
                        `)
                        .order("created_at", { ascending: false })
                        .limit(limit);

                    data = response.data;
                    fetchError = response.error;
                }

                if (fetchError) throw fetchError;

                const normalized = (data || []).map((item) => {
                    const isAssignedToUser = role !== "Mentor" && item.assigned === userId;

                    return {
                        id: item.id,
                        type: isAssignedToUser ? "assigned" : "new",
                        time: isAssignedToUser ? item.updated_at : item.created_at,
                        applicantName: item.applicant?.display_name ?? "Unknown",
                        applicantId: item.applicant?.id ?? null,
                    };
                }).filter((item) => {
                    if (!clearedAt) return true;
                    const itemTime = item.time ? new Date(item.time) : null;
                    if (!itemTime || Number.isNaN(itemTime.getTime())) return true;
                    return itemTime > clearedAt;
                });

                setNotifications(normalized);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, [userId, limit, role]);

    const clearNotifications = () => {
        if (userId) {
            localStorage.setItem(storageKeyForUser(userId), new Date().toISOString());
        }
        setNotifications([]);
    };

    return { notifications, loading, error, clearNotifications };
};

export default useNotifications;
