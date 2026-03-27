import * as React from "react";
import { cn } from "~/lib/utils";

type Props = {
    src: string;
    alt: string;
    /** Clipping wrapper — keep max-height so zoom stays framed */
    className?: string;
};

/**
 * Hover zoom: scales the image with transform-origin under the cursor (desktop hover).
 */
export default function ZoomHoverImage({ src, alt, className }: Props) {
    const wrapRef = React.useRef<HTMLDivElement>(null);
    const pointerInsideRef = React.useRef(false);
    const [hover, setHover] = React.useState(false);
    const [origin, setOrigin] = React.useState({ x: 50, y: 50 });

    const updateOrigin = React.useCallback((clientX: number, clientY: number) => {
        const el = wrapRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const w = Math.max(r.width, 1);
        const h = Math.max(r.height, 1);
        const x = ((clientX - r.left) / w) * 100;
        const y = ((clientY - r.top) / h) * 100;
        setOrigin({
            x: Math.min(100, Math.max(0, x)),
            y: Math.min(100, Math.max(0, y)),
        });
    }, []);

    return (
        <div
            ref={wrapRef}
            className={cn(
                "relative w-full overflow-hidden rounded-xl shadow-md ring-1 ring-slate-200/60",
                "cursor-zoom-in touch-none",
                className
            )}
            title="Hover to zoom toward cursor"
            onMouseEnter={(e) => {
                pointerInsideRef.current = true;
                setHover(true);
                updateOrigin(e.clientX, e.clientY);
            }}
            onMouseLeave={() => {
                pointerInsideRef.current = false;
                setHover(false);
                setOrigin({ x: 50, y: 50 });
            }}
            onMouseMove={(e) => {
                if (!pointerInsideRef.current) return;
                updateOrigin(e.clientX, e.clientY);
            }}
        >
            <img
                src={src}
                alt={alt}
                draggable={false}
                decoding="async"
                className={cn(
                    "h-auto w-full max-h-[min(52vh,480px)] object-contain object-top motion-safe:transition-[transform]",
                    "select-none md:max-h-[min(58vh,520px)]",
                    "motion-safe:duration-150 motion-safe:ease-out motion-safe:will-change-transform"
                )}
                style={{
                    transformOrigin: `${origin.x}% ${origin.y}%`,
                    transform: hover ? "scale(1.7)" : "scale(1)",
                }}
            />
        </div>
    );
}
