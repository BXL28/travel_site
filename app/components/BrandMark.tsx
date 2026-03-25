import { cn } from "~/lib/utils";

export function BrandMark({
    size = "md",
    className,
}: {
    size?: "sm" | "md" | "lg";
    className?: string;
}) {
    const box =
        size === "sm"
            ? "size-9 rounded-lg"
            : size === "lg"
              ? "size-14 rounded-2xl md:size-16"
              : "size-11 rounded-xl md:size-12";
    const icon = size === "sm" ? "size-5" : size === "lg" ? "size-8 md:size-9" : "size-6 md:size-7";

    return (
        <div
            className={cn(
                "flex shrink-0 items-center justify-center bg-primary-500",
                box,
                className
            )}
        >
            <img src="/assets/icons/logo.svg" className={cn(icon, "invert")} alt="" />
        </div>
    );
}
