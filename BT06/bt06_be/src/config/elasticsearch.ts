import { Client } from '@elastic/elasticsearch';
import dotenv from 'dotenv';

dotenv.config();

const elasticClient = new Client({
  node: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200',
});

export const ELASTICSEARCH_INDEX = process.env.ELASTICSEARCH_INDEX || 'products';

export default elasticClient;
