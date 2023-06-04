import { ChangeEvent, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import Input from "./Input";
import { action } from "@storybook/addon-actions";
import { withKnobs } from "@storybook/addon-knobs";

const meta: Meta<typeof Input> = {
  title: "atoms/Input",
  component: Input,
  decorators: [withKnobs],
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  render: () => <MockInput />,
  args: {},
};

const MockInput = () => {
  const [value, setValue] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    action("onChange")(e.target.value);
  };

  return <Input value={value} onChange={handleChange} />;
};
