import GenreList from "../components/GenreList.jsx";

export default function HomePage() {
    return (
        <>
            {/* <div className="max-w-6xl mx-auto p-4"> */}
            <h1 className="text-4xl font-bold mb-6 text-center">
                Dashboard A·KAI
            </h1>
            <div className="flex flex-wrap justify-center">

                <GenreList />
            </div>
        </>
    );
}