import { useRef, useState, useEffect, RefObject } from "react";

interface IRefHeightHook<TElement extends Element> {
  ref: RefObject<TElement>;
  height: number;
}

export const useRefHeight = <TElement extends Element>(): IRefHeightHook<
  TElement
> => {
  const ref = useRef<TElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const resize = () => setHeight(ref.current ? ref.current.clientHeight : 0);
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  if (!height && ref.current) {
    setHeight(ref.current.clientHeight);
  }

  return {
    ref,
    height
  };
};
