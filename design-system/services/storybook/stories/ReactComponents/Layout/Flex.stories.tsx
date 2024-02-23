import "@hyeon/react-components-layout/style.css";
import { Flex as _Flex } from "@hyeon/react-components-layout";
import React from "react";

export default {
  title: "React Components/Layout/Flex",
  component: _Flex,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export const FlexStory = {
  args: {
    as: "div",
    padding: "5",
    background: "pink",
    boxShadow: "xl",
    borderRadius: "md",
    justify: "space-between",
    style: {
      width: "300px",
    },
  },
  //기본적으로 args외에 render함수를 제공해줌
  render: (args) => (
    <_Flex {...args}>
      <div>테스트</div>
      <div>입니다</div>
    </_Flex>
  ),
};
