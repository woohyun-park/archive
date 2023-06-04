import type { Meta, StoryObj } from "@storybook/react";

import { DEFAULT } from "apis/def";
import ProfileImage from "./ProfileImage";

const meta: Meta<typeof ProfileImage> = {
  title: "atoms/ProfileImage",
  component: ProfileImage,
};

export default meta;
type Story = StoryObj<typeof ProfileImage>;

// TODO: forwardRef로 인한 에러 수정
// TypeError: The provided value is not of type 'Element'

export const Default: Story = {
  args: {
    photoURL: DEFAULT.user.photoURL,
  },
};

export const Large: Story = {
  args: {
    size: "lg",
    photoURL: DEFAULT.user.photoURL,
  },
};
