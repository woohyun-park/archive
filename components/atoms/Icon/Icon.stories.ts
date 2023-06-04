import type { Meta, StoryObj } from "@storybook/react";

import Icon from "./Icon";

const meta: Meta<typeof Icon> = {
  title: "Icon",
  component: Icon,
};

export default meta;
type Story = StoryObj<typeof Icon>;

export const Alarm: Story = {
  args: {
    icon: "alarm",
  },
};
export const Back: Story = {
  args: {
    icon: "back",
  },
};

export const Comment: Story = {
  args: {
    icon: "comment",
  },
};

export const Delete: Story = {
  args: {
    icon: "delete",
  },
};

export const Filter: Story = {
  args: {
    icon: "filter",
  },
};

export const Like: Story = {
  args: {
    icon: "like",
  },
};

export const Modify: Story = {
  args: {
    icon: "modify",
  },
};

export const Refresh: Story = {
  args: {
    icon: "refresh",
  },
};

export const Scrap: Story = {
  args: {
    icon: "scrap",
  },
};

export const Search: Story = {
  args: {
    icon: "search",
  },
};

export const Setting: Story = {
  args: {
    icon: "setting",
  },
};

export const X: Story = {
  args: {
    icon: "x",
  },
};
