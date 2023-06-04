const config = {
  stories: [
    "../components/atoms/**/*.stories.@(js|jsx|ts|tsx)",
    "../components/molecules/**/*.stories.@(js|jsx|ts|tsx)",
    "../components/organisms/**/*.stories.@(js|jsx|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "storybook-addon-next",
  ],
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
};
export default config;
