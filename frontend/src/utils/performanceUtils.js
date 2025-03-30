/**
 * Creates a debounced version of a function that delays execution until after wait milliseconds
 * @param {Function} func - The function to debounce
 * @param {number} wait - The number of milliseconds to delay
 * @returns {Function} - The debounced function
 */
export function debounce(func, wait = 300) {
  let timeout;

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
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

  return function throttled(...args) {
    if (waiting) return;

    func.apply(this, args);
    waiting = true;

    setTimeout(() => {
      waiting = false;
    }, wait);
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
 * Measures the execution time of a function in development
 * @param {Function} func - The function to measure
 * @param {string} [label] - Label for the measurement
 * @returns {Function} - Wrapped function that logs performance in development
 */
export function measurePerformance(func, label = "Function Performance") {
  return function measured(...args) {
    if (process.env.NODE_ENV !== "production") {
      performance.mark(`${label}-start`);
      const result = func.apply(this, args);
      performance.mark(`${label}-end`);
      performance.measure(label, `${label}-start`, `${label}-end`);

      const measurements = performance.getEntriesByName(label);
      console.log(
        `⏱️ ${label}: ${measurements[measurements.length - 1].duration}ms`
      );

      return result;
    }
    return func.apply(this, args);
  };
}
