module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials' /* 'storybook-addon-relay' */],
  babel: async (options) => {
    return {
      ...options,
      plugins: [...options.plugins, 'relay'],
    };
  },
  reactOptions: {
    fastRefresh: true,
    strictMode: true,
  },
};
