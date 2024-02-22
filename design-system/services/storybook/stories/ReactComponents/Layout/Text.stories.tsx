import "@hyeon/react-components-layout/style.css";
import { Text as _Text } from "@hyeon/react-components-layout";
import { classes, vars } from "@hyeon/themes";

export default {
  title: "React Components/Layout/Text",
  component: _Text,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    //스토리북에서 타이핑하는 것은 번거로울 수 있으므로
    //해당 종류들을 select로 보여 선택할 수 있도록 설정
    fontSize: {
      options: Object.keys(classes.typography.text),
      control: "select",
    },
    color: {
      options: Object.keys(vars.colors.$scale),
      control: "select",
    },
  },
};

export const BoxStory = {
  args: {
    as: "p",
    fontSize: "sm",
    children: "Hello, Wrold!",
  },
};
