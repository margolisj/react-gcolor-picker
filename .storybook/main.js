module.exports = {
  "stories": [
    "../stories/docs/*.stories.mdx",
    "../stories/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": ["@storybook/addon-links", "@storybook/addon-essentials", "@storybook/preset-scss", "@storybook/addon-mdx-gfm"],
  framework: {
    name: "@storybook/react-webpack5",
    options: {}
  },
  docs: {
    autodocs: true
  }
};