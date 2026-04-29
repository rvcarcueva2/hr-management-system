import { TiAttachment } from "react-icons/ti";
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
                    "relative group w-32 h-32 border rounded-full bg-gray-200 overflow-hidden flex items-center justify-center",
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
                    <span className="text-gray-500 text-sm"></span>
                )}

                {/* Hover Overlay */}
                {!isViewOnly && (
                    <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition cursor-pointer">
                        {uploading ? (
                            <span className="text-white text-xs">Uploading...</span>
                        ) : (
                            <TiAttachment className="text-white text-3xl" />
                        )}

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

            {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
    );
};

export default AvatarUpload;