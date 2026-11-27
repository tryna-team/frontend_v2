import { useLayoutEffect, useRef, type RefObject } from 'react';
import { Platform, type FlatList } from 'react-native';

// # Main hook
// 목록 앞에 항목을 붙여도 보던 화면이 제자리에 있게 한다 (웹 전용).
// iOS·Android는 FlatList의 maintainVisibleContentPosition이 맞추지만 react-native-web에는 그 기능이 없어,
// 앞에 붙은 항목의 높이만큼 직접 내린다. 그리기 전에 맞춰야 화면이 튀지 않아 useLayoutEffect를 쓴다
export function useKeepPositionOnPrepend<ItemT>(
  listRef: RefObject<FlatList<ItemT> | null>,
  items: ItemT[],
  getKey: (item: ItemT) => string,
  getOffset: (index: number) => number, // 그 위치 항목의 맨 위. getItemLayout의 offset과 같은 값
) {
  const firstKeyRef = useRef(getKey(items[0]));

  useLayoutEffect(() => {
    const previousFirstKey = firstKeyRef.current;
    firstKeyRef.current = getKey(items[0]);

    if (Platform.OS !== 'web' || previousFirstKey === firstKeyRef.current) return;

    // 예전 첫 항목의 지금 위치 = 앞에 붙은 항목 수
    const addedCount = items.findIndex((item) => getKey(item) === previousFirstKey);
    const scrollNode = listRef.current?.getScrollableNode();

    if (addedCount > 0 && scrollNode) {
      scrollNode.scrollTop += getOffset(addedCount);
    }
  }, [items, listRef, getKey, getOffset]);
}
