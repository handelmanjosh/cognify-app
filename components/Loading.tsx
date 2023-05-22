

export default function Loading() {
    return (
        <div className="absolute top-0 left-0 w-full h-full bg-white opacity-50 z-50 flex justify-center items-center">
            {/* <p className="text-black text-xl md:text-5xl">Loading...</p> */}
            <Spinner />
        </div>
    );
}


function Spinner() {
    return (
        <div className="w-6 md:w-12 lg:w-16 rounded-full aspect-square animate-spin opacity-100 border-t-4 border-primary"></div>
    );
}