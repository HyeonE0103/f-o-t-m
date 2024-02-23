import { BaseButtonProps, OverloadedButtonFunction } from "./types";

export const useButton: OverloadedButtonFunction = (
  props: any,
): any => {
  //원하는 값들을 지정해주고 실제 사용하는 곳에서 제너릭에 맞게끔 마쳐지게 됨
  const {
    elementType = "button",
    isDisabled,
    isLoading,
    tabIndex,
    onKeyDown,
    type = "button",
  } = props;

  const disabled = isDisabled || isLoading;

    const handleKeyDown = (event: React.KeyboardEvent) => {
      onKeyDown?.(event);

      if (event.key === " " || event.key === "Spacebar" || event.key === "32") {
        if (disabled) return;
        if (event.defaultPrevented) return;
        if (elementType === "button") return;

        event.preventDefault();
        (event.currentTarget as HTMLElement).click();
        //HTMLElement로 타입 강제

        return;
      };

      if (event.key === "Enter" || event.key === "13") {
        if (disabled) return;
        if (event.defaultPrevented) return;
        if (elementType === 'input' && type !== "button") return; 

        event.preventDefault();
        (event.currentTarget as HTMLElement).click();

        return;
      }
    };


    const baseProps = {
      ...props,
      "data-loading": isLoading,
      tabIndex: disabled ? undefined : tabIndex ?? 0,
      //tabIndex를 넣어야 키보드 셀렉트가 됨
      onKeyDown: handleKeyDown,
    };


  let additionalProps = {};

  //additionalProps을 let으로 만들어 각 type에 맞게 additionalProps 객체에 값 추가
  switch (elementType) {
    case "button": {
      additionalProps = {
        type: type ?? "button",
        disabled,
      };
      break;
    }
    case "a": {
      const { href, target, rel } = props as BaseButtonProps<"a">;

      additionalProps = {
        //disabled일 경우 동작이 되지 않게끔, 접근성을 위해 area-disabled에 disable 추가
        role: "button",
        href: disabled ? undefined : href,
        target: disabled ? undefined : target,
        rel: disabled ? undefined : rel,
        "area-disabled": isDisabled,
      };
      break;
    }
    case "input": {
      //input같은 경우에는 disable이 필요 없기 때문에 제외
      additionalProps = {
        role: "button",
        type: props.type,
        disabled,
        "area-disabled": undefined,
      };
      break;
    }
    default: {
      additionalProps = {
        role: "button",
        type: type ?? "button",
        "area-disabled": isDisabled,
      };
      break;
    }
  }

  const buttonProps = {
    ...baseProps,
    ...additionalProps,
  }

  return {
    buttonProps,
  }
}