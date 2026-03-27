import { Link } from "react-router";
import {ChipDirective, ChipListComponent, ChipsDirective} from "@syncfusion/ej2-react-buttons";
import {cn, getFirstWord} from "~/lib/utils";

const TripCard = ({ id, name, location, imageUrl, tags, price }: TripCardProps) => {
    return (
        <Link
            to={`/trips/${id}`}
            className={cn(
                "trip-card flex flex-col overflow-hidden",
                "transition duration-200 ease-out",
                "hover:-translate-y-1 hover:shadow-xl hover:ring-2 hover:ring-primary-500/15",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
            )}
        >
            <img src={imageUrl} alt={name} />

            <article>
                <h2>{name}</h2>
                <figure>
                    <img
                        src="/assets/icons/location-mark.svg"
                        alt="location" className="size-4"
                    />
                    <figcaption>{location}</figcaption>
                </figure>
            </article>

            <div className="mt-5 pl-[18px] pr-3.5 pb-5">
                <ChipListComponent id={`travel-chip-${id}`}>
                    <ChipsDirective>
                        {tags?.map((tag, index) => (
                            <ChipDirective
                                key={index}
                                text={getFirstWord(tag)}
                                cssClass={cn(index===1
                                    ? '!bg-pink-50 !text-pink-500'
                                    : '!bg-success-50 !text-success-700')}
                            />
                        ))}
                    </ChipsDirective>
                </ChipListComponent>
            </div>

            <article className="tripCard-pill">{price}</article>
        </Link>
    )
}
export default TripCard