import * as React from "react";
import { BoxProps } from "./types";
import { clsx } from "clsx";
import { BaseStyle, StyleSprinkles } from "../core/style.css";
import { extractSprinkleProps } from "../utils/properties";
import { vars } from "@hyeon/themes";

const Box = (props: BoxProps, ref: React.Ref<HTMLElement>) => {
  //주어진 파라미터 이외에도 스타일 등의 다양한 속성들을 커스터마이징해서 쓸 수 있음
  //특정 컴포넌트의 props만 한정해서 제공하게 된다면 나중에 새로운 것들을
  //contribute하거나 커스터마이징하고 싶을때 제약사항이 많이 생김
  //확장성을 고려해서 순수한 디자인 시스템 컴포넌트들은
  //최대한 기존의 내용들을 활용할 수 있게끔 extend해서 사용하는 것을 추천
  //uncontrol하게 사용하고 싶을수는 있는 ref도 넣어줌
  const { as = "div", color, background, children } = props;

  return React.createElement(
    as,
    {
      ...props,
      ref,
      className: clsx([
        BaseStyle,
        StyleSprinkles(
          extractSprinkleProps(props, Array.from(StyleSprinkles.properties)),
        ),
        props.className,
      ]),
      style: {
        color: color && vars.colors.$scale?.[color]?.[700],
        //기본적으로 700 적용
        background: background && vars.colors.$scale?.[background]?.[100],
        ...props.style,
      },
    },
    children,
  );
};
const _Box = React.forwardRef(Box);
//export 같은 경우에는 기본적으로 forwardRef를 래핑해서 전달해주어야함
export { _Box as Box };
