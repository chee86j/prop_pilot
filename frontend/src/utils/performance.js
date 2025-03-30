// Performance monitoring utility
/*
This file served to track performance metrics using web-vitals,
1. Collects and sends performance metrics to a remote analytics service
2. Implements performance marks and measures to track time to interactive
3. Handles different browser behaviors for sending metrics
*/
import { onCLS, onFID, onLCP, onTTFB, onFCP } from "web-vitals";

const vitalsUrl = "https://vitals.vercel-analytics.com/v1/vitals";

function getConnectionSpeed() {
  if (!navigator.connection) {
    return "unknown";
  }
  return navigator.connection.effectiveType;
}

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
