/* eslint-disable no-underscore-dangle */
import cron from 'node-cron';
import * as dotenv from 'dotenv';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { config } from './prometheus-config';
import { startServer } from './server';

dotenv.config();
const prometheusRegister = config();
startServer(prometheusRegister);

async function scrape(metricsRegister): Promise<void> {
  try {
    // fetch data from page and parse with cheerio
    const { data } = await axios.get(
      'https://www.hl.co.uk/shares/stock-market-summary/ftse-100',
    );
    const $ = cheerio.load(data);

    const ftse100StringValue = $('#indices-val-UKX').text();
    // We must convert the string into a number by removing the comma and using parseFloat
    const ftse100NumberValue = parseFloat(ftse100StringValue.replace(',', ''));

    const ftse100Metric = await metricsRegister._metrics.ftse_100_value;

    ftse100Metric.set({ index_name: 'ftse_100' }, ftse100NumberValue);

    console.log(`FTSE 100 value: ${ftse100NumberValue}`);
  } catch (error) {
    console.error(error);
  }
}

cron.schedule(process.env.CRON_SCHEDULE, () => scrape(prometheusRegister));
