import "@hyeon/react-components-layout/style.css";
import { Box, Divider as _Divider } from "@hyeon/react-components-layout";
import { vars } from "@hyeon/themes";

export default {
  title: "React Components/Layout/Divider",
  component: _Divider,
  decorators: [
    //storybook은 decorators를 지원해줌
    (Story) => (
      //Story 컴포넌트를 받아 사용
      <Box padding={3} style={{ width: "300px", height: "300px" }}>
        <Story />
      </Box>
    ),
  ],
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      options: ["horizontal", "vertical"],
      control: "select",
    },
    variant: {
      options: ["solid", "dashed"],
      control: "select",
    },
    color: {
      options: Object.keys(vars.colors.$scale),
      control: "select",
    },
  },
};

export const Divider = {
  args: {
    color: "gray",
    size: 1,
    variant: "solid",
    orientation: "horizontal",
  },
};
