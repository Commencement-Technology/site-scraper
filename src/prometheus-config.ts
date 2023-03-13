import client, { Registry } from 'prom-client';

export function config(): Registry {
  // Create a Registry which registers the metrics
  const register = new client.Registry();

  // Add a default label which is added to all metrics
  register.setDefaultLabels({
    app: 'site-scraper',
  });

  // Register the metrics
  register.registerMetric(
    new client.Gauge({
      name: 'ftse_100_value',
      help: 'Value of FTSE 100 Index',
      labelNames: ['index_value', 'index_name'],
    }),
  );

  return register;
}
