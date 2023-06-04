import type { Meta, StoryObj } from "@storybook/react";

import Comment from "./Comment";
import { DEFAULT } from "apis/def";

const meta: Meta<typeof Comment> = {
  title: "molecules/Comment",
  component: Comment,
};

export default meta;

type Story = StoryObj<typeof Comment>;

export const Default: Story = {
  args: { comment: DEFAULT.comment, user: { ...DEFAULT.user, id: "0" }, curUser: DEFAULT.user },
};

export const Author: Story = {
  args: { comment: DEFAULT.comment, user: DEFAULT.user, curUser: DEFAULT.user },
};
