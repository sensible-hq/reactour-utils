// Observables.tsx
import { useRef, useEffect, useState } from "react";
import useMutationObserver from "@rooks/use-mutation-observer";
import ResizeObserver from "resize-observer-polyfill";
var Observables = ({
  mutationObservables,
  resizeObservables,
  refresh
}) => {
  const [mutationsCounter, setMutationsCounter] = useState(0);
  const ref = useRef(document.documentElement || document.body);
  function refreshHighlightedRegionIfObservable(nodes) {
    const posibleNodes = Array.from(nodes);
    for (const node of posibleNodes) {
      if (mutationObservables) {
        if (!node.attributes) {
          continue;
        }
        const found = mutationObservables.find(
          (observable) => node.matches(observable) || node.querySelector(observable)
        );
        if (found) {
          refresh(true);
        }
      }
    }
  }
  function incrementMutationsCounterIfObservable(nodes) {
    const posibleNodes = Array.from(nodes);
    for (const node of posibleNodes) {
      if (resizeObservables) {
        if (!node.attributes) {
          continue;
        }
        const found = resizeObservables.find(
          (observable) => node.matches(observable) || node.querySelector(observable)
        );
        if (found)
          setMutationsCounter(mutationsCounter + 1);
      }
    }
  }
  useMutationObserver(
    ref,
    (mutationList) => {
      for (const mutation of mutationList) {
        if (mutation.addedNodes.length !== 0) {
          refreshHighlightedRegionIfObservable(mutation.addedNodes);
          incrementMutationsCounterIfObservable(mutation.addedNodes);
        }
        if (mutation.removedNodes.length !== 0) {
          refreshHighlightedRegionIfObservable(mutation.removedNodes);
          incrementMutationsCounterIfObservable(mutation.removedNodes);
        }
      }
    },
    { childList: true, subtree: true }
  );
  useEffect(() => {
    if (!resizeObservables) {
      return;
    }
    const resizeObserver = new ResizeObserver(() => {
      refresh();
    });
    for (const observable of resizeObservables) {
      const element = document.querySelector(observable);
      if (element) {
        resizeObserver.observe(element);
      }
    }
    return () => {
      resizeObserver.disconnect();
    };
  }, [resizeObservables, mutationsCounter]);
  return null;
};
var Observables_default = Observables;

// useRect.tsx
import { useEffect as useEffect2, useCallback, useState as useState2 } from "react";
function getRect(element) {
  let rect = initialState;
  if (element) {
    const domRect = element.getBoundingClientRect();
    rect = domRect;
  }
  return rect;
}
function useRect(ref, refresher) {
  const [dimensions, setDimensions] = useState2(initialState);
  const handleResize = useCallback(() => {
    if (!(ref == null ? void 0 : ref.current))
      return;
    setDimensions(getRect(ref == null ? void 0 : ref.current));
  }, [ref == null ? void 0 : ref.current]);
  useEffect2(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [ref == null ? void 0 : ref.current, refresher]);
  return dimensions;
}
function useElemRect(elem, refresher) {
  const [dimensions, setDimensions] = useState2(initialState);
  const handleResize = useCallback(() => {
    if (!elem)
      return;
    setDimensions(getRect(elem));
  }, [elem]);
  useEffect2(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [elem, refresher]);
  return dimensions;
}
var initialState = {
  bottom: 0,
  height: 0,
  left: 0,
  right: 0,
  top: 0,
  width: 0,
  x: 0,
  y: 0
};

// smoothScroll.tsx
function smoothScroll(elem, options) {
  return new Promise((resolve) => {
    if (!(elem instanceof Element)) {
      throw new TypeError("Argument 1 must be an Element");
    }
    let same = 0;
    let lastPos = null;
    const scrollOptions = Object.assign({ behavior: "smooth" }, options);
    elem.scrollIntoView(scrollOptions);
    requestAnimationFrame(check);
    function check() {
      const newPos = elem == null ? void 0 : elem.getBoundingClientRect().top;
      if (newPos === lastPos) {
        if (same++ > 2) {
          return resolve(null);
        }
      } else {
        same = 0;
        lastPos = newPos;
      }
      requestAnimationFrame(check);
    }
  });
}

// useIntersectionObserver.tsx
import { useEffect as useEffect3, useState as useState3 } from "react";
function useIntersectionObserver(elementRef, {
  threshold = 0,
  root = null,
  rootMargin = "0%",
  freezeOnceVisible = false
}) {
  const [entry, setEntry] = useState3();
  const frozen = (entry == null ? void 0 : entry.isIntersecting) && freezeOnceVisible;
  const updateEntry = ([entry2]) => {
    setEntry(entry2);
  };
  useEffect3(() => {
    const node = elementRef == null ? void 0 : elementRef.current;
    const hasIOSupport = !!window.IntersectionObserver;
    if (!hasIOSupport || frozen || !node)
      return;
    const observerParams = { threshold, root, rootMargin };
    const observer = new IntersectionObserver(updateEntry, observerParams);
    observer.observe(node);
    return () => observer.disconnect();
  }, [elementRef, JSON.stringify(threshold), root, rootMargin, frozen]);
  return entry;
}

// helpers.tsx
function safe(sum) {
  return sum < 0 ? 0 : sum;
}
function getInViewThreshold(threshold) {
  if (typeof threshold === "object" && threshold !== null) {
    return {
      thresholdX: threshold.x || 0,
      thresholdY: threshold.y || 0
    };
  }
  return {
    thresholdX: threshold || 0,
    thresholdY: threshold || 0
  };
}
function getWindow() {
  const w = Math.max(
    document.documentElement.clientWidth,
    window.innerWidth || 0
  );
  const h = Math.max(
    document.documentElement.clientHeight,
    window.innerHeight || 0
  );
  return { w, h };
}
function inView({
  top,
  right,
  bottom,
  left,
  threshold
}) {
  const { w: windowWidth, h: windowHeight } = getWindow();
  const { thresholdX, thresholdY } = getInViewThreshold(threshold);
  return top < 0 && bottom - top > windowHeight ? true : top >= 0 + thresholdY && left >= 0 + thresholdX && bottom <= windowHeight - thresholdY && right <= windowWidth - thresholdX;
}
var isHoriz = (pos) => /(left|right)/.test(pos);
var isOutsideX = (val, windowWidth) => {
  return val > windowWidth;
};
var isOutsideY = (val, windowHeight) => {
  return val > windowHeight;
};
function bestPositionOf(positions) {
  return Object.keys(positions).map((p) => {
    return {
      position: p,
      value: positions[p]
    };
  }).sort((a, b) => b.value - a.value).map((p) => p.position);
}
var defaultPadding = 10;
function getPadding(padding = defaultPadding) {
  if (Array.isArray(padding)) {
    return padding[0] ? [padding[0], padding[1] ? padding[1] : padding[0]] : [defaultPadding, defaultPadding];
  }
  return [padding, padding];
}
export {
  Observables_default as Observables,
  bestPositionOf,
  getInViewThreshold,
  getPadding,
  getRect,
  getWindow,
  inView,
  isHoriz,
  isOutsideX,
  isOutsideY,
  safe,
  smoothScroll,
  useElemRect,
  useIntersectionObserver,
  useRect
};
