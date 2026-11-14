import ButtonBase from '../ButtonBase';
import { parseBoxSize, scaleToBox } from '../ButtonVariants';
import type { ButtonLayout } from '../ButtonVariants';
import type { Button44Props } from './Button44Type';

// # 상수 영역 (Figma _Button - 44pt)
// 높이 44로 최소 터치 크기를 채우므로 추가 터치 영역(hitSlop)은 두지 않는다 (boxSize로 줄이면 ButtonBase가 다시 계산)
const LAYOUT: ButtonLayout = {
  height: 44,
  paddingHorizontal: 8,
  gap: 4,
  iconSize: 24,
  hitSlop: 0,
};

// # main component
// Toolbar 전용 44pt 버튼. 색·눌림은 Button과 같은 ButtonBase를 쓰고, Bordered는 유리 배경(glass)으로 그린다
export default function Button44(props: Button44Props) {
  // boxSize를 주면 아이콘을 기본 크기(44) 대비 비율로 키우거나 줄인다
  const box = parseBoxSize(props.boxSize);
  const layout = box
    ? { ...LAYOUT, iconSize: scaleToBox(LAYOUT.iconSize, box, LAYOUT.height) }
    : LAYOUT;

  return <ButtonBase {...props} layout={layout} glass />;
}
