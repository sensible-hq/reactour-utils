import React$1, { RefObject } from 'react';

declare const Observables: React$1.FC<ObservablesProps>;
type ObservablesProps = {
    mutationObservables?: string[];
    resizeObservables?: string[];
    refresh?: any;
};

declare function getRect<T extends Element>(element?: T | undefined | null): RectResult$1;
declare function useRect<T extends Element>(ref: React.RefObject<T> | undefined, refresher?: any): RectResult$1;
declare function useElemRect(elem: Element | undefined, refresher?: any): RectResult$1;
type RectResult$1 = {
    bottom: number;
    height: number;
    left: number;
    right: number;
    top: number;
    width: number;
    x: number;
    y: number;
};

declare function smoothScroll(elem: Element | null, options: any): Promise<unknown>;

declare function useIntersectionObserver(elementRef: RefObject<Element>, { threshold, root, rootMargin, freezeOnceVisible, }: any): any | undefined;

type PositionsType = 'left' | 'right' | 'top' | 'bottom';
type PositionsObjectType = {
    [position: string]: number;
};
type CoordType = number[];
type CoordsObjectType = {
    [position: string]: CoordType;
};
type RectResult = {
    bottom: number;
    height: number;
    left: number;
    right: number;
    top: number;
    width: number;
    x: number;
    y: number;
};
type InViewArgs = RectResult & {
    threshold?: {
        x?: number;
        y?: number;
    } | number;
};

declare function safe(sum: number): number;
declare function getInViewThreshold(threshold: InViewArgs['threshold']): {
    thresholdX: number;
    thresholdY: number;
};
declare function getWindow(): {
    w: number;
    h: number;
};
declare function inView({ top, right, bottom, left, threshold, }: InViewArgs): boolean;
declare const isHoriz: (pos: string) => boolean;
declare const isOutsideX: (val: number, windowWidth: number) => boolean;
declare const isOutsideY: (val: number, windowHeight: number) => boolean;
declare function bestPositionOf(positions: PositionsObjectType): string[];
declare function getPadding(padding?: number | [number, number]): number[];

export { CoordType, CoordsObjectType, InViewArgs, Observables, PositionsObjectType, PositionsType, RectResult, bestPositionOf, getInViewThreshold, getPadding, getRect, getWindow, inView, isHoriz, isOutsideX, isOutsideY, safe, smoothScroll, useElemRect, useIntersectionObserver, useRect };
