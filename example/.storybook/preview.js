export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  backgrounds: {
    default: 'light',
    values: [
      {
        name: 'light',
        value: '#F4F5F7',
      },
      {
        name: 'dark',
        value: '#1D1D1D',
      },
    ],
  },
};
