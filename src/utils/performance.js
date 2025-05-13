class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.marks = new Map();
  }

  startMeasure(name) {
    if (performance && performance.mark) {
      performance.mark(`${name}-start`);
      this.marks.set(name, Date.now());
    }
  }

  endMeasure(name) {
    if (performance && performance.mark) {
      performance.mark(`${name}-end`);
      performance.measure(name, `${name}-start`, `${name}-end`);

      const startTime = this.marks.get(name);
      const duration = Date.now() - startTime;

      this.metrics.set(name, {
        duration,
        timestamp: Date.now(),
      });

      // Log to analytics if duration is significant
      if (duration > 100) {
        console.warn(`Performance warning: ${name} took ${duration}ms`);
      }
    }
  }

  getMetrics() {
    return Array.from(this.metrics.entries()).map(([name, data]) => ({
      name,
      ...data,
    }));
  }

  clearMetrics() {
    this.metrics.clear();
    this.marks.clear();
  }
}

export const performanceMonitor = new PerformanceMonitor();
