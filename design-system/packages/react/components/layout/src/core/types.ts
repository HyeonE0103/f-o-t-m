import { vars } from "@hyeon/themes";
import { StyleSprinkles } from "./style.css";

type AsProps = {
  as?: Exclude<keyof JSX.IntrinsicElements, keyof SVGElementTagNameMap>;
  //IntrinsicElements에서 svg관련된것만 제외하고 as에서 받을 수 있게끔 만듬
};

type ElementProps = Omit<React.HTMLAttributes<HTMLElement>, "as">;
//as외에도 확장성을 고려하여 다양한 component?들을 받을 수 있어야 함
//element는 as을 제외한 props를 받을 수 있도록

export type AsElementProps = AsProps & ElementProps;
//이를 통틀어서 AsElementProps

export type ColorProps = {
  color?: keyof typeof vars.colors.$scale;
  background?: keyof typeof vars.colors.$scale;
};

export type StyleProps = Parameters<typeof StyleSprinkles>[0] & ColorProps;
