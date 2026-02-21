interface InfoPillProps {
    text: string;
    image: string;
}

const InfoPill = ({ text, image }: InfoPillProps) => {
    return (
        <figure className="info-pill flex items-center gap-2">
            <img src={image} alt={text} className="size-5" />

            {/* Added text-black class here */}
            <figcaption className="text-black font-medium">
                {text}
            </figcaption>
        </figure>
    )
}

export default InfoPill;