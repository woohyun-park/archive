import type { Meta, StoryObj } from "@storybook/react";

import Textarea from "./Textarea";

const meta: Meta<typeof Textarea> = {
  title: "atoms/Textarea",
  component: Textarea,
};

export default meta;
type Story = StoryObj<typeof Textarea>;

// TODO: forwardRef로 인한 에러 수정
// TypeError: The provided value is not of type 'Element'

export const Default: Story = {
  args: {},
};
