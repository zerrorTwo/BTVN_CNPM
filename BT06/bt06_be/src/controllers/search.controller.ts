import { JsonController, Get, QueryParam, Post } from 'routing-controllers';
import { SearchService } from '../services/search.service';

@JsonController('/search')
export class SearchController {
  private searchService = new SearchService();

  @Get('/')
  async search(
    @QueryParam('keyword') keyword: string,
    @QueryParam('categoryId') categoryId: number,
    @QueryParam('minPrice') minPrice: number,
    @QueryParam('maxPrice') maxPrice: number,
    @QueryParam('minViews') minViews: number,
    @QueryParam('hasDiscount') hasDiscount: boolean,
    @QueryParam('sort') sort: string
  ) {
    const results = await this.searchService.search({
      keyword,
      categoryId,
      minPrice,
      maxPrice,
      minViews,
      hasDiscount,
      sort,
    });
    return {
      success: true,
      data: results,
    };
  }

  @Post('/sync')
  async sync() {
    await this.searchService.syncProducts();
    return { success: true, message: 'Synced successfully' };
  }
}
