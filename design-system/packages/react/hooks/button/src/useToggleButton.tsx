import { useToggle } from "@hyeon/react-hooks-toggle";
import { OverloadedToggleButtonFunction } from "./types";
import { useButton } from "./useButton";

export const useToggleButton: OverloadedToggleButtonFunction = (
  props: any,
  //기존의 button props를 받고
  isSelected?: boolean,
): any => {
  const { isSelected: _isSelected, toggle } = useToggle({
    //패키지로 만들었던 Toggle hooks를 import해서 사용
    //토글 상태를 관리할 수 있게끔 isSelected를 가져오는데 코드 중첩이 있어 _를 붙여줌
    isSelected,
    //selected에 초기 값 넣어주고
  });

  const handleClick = (event: React.MouseEvent) => {
    //props에 전달해준 onClick도 실행되도록 하고 toggle도 실행되도록 함
    toggle();
    props?.onClick?.(event);
  };

  const { buttonProps } = useButton({
    ...props,
    onClick: handleClick,
  });

  return {
    buttonProps,
    isSelected: _isSelected,
  };
};