"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// index.tsx
var utils_exports = {};
__export(utils_exports, {
  Observables: () => Observables_default,
  bestPositionOf: () => bestPositionOf,
  getInViewThreshold: () => getInViewThreshold,
  getPadding: () => getPadding,
  getRect: () => getRect,
  getWindow: () => getWindow,
  inView: () => inView,
  isHoriz: () => isHoriz,
  isOutsideX: () => isOutsideX,
  isOutsideY: () => isOutsideY,
  safe: () => safe,
  smoothScroll: () => smoothScroll,
  useElemRect: () => useElemRect,
  useIntersectionObserver: () => useIntersectionObserver,
  useRect: () => useRect
});
module.exports = __toCommonJS(utils_exports);

// Observables.tsx
var import_react = require("react");
var import_use_mutation_observer = __toESM(require("@rooks/use-mutation-observer"));
var import_resize_observer_polyfill = __toESM(require("resize-observer-polyfill"));
var Observables = ({
  mutationObservables,
  resizeObservables,
  refresh
}) => {
  const [mutationsCounter, setMutationsCounter] = (0, import_react.useState)(0);
  const ref = (0, import_react.useRef)(document.documentElement || document.body);
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
  (0, import_use_mutation_observer.default)(
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
  (0, import_react.useEffect)(() => {
    if (!resizeObservables) {
      return;
    }
    const resizeObserver = new import_resize_observer_polyfill.default(() => {
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
var import_react2 = require("react");
function getRect(element) {
  let rect = initialState;
  if (element) {
    const domRect = element.getBoundingClientRect();
    rect = domRect;
  }
  return rect;
}
function useRect(ref, refresher) {
  const [dimensions, setDimensions] = (0, import_react2.useState)(initialState);
  const handleResize = (0, import_react2.useCallback)(() => {
    if (!(ref == null ? void 0 : ref.current))
      return;
    setDimensions(getRect(ref == null ? void 0 : ref.current));
  }, [ref == null ? void 0 : ref.current]);
  (0, import_react2.useEffect)(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [ref == null ? void 0 : ref.current, refresher]);
  return dimensions;
}
function useElemRect(elem, refresher) {
  const [dimensions, setDimensions] = (0, import_react2.useState)(initialState);
  const handleResize = (0, import_react2.useCallback)(() => {
    if (!elem)
      return;
    setDimensions(getRect(elem));
  }, [elem]);
  (0, import_react2.useEffect)(() => {
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
var import_react3 = require("react");
function useIntersectionObserver(elementRef, {
  threshold = 0,
  root = null,
  rootMargin = "0%",
  freezeOnceVisible = false
}) {
  const [entry, setEntry] = (0, import_react3.useState)();
  const frozen = (entry == null ? void 0 : entry.isIntersecting) && freezeOnceVisible;
  const updateEntry = ([entry2]) => {
    setEntry(entry2);
  };
  (0, import_react3.useEffect)(() => {
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Observables,
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
});
