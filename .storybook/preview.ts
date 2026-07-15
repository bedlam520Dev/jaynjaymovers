import type { Preview } from "@storybook/react";

const preview: Preview = {
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    layout: "centered",
    backgrounds: {
      default: "light",
      values: [
        { name: "light", value: "hsl(210 40% 98%)" },
        { name: "dark", value: "hsl(222 47% 7%)" },
      ],
    },
  },
};

export default preview;
