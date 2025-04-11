/**
 * Performance utilities
 * Contains functions for monitoring and optimizing performance
 */
import { onCLS, onFID, onLCP, onTTFB, onFCP } from "web-vitals";

const vitalsUrl = "https://vitals.vercel-analytics.com/v1/vitals";

/**
 * Gets the current connection speed
 * @returns {string} - Connection speed
 */
function getConnectionSpeed() {
  if (!navigator.connection) {
    return "unknown";
  }
  return navigator.connection.effectiveType;
}

/**
 * Sends performance metrics to analytics service
 * @param {Object} metric - Performance metric object
 * @param {Object} options - Additional options
 */
function sendToAnalytics(metric, options = {}) {
  const page = window.location.pathname;
  const analyticsId = window.ENV?.ANALYTICS_ID;

  // Skip if analytics ID is not configured
  if (!analyticsId) {
    console.debug("Analytics ID not configured, skipping web vitals reporting");
    return;
  }

  const body = {
    dsn: analyticsId,
    id: metric.id,
    page,
    href: window.location.href,
    event_name: metric.name,
    value: metric.value.toString(),
    speed: getConnectionSpeed(),
    ...options,
  };

  const blob = new Blob([new URLSearchParams(body).toString()], {
    type: "application/x-www-form-urlencoded",
  });
  if (navigator.sendBeacon) {
    navigator.sendBeacon(vitalsUrl, blob);
  } else {
    fetch(vitalsUrl, {
      body: blob,
      method: "POST",
      credentials: "omit",
      keepalive: true,
    });
  }
}

/**
 * Initializes performance monitoring
 * Tracks web vitals and custom performance marks
 */
export function initializePerformanceMonitoring() {
  try {
    onFID((metric) => {
      // First Input Delay
      console.log("🎯 FID:", metric.value);
      sendToAnalytics(metric);
    });

    onLCP((metric) => {
      // Largest Contentful Paint
      console.log("🎨 LCP:", metric.value);
      sendToAnalytics(metric);
    });

    onCLS((metric) => {
      // Cumulative Layout Shift
      console.log("📏 CLS:", metric.value);
      sendToAnalytics(metric);
    });

    onTTFB((metric) => {
      // Time to First Byte
      console.log("⚡ TTFB:", metric.value);
      sendToAnalytics(metric);
    });

    onFCP((metric) => {
      // First Contentful Paint
      console.log("🎬 FCP:", metric.value);
      sendToAnalytics(metric);
    });

    // Custom performance marks
    if (window.performance) {
      window.performance.mark("app_started");

      // Measure time to interactive
      window.addEventListener("load", () => {
        window.performance.mark("app_loaded");
        window.performance.measure(
          "time_to_interactive",
          "app_started",
          "app_loaded"
        );

        const tti = window.performance.getEntriesByName(
          "time_to_interactive"
        )[0];
        console.log("⏱️ Time to Interactive:", tti.duration);
        sendToAnalytics({
          name: "TTI",
          value: tti.duration,
          id: "tti",
        });
      });
    }
  } catch (error) {
    console.error("Error initializing performance monitoring:", error);
  }
}

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
    if (import.meta.env.MODE !== "production") {
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
