import type { Meta, StoryObj } from "@storybook/react";

import InputBar from "./InputBar";
import { useState } from "react";

const meta: Meta<typeof InputBar> = {
  title: "molecules/InputBar",
  component: InputBar,
};

export default meta;

// TODO: 리액트 훅을 사용해야 하는 경우에 어떻게 story에 control을 설정하는지
// This story is not configured to handle controls
type Story = StoryObj<typeof InputBar>;

const MockDefault = () => {
  const [value, setValue] = useState("");
  const [isActive, setIsActive] = useState(false);

  return (
    <InputBar
      icon="none"
      keyword={value}
      setKeyword={setValue}
      isActive={isActive}
      setIsActive={setIsActive}
    />
  );
};

const MockIcon = () => {
  const [value, setValue] = useState("");
  const [isActive, setIsActive] = useState(false);

  return (
    <InputBar
      icon="search"
      keyword={value}
      setKeyword={setValue}
      isActive={isActive}
      setIsActive={setIsActive}
    />
  );
};

export const Default: Story = {
  render: () => <MockDefault />,
  args: {},
};

export const Icon: Story = {
  render: () => <MockIcon />,
  args: {},
};
