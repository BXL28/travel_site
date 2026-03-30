import type { ReactNode } from "react";
import { cn } from "~/lib/utils";
import ZoomHoverImage from "./ZoomHoverImage";

function SlideImagePlaceholder({ label }: { label: string }) {
    return (
        <div
            className="flex min-h-[220px] w-full flex-1 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100/90 px-6 py-10 text-center md:min-h-[280px] md:min-w-0 lg:min-h-[340px]"
            aria-hidden
        >
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Image</span>
            <p className="mt-2 max-w-md text-sm font-medium leading-relaxed text-slate-500">{label}</p>
        </div>
    );
}

type LandingSplitBlockBase = {
    /** Image column on the left, text on the right (md+). On small screens, image stacks first. */
    imageFirst?: boolean;
    kicker: string;
    title: string;
    titleLevel?: "h1" | "h2";
    /** Extra classes on the title (e.g. gradient / animation). */
    titleClassName?: string;
    children: ReactNode;
    ariaLabel?: string;
};

export type LandingSplitBlockProps = LandingSplitBlockBase &
    (
        | {
              /** Custom content in the media column (e.g. trip card). Takes precedence over image / placeholder. */
              mediaSlot: ReactNode;
              imageSrc?: never;
              imageAlt?: never;
              imagePresentation?: never;
              placeholderLabel?: never;
          }
        | {
              mediaSlot?: never;
              imageSrc: string;
              imageAlt: string;
              imagePresentation?: "logo" | "screenshot";
              /** Cursor-centered hover zoom (screenshot layout only). */
              imageZoomOnHover?: boolean;
              placeholderLabel?: never;
          }
        | { mediaSlot?: never; imageSrc?: never; imageAlt?: never; placeholderLabel: string }
    );

export function LandingSplitBlock(props: LandingSplitBlockProps) {
    const { imageFirst = false, kicker, title, titleLevel = "h2", titleClassName, children, ariaLabel } = props;

    const TitleTag = titleLevel === "h1" ? "h1" : "h2";

    const hasCustomImage = "imageSrc" in props && Boolean(props.imageSrc);
    const imagePresentation =
        hasCustomImage && "imagePresentation" in props ? (props.imagePresentation ?? "logo") : "logo";
    const useImageZoom =
        hasCustomImage &&
        imagePresentation === "screenshot" &&
        "imageZoomOnHover" in props &&
        Boolean(props.imageZoomOnHover);

    const hasMediaSlot = "mediaSlot" in props && props.mediaSlot != null;

    const textCol = (
            <div className="flex min-h-0 min-w-0 flex-1 flex-col justify-center md:basis-1/2 md:max-w-[50%]">
            <p className="text-sm font-bold uppercase tracking-widest text-black">{kicker}</p>
            <TitleTag
                className={cn(
                    "mt-3 text-2xl font-bold leading-tight tracking-tight sm:text-3xl lg:text-4xl",
                    !titleClassName && "text-black",
                    titleClassName
                )}
            >
                {title}
            </TitleTag>
            <div className="mt-5 space-y-4 text-base leading-relaxed text-black md:text-lg [&_a]:text-black [&_a]:underline [&_a]:underline-offset-2 [&_strong]:font-semibold [&_strong]:text-black">
                {children}
            </div>
        </div>
    );

    const imageCol = (
        <div className="flex min-h-0 min-w-0 flex-1 flex-col justify-center md:basis-1/2 md:max-w-[50%]">
            {hasMediaSlot && "mediaSlot" in props ? (
                <div className="flex w-full flex-1 flex-col items-center justify-center rounded-2xl border border-slate-200/90 bg-slate-100/80 p-8 shadow-inner ring-1 ring-slate-200/70 md:min-h-[280px] md:p-10 lg:min-h-[320px] lg:p-12">
                    {props.mediaSlot}
                </div>
            ) : hasCustomImage && "imageSrc" in props && "imageAlt" in props ? (
                <div
                    className={cn(
                        "flex w-full flex-1 flex-col items-center justify-center rounded-2xl border border-slate-200/90",
                        imagePresentation === "screenshot"
                            ? "bg-slate-50 p-3 shadow-inner md:min-h-[280px] md:p-4 lg:min-h-[320px]"
                            : "min-h-[220px] bg-gradient-to-br from-slate-50 to-blue-50/40 px-8 py-10 md:min-h-[280px] md:min-w-0 lg:min-h-[340px]"
                    )}
                >
                    {useImageZoom ? (
                        <ZoomHoverImage src={props.imageSrc} alt={props.imageAlt} />
                    ) : (
                        <img
                            src={props.imageSrc}
                            alt={props.imageAlt}
                            className={cn(
                                "rounded-xl",
                                imagePresentation === "screenshot"
                                    ? "max-h-[min(52vh,480px)] w-full object-contain object-top shadow-md ring-1 ring-slate-200/60 md:max-h-[min(58vh,520px)]"
                                    : "h-28 w-auto max-w-[min(100%,220px)] object-contain sm:h-32 md:h-40 lg:h-44"
                            )}
                            decoding="async"
                        />
                    )}
                </div>
            ) : (
                <SlideImagePlaceholder
                    label={
                        "placeholderLabel" in props && typeof props.placeholderLabel === "string"
                            ? props.placeholderLabel
                            : "Image"
                    }
                />
            )}
        </div>
    );

    return (
        <section
            className={cn("w-full overflow-hidden rounded-[28px] border border-slate-200/90 bg-white shadow-md")}
            aria-label={ariaLabel}
        >
            <div className="flex flex-col gap-8 p-8 md:flex-row md:items-stretch md:gap-10 md:p-10 lg:gap-12 lg:p-12 xl:p-14">
                {imageFirst ? (
                    <>
                        {imageCol}
                        {textCol}
                    </>
                ) : (
                    <>
                        {textCol}
                        {imageCol}
                    </>
                )}
            </div>
        </section>
    );
}
