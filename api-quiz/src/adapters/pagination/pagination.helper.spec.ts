import {Test, TestingModule} from '@nestjs/testing';
import {
  createPagination,
  PaginationHeaderHelper,
  setPaginationResponseHeader,
} from './pagination.helper';

describe('PaginationHeaderHelper', () => {
  let paginationHelper: PaginationHeaderHelper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaginationHeaderHelper],
    }).compile();

    paginationHelper = module.get<PaginationHeaderHelper>(PaginationHeaderHelper);
  });

  it('should be defined', () => {
    expect(paginationHelper).toBeDefined();
  });

  describe('#getHeaders', () => {
    it('#getHeaders should handle', () => {
      const result = paginationHelper.getHeaders(
        {
          page: 1,
          perPage: 15,
        },
        100,
      );

      expect(result).toEqual({
        'x-next-page': 2,
        'x-page': 1,
        'x-pages-count': 7,
        'x-per-page': 15,
        'x-total-count': 100,
      });
    });

    it('#getHeaders should handle with page === pagesCount', () => {
      const result = paginationHelper.getHeaders(
        {
          page: 7,
          perPage: 15,
        },
        100,
      );

      expect(result).toEqual({
        'x-next-page': 7,
        'x-page': 7,
        'x-pages-count': 7,
        'x-per-page': 15,
        'x-total-count': 100,
      });
    });

    it('#getHeaders should handle without pagination', () => {
      const result = paginationHelper.getHeaders(null, 100);

      expect(result).toBeUndefined();
    });
  });
});

describe('#createPagination', () => {
  it('#createPagination should handle', () => {
    expect(createPagination(1, 15)).toEqual({
      endIndex: 15,
      page: 1,
      perPage: 15,
      startIndex: 0,
    });
  });

  it('should be handle setPaginationResponseHeader', () => {
    const res: any = {append: jest.fn(), json: jest.fn((data) => data)};
    setPaginationResponseHeader(res, {
      headers: {
        'x-next-page': 2,
        'x-page': 1,
        'x-pages-count': 0,
        'x-per-page': 20,
        'x-total-count': 0,
      },
    });

    expect(res.append).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalled();
  });
});
