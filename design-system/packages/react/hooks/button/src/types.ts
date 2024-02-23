import { ComponentProps, HTMLAttributes } from "react";


export type ButtonElementType = "button" | "a" | "div" | "span" | "input";
//각 다른 타입을 호환하기 위해서 오버라이드 function을 만들어주어야 함

export type BaseButtonProps<T extends ButtonElementType = "button"> = {
  //버튼에 필요한 속성들
  elementType?: T;
  role?: string;
  type?: "button" | "submit" | "reset";
  isDisabled?: boolean;
  isLoading?: boolean;
  tabIndex?: number;
} & ComponentProps<T>;

export type UseButtonReturn<T> = {
  //제너릭을 이용해서 기본틀을 만들고
  buttonProps: HTMLAttributes<T> & {
    role?: string;
    type?: "button" | "submit" | "reset";
    tabIndex?: number;
    disabled?: boolean;
    "data-loading": boolean;
  };
};

export type OverloadedButtonFunction = {
  //각 제너릭 위치에 알맞는 속성들을 넣도록 함(button이 들어오면 ButtonElement가 리턴됨)
  (props: BaseButtonProps<"button">): UseButtonReturn<HTMLButtonElement>;
  (props: BaseButtonProps<"a">): UseButtonReturn<HTMLAnchorElement>;
  (props: BaseButtonProps<"div">): UseButtonReturn<HTMLDivElement>;
  (props: BaseButtonProps<"input">): UseButtonReturn<HTMLInputElement>;
  (props: BaseButtonProps<"span">): UseButtonReturn<HTMLSpanElement>;
}

export type UseToggleButtonReturn<T> = UseButtonReturn<T> & {
  isSelected: boolean;
}

export type OverloadedToggleButtonFunction = {
  (props: BaseButtonProps<"button">, isSelected?: boolean): UseToggleButtonReturn<HTMLButtonElement>;
  (props: BaseButtonProps<"a">, isSelected?: boolean): UseToggleButtonReturn<HTMLAnchorElement>;
  (props: BaseButtonProps<"div">, isSelected?: boolean): UseToggleButtonReturn<HTMLDivElement>;
  (props: BaseButtonProps<"input">, isSelected?: boolean): UseToggleButtonReturn<HTMLInputElement>;
  (props: BaseButtonProps<"span">, isSelected?: boolean): UseToggleButtonReturn<HTMLSpanElement>;
};