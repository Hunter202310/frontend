import _omit from 'lodash/omit';
import _pickBy from 'lodash/pickBy';
import React from 'react';

import config from 'configs/app';
import type { Params as FetchParams } from 'lib/hooks/useFetch';
import useFetch from 'lib/hooks/useFetch';

import buildWalletUrl from './buildWalletUrl';
import { RESOURCES } from './resources';
import type { ApiResource, ResourceName, ResourcePathParams } from './resources';

export interface Params<R extends ResourceName> {
  pathParams?: ResourcePathParams<R>;
  queryParams?: Record<string, string | Array<string> | number | boolean | undefined>;
  fetchParams?: Pick<FetchParams, 'body' | 'method' | 'signal' | 'headers'>;
}

export default function useWalletApiFetch() {
  const fetch = useFetch();
  return React.useCallback(<R extends ResourceName, SuccessType = unknown, ErrorType = unknown>(
    resourceName: R,
    { pathParams, queryParams, fetchParams }: Params<R> = {},
  ) => {

    const resource: ApiResource = RESOURCES[resourceName];
    const url = buildWalletUrl(resourceName, pathParams, queryParams);
    const headers = _pickBy({
      ...resource.headers,
      ...fetchParams?.headers,
    }, Boolean) as HeadersInit;

    return fetch<SuccessType, ErrorType>(
      url,
      {
        // as of today, we use cookies only
        //    for user authentication in My account
        //    for API rate-limits (cannot use in the condition though, but we agreed with devops team that should not be an issue)
        // change condition here if something is changed
        credentials: config.features.account.isEnabled ? 'include' : 'same-origin',
        headers,
        ..._omit(fetchParams, 'headers'),
      },
      {
        resource: resource.path,
        omitSentryErrorLog: true, // disable logging of API errors to Sentry
      },
    );
  }, [ fetch ]);
}
