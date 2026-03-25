import * as React from "react";
import { cn } from "~/lib/utils";

function shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function pickRandomDifferent(urls: string[], exclude: string): string {
    if (!urls.length) return exclude;
    const pool = urls.filter((u) => u !== exclude);
    if (!pool.length) return urls[Math.floor(Math.random() * urls.length)]!;
    return pool[Math.floor(Math.random() * pool.length)]!;
}

type Props = {
    images: string[];
};

/**
 * True crossfade: back + front layers (front z-10). After fade, swap sources with transition
 * disabled for one frame to prevent flicker. Next image is random (not sequential).
 */
const DashboardHeroSlideshow = ({ images }: Props) => {
    const imagesSig = JSON.stringify(images);
    const listRef = React.useRef<string[]>([]);
    const genRef = React.useRef(0);

    React.useEffect(() => {
        try {
            listRef.current = JSON.parse(imagesSig) as string[];
        } catch {
            listRef.current = [];
        }
    }, [imagesSig]);

    const [back, setBack] = React.useState({ src: "", opacity: 1 });
    const [front, setFront] = React.useState({ src: "", opacity: 0 });
    const [freezeTransition, setFreezeTransition] = React.useState(false);

    const backRef = React.useRef(back);
    const frontRef = React.useRef(front);
    backRef.current = back;
    frontRef.current = front;

    React.useEffect(() => {
        let list: string[] = [];
        try {
            list = JSON.parse(imagesSig) as string[];
        } catch {
            list = [];
        }
        if (!list.length) {
            setBack({ src: "", opacity: 1 });
            setFront({ src: "", opacity: 0 });
            return;
        }
        const shuffled = shuffle([...list]);
        const a = shuffled[0]!;
        const b = (shuffled[1] ?? shuffled[0])!;
        setFreezeTransition(true);
        setBack({ src: a, opacity: 1 });
        setFront({ src: b, opacity: 0 });
        requestAnimationFrame(() => setFreezeTransition(false));
    }, [imagesSig]);

    React.useEffect(() => {
        const list = listRef.current;
        if (list.length <= 1) return;

        const fadeMs = 1200;
        const holdMs = 5200;
        const gen = ++genRef.current;
        let timeoutIds: number[] = [];
        let cancelled = false;

        const clearAll = () => {
            timeoutIds.forEach((id) => window.clearTimeout(id));
            timeoutIds = [];
        };

        const schedule = (delay: number, fn: () => void) => {
            const id = window.setTimeout(() => {
                if (cancelled || gen !== genRef.current) return;
                fn();
            }, delay);
            timeoutIds.push(id);
        };

        const advance = () => {
            if (cancelled || gen !== genRef.current) return;
            setFront((f) => ({ ...f, opacity: 1 }));
            setBack((b) => ({ ...b, opacity: 0 }));

            schedule(fadeMs, () => {
                if (cancelled || gen !== genRef.current) return;
                const visible = frontRef.current.src;
                const next = pickRandomDifferent(listRef.current, visible);

                setFreezeTransition(true);
                setBack({ src: visible, opacity: 1 });
                setFront({ src: next, opacity: 0 });
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => setFreezeTransition(false));
                });

                schedule(holdMs, advance);
            });
        };

        schedule(holdMs, advance);

        return () => {
            cancelled = true;
            clearAll();
        };
    }, [imagesSig]);

    const transitionClass = freezeTransition
        ? ""
        : "transition-opacity duration-[1200ms] ease-in-out";

    if (!back.src && !front.src) {
        return (
            <div
                className={cn(
                    "relative w-full overflow-hidden rounded-[32px] border border-slate-100 bg-slate-200/80 shadow-md",
                    "aspect-[16/10] min-h-[240px] max-h-[min(56vh,560px)] md:aspect-[2.2/1] md:min-h-[320px]"
                )}
                aria-hidden
            >
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                    <p className="px-8 text-center text-sm font-medium text-slate-500">
                        Trip photos will appear here once you create itineraries.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div
            className={cn(
                "relative w-full overflow-hidden rounded-[32px] border border-slate-100 shadow-md",
                "aspect-[16/10] min-h-[240px] max-h-[min(56vh,560px)] md:aspect-[2.2/1] md:min-h-[320px]"
            )}
            aria-roledescription="carousel"
        >
            <img
                src={back.src}
                alt=""
                className={cn("absolute inset-0 z-0 size-full object-cover", transitionClass)}
                style={{ opacity: back.opacity }}
                decoding="async"
                fetchPriority="low"
            />
            {front.src ? (
                <img
                    src={front.src}
                    alt=""
                    className={cn("absolute inset-0 z-10 size-full object-cover", transitionClass)}
                    style={{ opacity: front.opacity }}
                    decoding="async"
                    fetchPriority="low"
                />
            ) : null}
            <div
                className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-slate-900/25 via-transparent to-slate-900/10"
                aria-hidden
            />
        </div>
    );
};

export default DashboardHeroSlideshow;
