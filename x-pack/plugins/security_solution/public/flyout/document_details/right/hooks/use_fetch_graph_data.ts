/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  GraphRequest,
  GraphResponse,
} from '@kbn/cloud-security-posture-common/types/graph/latest';
import { EVENT_GRAPH_VISUALIZATION_API } from '../../../../../common/constants';
import { useHttp } from '../../../../common/lib/kibana';

/**
 * Interface for the input parameters of the useFetchGraphData hook.
 */
export interface UseFetchGraphDataParams {
  /**
   * The request object containing the query parameters for the graph data.
   */
  req: GraphRequest;
  /**
   * Optional configuration options for the query.
   */
  options?: {
    /**
     * If false, the query will not automatically run.
     * Defaults to true.
     */
    enabled?: boolean;
    /**
     * If true, the query will refetch on window focus.
     * Defaults to true.
     */
    refetchOnWindowFocus?: boolean;
    /**
     * If true, the query will keep previous data till new data received.
     * Defaults to false.
     */
    keepPreviousData?: boolean;
  };
}

/**
 * Interface for the result of the useFetchGraphData hook.
 */
export interface UseFetchGraphDataResult {
  /**
   * Indicates if the query is currently loading.
   */
  isLoading: boolean;
  /**
   * Indicates if the query is currently fetching.
   */
  isFetching: boolean;
  /**
   * Indicates if there was an error during the query.
   */
  isError: boolean;
  /**
   * The data returned from the query.
   */
  data?: GraphResponse;
  /**
   * Function to manually refresh the query.
   */
  refresh: () => void;
}

/**
 * Hook to fetch event's graph visualization data.
 *
 * @param params - The input parameters for the hook.
 * @returns The result of the hook.
 */
export const useFetchGraphData = ({
  req,
  options,
}: UseFetchGraphDataParams): UseFetchGraphDataResult => {
  const queryClient = useQueryClient();
  const { esQuery, eventIds, start, end } = req.query;
  const http = useHttp();
  const QUERY_KEY = ['useFetchGraphData', eventIds, start, end, esQuery];

  const { isLoading, isError, data, isFetching } = useQuery<GraphResponse>(
    QUERY_KEY,
    () => {
      return http.post<GraphResponse>(EVENT_GRAPH_VISUALIZATION_API, {
        version: '1',
        body: JSON.stringify(req),
      });
    },
    {
      enabled: options?.enabled ?? true,
      refetchOnWindowFocus: options?.refetchOnWindowFocus ?? true,
      keepPreviousData: options?.keepPreviousData ?? false,
    }
  );

  return {
    isLoading,
    isFetching,
    isError,
    data,
    refresh: () => {
      queryClient.invalidateQueries(QUERY_KEY);
    },
  };
};
