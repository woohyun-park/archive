import type { Meta, StoryObj } from "@storybook/react";

import { DEFAULT } from "apis/def";
import PostImage from "./PostImage";

const meta: Meta<typeof PostImage> = {
  title: "molecules/PostImage",
  component: PostImage,
};

export default meta;

type Story = StoryObj<typeof PostImage>;

export const ImageBase: Story = {
  render: () => <MockImageBase />,
};
export const ImageSmall: Story = {
  render: () => <MockImageSmall />,
};
export const ColorBase: Story = {
  render: () => <MockColorBase />,
};
export const ColorSmall: Story = {
  render: () => <MockColorSmall />,
};

const MockColorBase = () => {
  return <PostImage size="base" post={{ ...DEFAULT.post, imgs: [] }} />;
};

const MockImageSmall = () => {
  return (
    <PostImage size="sm" post={DEFAULT.post}>
      <PostImage.Title />
    </PostImage>
  );
};
const MockImageBase = () => {
  return <PostImage size="base" post={DEFAULT.post} />;
};

const MockColorSmall = () => {
  return (
    <PostImage size="sm" post={{ ...DEFAULT.post, imgs: [] }}>
      <PostImage.Title />
    </PostImage>
  );
};
