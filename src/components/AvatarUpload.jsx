import useAvatarUpload from "../hooks/useAvatarUpload";
import { cn } from "../lib/utils";

const AvatarUpload = ({
    userId,
    isViewOnly = false,
    className,
    wrapperClassName,
    avatarUrl: providedAvatarUrl,
    alt = "Avatar",
}) => {
    const { avatarUrl, uploading, error, uploadAvatar } = useAvatarUpload(userId);
    // Prefer an immediate, parent-provided URL while the hook fetches the latest avatar.
    const displayAvatarUrl = providedAvatarUrl || avatarUrl;

    const handleUpload = (e) => {
        const file = e.target.files[0];
        uploadAvatar(file);
    };

    return (
        <div
            className={cn(
                "flex flex-col items-center gap-4 w-full md:w-1/3",
                wrapperClassName
            )}
        >
            <div
                className={cn(
                    "w-32 h-32 border rounded-full bg-gray-200 overflow-hidden flex items-center justify-center",
                    className
                )}
            >
                {displayAvatarUrl ? (
                    <img
                        src={displayAvatarUrl}
                        alt={alt}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <span className="text-gray-500 text-sm">No Image</span>
                )}
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            {!isViewOnly && (
                <label className="cursor-pointer bg-gray-100 px-4 py-2 rounded-lg text-sm hover:bg-gray-200 transition">
                    {uploading ? 'Uploading...' : 'Upload Image'}
                    <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleUpload}
                        disabled={uploading}
                    />
                </label>
            )}
        </div>
    );
};

export default AvatarUpload;