import { useState, useEffect } from "react";
import supabase from "../utils/supabaseClient";

const useAvatarUpload = (userId = null) => {
    const [avatarUrl, setAvatarUrl] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAvatar = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Use the provided userId (viewing someone else) or fall back to logged in user
            const targetId = userId || user.id;

            const { data } = await supabase
                .from('users')
                .select('avatar_url')
                .eq('id', targetId)
                .single();

            if (data?.avatar_url) {
                setAvatarUrl(data.avatar_url);
            }
        };

        fetchAvatar();
    }, [userId]);

    const uploadAvatar = async (file) => {
        if (!file) return;

        setUploading(true);
        setError(null);

        try {
            const { data: { user } } = await supabase.auth.getUser();

            const fileExt = file.name.split('.').pop();
            const filePath = `${user.id}/avatar.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file, { upsert: true });

            if (uploadError) {
                setError(uploadError.message);
                return;
            }

            const { data } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            setAvatarUrl(data.publicUrl);

            await supabase
                .from('users')
                .update({ avatar_url: data.publicUrl })
                .eq('id', user.id);

        } catch (err) {
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };

    return { avatarUrl, uploading, error, uploadAvatar };
};

export default useAvatarUpload;