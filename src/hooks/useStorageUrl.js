const useStorageUrl = (bucket = 'applications') => {
    const getPublicUrl = (path) => {
        if (!path) return null
        if (path.startsWith('http')) return path
        const encodedPath = path.split('/').map(segment => encodeURIComponent(segment)).join('/')
        return `https://yarnoupdcjqtxznrqewo.supabase.co/storage/v1/object/public/${bucket}/${encodedPath}`
    }

    return { getPublicUrl }
}

export default useStorageUrl