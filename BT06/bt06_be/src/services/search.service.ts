import elasticClient, { ELASTICSEARCH_INDEX } from "../config/elasticsearch";
import Product from "../models/Product";

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
          categoryId: product.categoryId,
          price: product.price,
          views: product.views,
          discount: product.discount,
          createdAt: product.createdAt,
        },
      });
    } catch (error) {
      console.error("Error indexing product:", error);
    }
  }

  async deleteProduct(id: number) {
    try {
      await elasticClient.delete({
        index: ELASTICSEARCH_INDEX,
        id: id.toString(),
      });
    } catch (error) {
      console.error("Error deleting product from ES:", error);
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
          settings: {
            analysis: {
              analyzer: {
                vietnamese_analyzer: {
                  type: "custom",
                  tokenizer: "standard",
                  filter: ["lowercase", "asciifolding"],
                },
              },
            },
          },
          mappings: {
            properties: {
              id: { type: "integer" },
              name: {
                type: "text",
                analyzer: "vietnamese_analyzer",
                fields: {
                  keyword: { type: "keyword" },
                },
              },
              description: {
                type: "text",
                analyzer: "vietnamese_analyzer",
              },
              categoryId: { type: "integer" },
              price: { type: "float" },
              views: { type: "integer" },
              discount: { type: "integer" },
              createdAt: { type: "date" },
            },
          },
        },
      });
    } catch (error) {
      console.error("Error creating index:", error);
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
          categoryId: doc.categoryId,
          price: doc.price,
          views: doc.views,
          discount: doc.discount,
          createdAt: doc.createdAt,
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
        console.error("Bulk index errors", erroredDocuments);
      }
    } catch (error) {
      console.error("Error syncing products:", error);
      throw error;
    }
  }

  async search(params: any) {
    const {
      keyword,
      categoryId,
      minPrice,
      maxPrice,
      minViews,
      hasDiscount,
      sort,
      limit,
      offset,
    } = params;
    const must: any[] = [];
    const filter: any[] = [];

    if (keyword) {
      must.push({
        multi_match: {
          query: keyword,
          fields: ["name", "description"],
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

    if (hasDiscount === "true" || hasDiscount === true) {
      filter.push({ range: { discount: { gt: 0 } } });
    }

    if (minViews) {
      filter.push({ range: { views: { gte: minViews } } });
    }

    const sortOptions: any[] = [];
    if (sort === "price_asc") sortOptions.push({ price: "asc" });
    if (sort === "price_desc") sortOptions.push({ price: "desc" });
    if (sort === "views_desc") sortOptions.push({ views: "desc" });
    if (sort === "newest") sortOptions.push({ createdAt: "desc" });

    // Default sort if none specified
    if (sortOptions.length === 0) {
      sortOptions.push({ createdAt: "desc" });
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
        size: limit || 10000,
        from: offset || 0,
        _source: ["id"], // Only fetch ID field
      });

      // Return array of IDs in the order ES sorted them
      const ids = result.hits.hits
        .map((hit) => {
          const id = (hit._source as any)?.id;
          return id ? parseInt(id.toString()) : null;
        })
        .filter((id) => id !== undefined && id !== null);

      return ids;
    } catch (error) {
      console.error("Error searching products:", error);
      return [];
    }
  }

  async count(params: any): Promise<number> {
    const { keyword, categoryId, minPrice, maxPrice, minViews, hasDiscount } =
      params;
    const must: any[] = [];
    const filter: any[] = [];

    if (keyword) {
      must.push({
        multi_match: {
          query: keyword,
          fields: ["name", "description"],
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

    if (hasDiscount === "true" || hasDiscount === true) {
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
      console.error("Error counting products:", error);
      return 0;
    }
  }
}
