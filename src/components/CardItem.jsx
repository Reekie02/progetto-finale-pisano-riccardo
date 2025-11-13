import icon from '../assets/favicon-02.png'
export default function CardItem({ title, description, imageUrl }) {
    return (
        // <article className="bg-white rounded-lg shadow hover:shadow-md transition p-4">
        <article className=' w-[300px] overflow-hidden rounded-lg mt-[12px] bg-[#242424de] h-[380px] relative'>
            <div className="w-full h-50 mb-3 overflow-hidden">
                <img
                    src={imageUrl || "https://picsum.photos/seed/placeholder/400/300"}
                    alt={title}
                    loading="lazy"
                    className="w-full h-full object-cover"
                />
                <img src={icon} className="absolute right-3 top-3 w-15 h-15" alt="" />
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