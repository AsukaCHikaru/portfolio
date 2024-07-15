import { useEffect, useState } from "react";

export const request = async (pathname: string) => {
  const response = await fetch("http://localhost:3000" + pathname);
  return response.json();
};

type UseApiOption<T> = {
  queryFn: () => Promise<T>;
  enabled?: boolean;
};

export const useApi = <T>({ queryFn, enabled = true }: UseApiOption<T>) => {
  const [data, setData] = useState<T>();

  useEffect(() => {
    if (data !== undefined || !enabled) {
      return;
    }
    queryFn().then((res) => setData(res));
  }, [data, enabled]);

  return data;
};
