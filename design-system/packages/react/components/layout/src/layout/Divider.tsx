import * as React from "react";
import { DividerProps } from "./types";
import { vars } from "@hyeon/themes";

const Divider = (props: DividerProps, ref: React.Ref<HTMLHRElement>) => {
  const {
    color = "gray",
    variant = "solid",
    size = 1,
    orientation = "horizontal",
  } = props;

  const borderStyle =
    orientation === "horizontal"
      ? {
          width: "100%",
          borderWidth: `0 0 ${size}px 0`,
        }
      : {
          height: "100%",
          borderWidth: `0 0 0 ${size}px`,
        };

  return (
    <hr
      {...props}  //외부에서 스타일을 받을 수 있으니 props로 넘겨줌
      ref={ref}
      style={{
        borderStyle: variant,
        borderColor: color && vars.colors.$scale?.[color]?.[200],
        ...borderStyle,
        ...props.style,
      }}
    />
  );
}; 

const _Divider = React.forwardRef(Divider);
export { _Divider as Divider };