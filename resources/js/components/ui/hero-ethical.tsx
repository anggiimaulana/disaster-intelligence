import * as React from 'react';
import { Link } from '@inertiajs/react';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface EthicalHeroStat {
    label: string;
    value: string;
}

export type EthicalHeroHref =
    | string
    | React.ComponentProps<typeof Link>['href']
    | undefined;

export interface EthicalHeroLink {
    label: string;
    href: EthicalHeroHref;
}

export interface EthicalHeroProps {
    kicker?: string;
    title: React.ReactNode;
    subtitle?: string;
    primary?: EthicalHeroLink;
    secondary?: EthicalHeroLink;
    stats?: EthicalHeroStat[];
    meta?: string;
    compact?: boolean;
    className?: string;
}

function isHashHref(href: unknown): href is string {
    return typeof href === 'string' && href.startsWith('#');
}

export function EthicalHero({
    kicker,
    title,
    subtitle,
    primary,
    secondary,
    stats,
    meta,
    compact = false,
    className,
}: EthicalHeroProps) {
    return (
        <section
            className={cn(
                'relative bg-premium-bg',
                compact ? 'py-12 sm:py-16' : 'py-16 sm:py-24 lg:py-32',
                className,
            )}
        >
            <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-10">
                <div className="mx-auto max-w-3xl text-center">
                    {kicker && (
                        <p className="mb-6 inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-premium-blue-accent">
                            <span aria-hidden className="h-px w-6 bg-premium-blue-accent/60" />
                            {kicker}
                            <span aria-hidden className="h-px w-6 bg-premium-blue-accent/60" />
                        </p>
                    )}

                    <h1 className="text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.02em] text-premium-heading sm:text-5xl lg:text-[56px]">
                        {title}
                    </h1>

                    {subtitle && (
                        <p className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-premium-body sm:text-lg">
                            {subtitle}
                        </p>
                    )}

                    {(primary || secondary) && (
                        <div className="mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
                            {primary && primary.href && !isHashHref(primary.href) && (
                                <Link
                                    href={primary.href as React.ComponentProps<typeof Link>['href']}
                                    className="group inline-flex h-11 items-center gap-2 rounded-full bg-premium-navy px-6 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-premium-navy-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-premium-blue-accent focus-visible:ring-offset-2 focus-visible:ring-offset-premium-bg"
                                >
                                    {primary.label}
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                </Link>
                            )}
                            {secondary && secondary.href && (
                                isHashHref(secondary.href) ? (
                                    <a
                                        href={secondary.href}
                                        className="group inline-flex items-center gap-1 text-sm font-semibold text-premium-heading transition-colors hover:text-premium-blue-accent"
                                    >
                                        {secondary.label}
                                        <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                    </a>
                                ) : (
                                    <Link
                                        href={secondary.href as React.ComponentProps<typeof Link>['href']}
                                        className="group inline-flex items-center gap-1 text-sm font-semibold text-premium-heading transition-colors hover:text-premium-blue-accent"
                                    >
                                        {secondary.label}
                                        <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                    </Link>
                                )
                            )}
                        </div>
                    )}

                    {meta && (
                        <p className="mt-6 text-xs text-premium-caption">{meta}</p>
                    )}
                </div>

                {stats && stats.length > 0 && (
                    <dl className="mx-auto mt-14 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-premium-border bg-premium-border sm:grid-cols-4 sm:mt-20">
                        {stats.map((stat, idx) => (
                            <div
                                key={idx}
                                className="flex flex-col gap-1 bg-white px-5 py-5 sm:py-6 text-center"
                            >
                                <dt className="text-[11px] font-semibold uppercase tracking-wider text-premium-caption">
                                    {stat.label}
                                </dt>
                                <dd className="text-2xl font-semibold tracking-tight text-premium-heading sm:text-3xl">
                                    {stat.value}
                                </dd>
                            </div>
                        ))}
                    </dl>
                )}
            </div>
        </section>
    );
}

export default EthicalHero;
