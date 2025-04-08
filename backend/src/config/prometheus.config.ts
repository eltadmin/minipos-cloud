import { Registry, collectDefaultMetrics } from 'prom-client';
import { INestApplication } from '@nestjs/common';
import { Request, Response } from 'express';

interface MetricLabels {
  method: string;
  route: string;
  status_code: number;
}

export class PrometheusService {
  private static registry: Registry;

  static init(app: INestApplication) {
    this.registry = new Registry();
    
    // Add default metrics (CPU, memory, etc.)
    collectDefaultMetrics({ register: this.registry });

    // Add custom metrics
    const httpRequestDuration = new this.registry.Histogram({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route', 'status_code'],
      buckets: [0.1, 0.5, 1, 2, 5],
    });

    const httpRequestTotal = new this.registry.Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status_code'],
    });

    // Add middleware to track requests
    app.use((req: Request, res: Response, next: () => void) => {
      const start = Date.now();
      res.on('finish', () => {
        const duration = Date.now() - start;
        const route = (req.route?.path || req.path) as string;
        const labels: MetricLabels = {
          method: req.method,
          route,
          status_code: res.statusCode,
        };

        httpRequestDuration.observe(labels, duration / 1000);
        httpRequestTotal.inc(labels);
      });
      next();
    });

    // Expose metrics endpoint
    app.get('/metrics', async (req: Request, res: Response) => {
      res.set('Content-Type', this.registry.contentType);
      res.end(await this.registry.metrics());
    });
  }

  static async getMetrics(): Promise<string> {
    return await this.registry.metrics();
  }
} 