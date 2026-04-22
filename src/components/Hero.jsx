import Image from '../assets/images/hero-image.png'

const Hero = () => {
    return (
        <section className="bg-white h-100 py-20 mb-10 mt-0.5 ">
            <div className="max-w-7xl  my-10 mx-auto px-10">

                <div className="flex items-center justify-between gap-10">

                    {/* LEFT: TEXT */}
                    <div className="max-w-xl ">
                        <h1 className="text-4xl -mt-14 font-extrabold text-black">
                            Where recruiting made <span className="text-[#0d624d]">Ease</span>
                        </h1>
                        <p className="mt-4 text-lg text-gray-600 font-medium">
                            We transition talents from bigger and better pots
                        </p>
                    </div>

                    
                    <div className="shrink-0">
                        <img
                            src={Image}
                            alt="hero-image"
                            className="w-100 scale-190 -mt-12 "
                        />
                    </div>

                </div>

            </div>
        </section>
    )
}

export default Hero