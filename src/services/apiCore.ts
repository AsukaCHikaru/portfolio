import { useEffect, useState } from "react";

export const request = async (pathname: string) => {
  const response = await fetch("http://localhost:3000" + pathname);
  return response.json();
};

export const useApi = <T>(api: () => Promise<T>) => {
  const [data, setData] = useState<T>();

  useEffect(() => {
    if (data !== undefined) {
      return;
    }
    api().then((res) => setData(res));
  }, [data]);

  return data;
};
