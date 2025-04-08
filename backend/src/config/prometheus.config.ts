import { INestApplication } from '@nestjs/common';
import * as client from 'prom-client';
import { Request, Response } from 'express';

export class PrometheusService {
  private readonly registry: client.Registry;
  private readonly httpRequestDuration: client.Histogram<string>;
  private readonly httpRequestTotal: client.Counter<string>;

  constructor() {
    this.registry = new client.Registry();
    
    this.httpRequestDuration = new client.Histogram({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route', 'status_code'],
      buckets: [0.1, 0.5, 1, 2, 5],
    });

    this.httpRequestTotal = new client.Counter({
      name: 'http_request_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status_code'],
    });

    this.registry.registerMetric(this.httpRequestDuration);
    this.registry.registerMetric(this.httpRequestTotal);
    client.collectDefaultMetrics({ register: this.registry });
  }

  recordMetrics(req: Request, res: Response, duration: number) {
    const labels = {
      method: req.method,
      route: req.route?.path || req.path,
      status_code: res.statusCode.toString(),
    };

    this.httpRequestDuration.observe(labels, duration);
    this.httpRequestTotal.inc(labels);
  }

  setupMetricsRoute(app: INestApplication) {
    app.getHttpAdapter().get('/metrics', async (_req: Request, res: Response) => {
      try {
        const metrics = await this.registry.metrics();
        res.set('Content-Type', this.registry.contentType);
        res.send(metrics);
      } catch (err) {
        res.status(500).send(err);
      }
    });
  }
} 