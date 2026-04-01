import { useState } from 'react'

const AuthBackground = () => {
    const [loaded, setLoaded] = useState(false)
    return (
        <>
            <div className="hidden md:block h-full overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1497215641119-bbe6d71ebaae?q=80&w=687&auto=format&fit=crop"
                    alt="Workspace"
                    onLoad={() => setLoaded(true)}
                    className={`
                    w-full max-h-screen object-cover object-bottom
                    transition-all duration-700 ease-out
                    ${loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}
                    `}
                />
            </div>
        </>
    );
}

export default AuthBackground