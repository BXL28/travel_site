import {Link, useLocation} from "react-router";
import {cn} from "~/lib/utils";
import {IntlBase} from "@syncfusion/ej2-base";
import getActualDateTimeFormat = IntlBase.getActualDateTimeFormat;
import {ButtonComponent} from "@syncfusion/ej2-react-buttons";

interface Props {
    title: string;
    description: string;
    ctaText?: string;
    ctaUrl?: string;
}

const Header = ({ title, description, ctaText, ctaUrl }: Props) => {
    const location = useLocation();

    return (
        <header className="header bg-[rgba(255,255,255,0.05)] backdrop-blur-md shadow-md p-6 md:p-10">
            <article>
                <h1 className={cn("text-shadow-black",  location.pathname === '/' ? 'text-2xl md:text-4xl font-bold': 'text-xl md:text-2xl font-semibold')}>{title}</h1>
                <p className={cn("text-blue-950 font-normal",  location.pathname === '/' ? 'text-base md:text-lg': 'text-sm md:text-lg')}>{description}</p>
            </article>

            {ctaText && ctaUrl && (
                <Link to={ctaUrl}>
                    <ButtonComponent type="button" className="!h-11 !w-full md:w-[240px] flex items-center justify-center gap-2 bg-[#EAEAEA]/10 hover:bg-[#EAEAEA]/20 text-[#EAEAEA] transition-colors duration-200">
                        <img src="/assets/icons/plus.svg" alt="plus" className="w-5 h-5" />
                        <span className="font-semibold">{ctaText}</span>
                    </ButtonComponent>
                </Link>
            )}
        </header>
    )
}
export default Header
