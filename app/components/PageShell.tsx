import type { ReactNode } from "react";
import { BrandMark } from "./BrandMark";
import { cn } from "~/lib/utils";

export function PageShell({
    children,
    className,
    bgClassName = "bg-[#FAFBFC]",
}: {
    children: ReactNode;
    className?: string;
    bgClassName?: string;
}) {
    return (
        <main className={cn("pb-20 pt-6 md:pt-10", bgClassName, className)}>
            <div className="mx-auto max-w-7xl px-6 lg:px-10">{children}</div>
        </main>
    );
}

export function PageHeading({
    title,
    description,
    as: Tag = "h1",
    size = "hero",
}: {
    title: string;
    description?: string;
    as?: "h1" | "h2";
    size?: "hero" | "section";
}) {
    const titleClass =
        size === "hero"
            ? "text-3xl font-bold tracking-tight text-slate-900 md:text-4xl lg:text-5xl"
            : "text-2xl font-bold tracking-tight text-slate-900 md:text-3xl";

    const markSize = size === "section" ? "sm" : "md";

    return (
        <div className="mx-auto mb-10 max-w-3xl text-center">
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:flex-wrap sm:gap-5">
                <BrandMark size={markSize} />
                <Tag className={titleClass}>{title}</Tag>
            </div>
            {description ? (
                <p className="mt-4 text-lg leading-relaxed text-slate-600 md:text-xl">{description}</p>
            ) : null}
        </div>
    );
}
