import { useRouter } from 'next/router';
import React from 'react';

import useApiQuery, { useWalletApiQuery } from 'lib/api/useApiQuery';
import useDebounce from 'lib/hooks/useDebounce';

import { getSearchItem, isEnable, isFormatHash, isXvmHash } from './formatUtils';

export default function useQuickSearchQuery() {
  const router = useRouter();

  const [ searchTerm, setSearchTerm ] = React.useState('');

  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const pathname = router.pathname;
  // const searchInfo = useApiQuery("", {})
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
  const query = useApiQuery('quick_search', {
    queryParams: {
      q: getSearchItem(queryMapping?.data, queryAddress.data),
    },
    queryOptions: {
      enabled: isEnable(queryMapping?.data, queryAddress?.data),
    },
  });

  const redirectCheckQuery = useApiQuery('search_check_redirect', {
    // on pages with regular search bar we check redirect on every search term change
    // in order to prepend its result to suggest list since this resource is much faster than regular search
    queryParams: {
      q: getSearchItem(queryMapping?.data, queryAddress.data),
    },
    queryOptions: {
      enabled: isEnable(queryMapping?.data, queryAddress?.data),
    },
  });

  return React.useMemo(
    () => ({
      searchTerm,
      debouncedSearchTerm,
      handleSearchTermChange: setSearchTerm,
      query,
      queryMapping,
      redirectCheckQuery,
      pathname,
      queryAddress,
    }),
    [ debouncedSearchTerm, pathname, query, queryAddress, queryMapping, redirectCheckQuery, searchTerm ],
  );
}
