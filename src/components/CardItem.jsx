// src/components/CardItem.jsx
export default function CardItem({ title, description, imageUrl }) {
    return (
        // <article className="bg-white rounded-lg shadow hover:shadow-md transition p-4">
        <article className=' w-[240px] overflow-hidden rounded-lg mt-[52px] bg-[#242424] h-[350px] relative'>
            <div className="w-full h-50 mb-3 overflow-hidden rounded shadow-md shadow-green-500">
                <img
                    src={imageUrl || "https://picsum.photos/seed/placeholder/400/300"}
                    alt={title}
                    loading="lazy"
                    className="w-full h-full object-cover"
                />
            </div>
            <div className=" p-6 py-10">
                <h3 className="text-2xl font-bold mb-1 line-clamp-1">{title}</h3>
                {description && (
                    <p className="text-[#ccc] text-lg line-clamp-2">{description}</p>
                )}
            </div>
        </article>
    );
}