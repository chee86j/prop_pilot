// Performance optimization utilities

/**
 * Creates a debounced version of a function that delays execution until after wait milliseconds
 * @param {Function} func - The function to debounce
 * @param {number} wait - The number of milliseconds to delay
 * @param {boolean} immediate - Whether to execute at the beginning of the delay
 * @returns {Function} - The debounced function
 */
export function debounce(func, wait = 300, immediate = false) {
  let timeout;

  return function executedFunction(...args) {
    const context = this;

    const later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };

    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);

    if (callNow) func.apply(context, args);
  };
}

/**
 * Creates a throttled version of a function that executes at most once per every wait milliseconds
 * @param {Function} func - The function to throttle
 * @param {number} wait - The number of milliseconds to wait between executions
 * @returns {Function} - The throttled function
 */
export function throttle(func, wait = 300) {
  let waiting = false;
  let lastArgs = null;
  let lastThis = null;

  return function throttled(...args) {
    if (waiting) {
      lastArgs = args;
      lastThis = this;
      return;
    }

    func.apply(this, args);
    waiting = true;

    setTimeout(() => {
      waiting = false;
      if (lastArgs) {
        throttled.apply(lastThis, lastArgs);
        lastArgs = null;
        lastThis = null;
      }
    }, wait);
  };
}

/**
 * Memoizes a function to cache its results based on arguments
 * @param {Function} func - The function to memoize
 * @param {Function} [resolver] - Function to resolve the cache key
 * @returns {Function} - The memoized function
 */
export function memoize(func, resolver) {
  const cache = new Map();

  return function memoized(...args) {
    const key = resolver ? resolver.apply(this, args) : JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = func.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

/**
 * Creates a function that batches calls to the callback
 * @param {Function} callback - The function to batch
 * @param {number} [delay=0] - The number of milliseconds to delay
 * @returns {Function} - The batched function
 */
export function batchCalls(callback, delay = 0) {
  let batch = [];
  let timeout;

  return function batched(item) {
    batch.push(item);

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      const items = [...batch];
      batch = [];
      callback(items);
    }, delay);
  };
}

/**
 * Creates an async queue for processing items with a concurrency limit
 * @param {Function} processor - Async function to process each item
 * @param {number} [concurrency=1] - Number of concurrent processes
 * @returns {Object} - Queue interface
 */
export function createAsyncQueue(processor, concurrency = 1) {
  let running = 0;
  const queue = [];

  function runNext() {
    if (running >= concurrency || queue.length === 0) return;

    const { item, resolve, reject } = queue.shift();
    running++;

    processor(item)
      .then(resolve)
      .catch(reject)
      .finally(() => {
        running--;
        runNext();
      });
  }

  return {
    add(item) {
      return new Promise((resolve, reject) => {
        queue.push({ item, resolve, reject });
        runNext();
      });
    },
    get size() {
      return queue.length;
    },
    get running() {
      return running;
    },
  };
}

/**
 * Creates a RAF-based animation frame scheduler
 * @param {Function} callback - Function to call on animation frame
 * @returns {Object} - Scheduler interface
 */
export function createFrameScheduler(callback) {
  let frameId = null;
  let lastTime = 0;

  function tick(timestamp) {
    if (lastTime === 0) lastTime = timestamp;
    const delta = timestamp - lastTime;
    lastTime = timestamp;

    callback(delta);
    frameId = requestAnimationFrame(tick);
  }

  return {
    start() {
      if (!frameId) {
        frameId = requestAnimationFrame(tick);
      }
    },
    stop() {
      if (frameId) {
        cancelAnimationFrame(frameId);
        frameId = null;
        lastTime = 0;
      }
    },
    isRunning() {
      return frameId !== null;
    },
  };
}

/**
 * Creates an intersection observer with performance optimizations
 * @param {Function} callback - Intersection observer callback
 * @param {Object} [options] - Intersection observer options
 * @returns {IntersectionObserver} - Optimized intersection observer
 */
export function createOptimizedObserver(callback, options = {}) {
  const throttledCallback = throttle((entries, observer) => {
    callback(entries, observer);
  }, 100);

  return new IntersectionObserver(throttledCallback, options);
}

/**
 * Measures the execution time of a function
 * @param {Function} func - The function to measure
 * @param {string} [label] - Label for the measurement
 * @returns {Function} - Wrapped function that logs performance
 */
export function measurePerformance(func, label = "Function Performance") {
  return function measured(...args) {
    performance.mark(`${label}-start`);
    const result = func.apply(this, args);
    performance.mark(`${label}-end`);
    performance.measure(label, `${label}-start`, `${label}-end`);

    const measurements = performance.getEntriesByName(label);
    console.log(
      `⏱️ ${label}: ${measurements[measurements.length - 1].duration}ms`
    );

    return result;
  };
}
