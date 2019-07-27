export const safeFetch = async <TResponse extends any>(
  url: string,
  init?: RequestInit
): Promise<TResponse | Error> => {
  try {
    const response = await fetch(url, init);
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }

    return response.json();
  } catch (err) {
    console.error(err);
    return err;
  }
};

export const safePost = <TResponse extends any>(
  url: string,
  init?: RequestInit,
  data = {}
): Promise<TResponse | Error> => {
  return safeFetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data),
    ...init
  });
};
