import elasticClient, { ELASTICSEARCH_INDEX } from '../config/elasticsearch';
import Product from '../models/Product';

export class SearchService {
  async indexProduct(product: Product) {
    try {
      await elasticClient.index({
        index: ELASTICSEARCH_INDEX,
        id: product.id.toString(),
        document: {
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock,
          imageUrl: product.imageUrl,
          categoryId: product.categoryId,
          views: product.views,
          discount: product.discount,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
        },
      });
    } catch (error) {
      console.error('Error indexing product:', error);
    }
  }

  async createIndex() {
    try {
      const indexExists = await elasticClient.indices.exists({
        index: ELASTICSEARCH_INDEX,
      });

      if (indexExists) {
        console.log(`Index ${ELASTICSEARCH_INDEX} already exists`);
        return;
      }

      await elasticClient.indices.create({
        index: ELASTICSEARCH_INDEX,
        body: {
          mappings: {
            properties: {
              id: { type: 'integer' },
              name: { type: 'text' },
              description: { type: 'text' },
              price: { type: 'float' },
              stock: { type: 'integer' },
              imageUrl: { type: 'keyword' },
              categoryId: { type: 'integer' },
              views: { type: 'integer' },
              discount: { type: 'integer' },
              createdAt: { type: 'date' },
              updatedAt: { type: 'date' },
            },
          },
        },
      });

      console.log(`Index ${ELASTICSEARCH_INDEX} created successfully`);
    } catch (error) {
      console.error('Error creating index:', error);
      throw error;
    }
  }

  async syncProducts() {
    try {
      const products = await Product.findAll();
      if (products.length === 0) return;

      const operations = products.flatMap((doc) => [
        { index: { _index: ELASTICSEARCH_INDEX, _id: doc.id.toString() } },
        {
          id: doc.id,
          name: doc.name,
          description: doc.description,
          price: doc.price,
          stock: doc.stock,
          imageUrl: doc.imageUrl,
          categoryId: doc.categoryId,
          views: doc.views,
          discount: doc.discount,
          createdAt: doc.createdAt,
          updatedAt: doc.updatedAt,
        },
      ]);

      const bulkResponse = await elasticClient.bulk({ operations });

      if (bulkResponse.errors) {
        const erroredDocuments: any[] = [];
        bulkResponse.items.forEach((action: any, i) => {
          const operation = Object.keys(action)[0];
          if (action[operation].error) {
            erroredDocuments.push({
              status: action[operation].status,
              error: action[operation].error,
              operation: operations[i * 2],
              document: operations[i * 2 + 1],
            });
          }
        });
        console.error('Bulk index errors', erroredDocuments);
      }
    } catch (error) {
      console.error('Error syncing products:', error);
      throw error;
    }
  }

  async search(params: any) {
    const { keyword, categoryId, minPrice, maxPrice, minViews, hasDiscount, sort, limit, offset } = params;
    const must: any[] = [];
    const filter: any[] = [];

    if (keyword) {
      must.push({
        multi_match: {
          query: keyword,
          fields: ['name', 'description'],
        },
      });
    } else {
      must.push({ match_all: {} });
    }

    if (categoryId) {
      filter.push({ term: { categoryId } });
    }

    if (minPrice || maxPrice) {
      const range: any = {};
      if (minPrice) range.gte = minPrice;
      if (maxPrice) range.lte = maxPrice;
      filter.push({ range: { price: range } });
    }
    
    if (hasDiscount === 'true' || hasDiscount === true) {
        filter.push({ range: { discount: { gt: 0 } } });
    }
    
    if (minViews) {
        filter.push({ range: { views: { gte: minViews } } });
    }

    const sortOptions: any[] = [];
    if (sort === 'price_asc') sortOptions.push({ price: 'asc' });
    if (sort === 'price_desc') sortOptions.push({ price: 'desc' });
    if (sort === 'views_desc') sortOptions.push({ views: 'desc' });
    if (sort === 'newest') sortOptions.push({ createdAt: 'desc' });
    
    // Default sort if none specified
    if (sortOptions.length === 0) {
      sortOptions.push({ createdAt: 'desc' });
    }

    try {
      const result = await elasticClient.search({
        index: ELASTICSEARCH_INDEX,
        query: {
          bool: {
            must,
            filter,
          },
        },
        sort: sortOptions,
        size: limit || 10000, // Default to large number if no limit
        from: offset || 0,
      });

      return result.hits.hits.map((hit) => hit._source);
    } catch (error) {
      console.error('Error searching products:', error);
      // Return empty array or throw, depending on preference. 
      // If index doesn't exist yet, it might throw.
      return []; 
    }
  }

  async count(params: any): Promise<number> {
    const { keyword, categoryId, minPrice, maxPrice, minViews, hasDiscount } = params;
    const must: any[] = [];
    const filter: any[] = [];

    if (keyword) {
      must.push({
        multi_match: {
          query: keyword,
          fields: ['name', 'description'],
        },
      });
    } else {
      must.push({ match_all: {} });
    }

    if (categoryId) {
      filter.push({ term: { categoryId } });
    }

    if (minPrice || maxPrice) {
      const range: any = {};
      if (minPrice) range.gte = minPrice;
      if (maxPrice) range.lte = maxPrice;
      filter.push({ range: { price: range } });
    }
    
    if (hasDiscount === 'true' || hasDiscount === true) {
        filter.push({ range: { discount: { gt: 0 } } });
    }
    
    if (minViews) {
        filter.push({ range: { views: { gte: minViews } } });
    }

    try {
      const result = await elasticClient.count({
        index: ELASTICSEARCH_INDEX,
        query: {
          bool: {
            must,
            filter,
          },
        },
      });

      return result.count;
    } catch (error) {
      console.error('Error counting products:', error);
      return 0;
    }
  }
}
