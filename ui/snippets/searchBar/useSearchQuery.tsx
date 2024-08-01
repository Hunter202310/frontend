import { useRouter } from 'next/router';
import React from 'react';

import useApiQuery, { useWalletApiQuery } from 'lib/api/useApiQuery';
import useDebounce from 'lib/hooks/useDebounce';
import useUpdateValueEffect from 'lib/hooks/useUpdateValueEffect';
import getQueryParamString from 'lib/router/getQueryParamString';
import {
  SEARCH_RESULT_ITEM,
  SEARCH_RESULT_NEXT_PAGE_PARAMS,
} from 'stubs/search';
import { generateListStub } from 'stubs/utils';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';

import { getSearchItem, isEnable, isFormatHash, isXvmHash } from './formatUtils';

export default function useSearchQuery() {
  const router = useRouter();
  const q = React.useRef(getQueryParamString(router.query.q));
  const initialValue = q.current;

  const [ searchTerm, setSearchTerm ] = React.useState(initialValue);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const pathname = router.pathname;

  const queryMapping = useWalletApiQuery('hash_mapping', {
    pathParams: { hash: isFormatHash(debouncedSearchTerm) },
    queryOptions: {
      enabled: Boolean(isXvmHash(debouncedSearchTerm)),
    },
  });

  const queryAddress = useWalletApiQuery('address_mapping', {
    pathParams: { address: debouncedSearchTerm },
    queryOptions: {
      enabled: Boolean(debouncedSearchTerm),
    },
  });
  const query = useQueryWithPages({
    resourceName: 'search',
    filters: {
      q: getSearchItem(queryMapping.data, queryAddress.data) ?? '',
    },
    options: {
      enabled: isEnable(queryMapping.data, queryAddress.data),
      placeholderData: generateListStub<'search'>(SEARCH_RESULT_ITEM, 50, {
        next_page_params: SEARCH_RESULT_NEXT_PAGE_PARAMS,
      }),
    },
  });

  const redirectCheckQuery = useApiQuery('search_check_redirect', {
    // on search result page we check redirect only once on mount
    queryParams: {
      q: getSearchItem(queryMapping.data, queryAddress.data) ?? '',
    },
    queryOptions: {
      enabled: isEnable(queryMapping.data, queryAddress.data),
    },
  });

  useUpdateValueEffect(() => {
    query.onFilterChange({
      q: getSearchItem(queryMapping.data, queryAddress.data) ?? '',
    });
  }, getSearchItem(queryMapping.data, queryAddress.data) ?? '');

  return React.useMemo(
    () => ({
      searchTerm,
      debouncedSearchTerm,
      handleSearchTermChange: setSearchTerm,
      query,
      redirectCheckQuery,
      pathname,
      queryAddress,
      queryMapping,
    }),
    [ debouncedSearchTerm, pathname, query, queryAddress, queryMapping, redirectCheckQuery, searchTerm ],
  );
}
