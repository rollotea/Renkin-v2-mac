import { useMemo } from "react";
import useSWR from "swr";
import { fetchPresetFilter } from "../sections/product/api/fetch-preset-filter";
const fetcher = async (id: string) => {
  try {
    const presetFilters = await fetchPresetFilter();
    const res = await window.electron.ipcRenderer.getItemDetail(
      id,
      presetFilters
    );
    return res;
  } catch (error) {
    console.error("Failed to fetch:", error);
    throw error;
  }
};
export function useGetItemDetail(id: string) {
  const { data, isLoading, error, isValidating } = useSWR(id, fetcher);

  const memoizedValue = useMemo(
    () => ({
      product: data,
      productLoading: isLoading,
      productError: error,
      productValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}
