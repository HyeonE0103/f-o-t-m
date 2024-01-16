import { RefObject, useEffect, useState } from "react";

export default function useIntersectionObserver(
  elementRef: RefObject<Element>, //옵저버를 할 ref
  { threshold = 0.1, root = null, rootMargin = "0%" }
) {
  //옵션- 임계값, 루트값, 루트 마진
  const [entry, setEntry] = useState<IntersectionObserverEntry>();
  //인터세션옵저버에 결과값 저장
  const updateEntry = ([entry]: IntersectionObserverEntry[]): void => {
    setEntry(entry);
  };

  useEffect(() => {
    //페이지가 마운트 되었을때 로직 실행
    const node = elementRef?.current; //관찰할 값
    const hasIOSupport = !!window.IntersectionObserver; //브라우저가 옵저버를 지원하는지 확인

    if (!node || !hasIOSupport) return;

    const observerParams = { threshold, root, rootMargin }; //옵션 정의
    const observer = new IntersectionObserver(updateEntry, observerParams);
    //IntersectionObserver(callback함수, 옵션)

    observer.observe(node); //관찰실행

    return () => observer.disconnect(); //클린업함수를 사용해 언마운트 됬을시 관찰 끝

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elementRef?.current, root, rootMargin, JSON.stringify(threshold)]);
  return entry;
}
