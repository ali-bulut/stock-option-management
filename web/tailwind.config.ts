import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "antd-blue": "rgb(10, 132, 255)",
        "antd-primary-background": "rgb(31,31,31)",
        "antd-secondary-background": "#141414",
        "light-accent": "#f2f2f2",
        "dark-accent": "#3f3d56",
        // Mac OS Dark Mode Colors
        "macos-dark-blue": "rgb(10, 132, 255)",
        "macos-dark-brown": "rgb(172, 142, 104)",
        "macos-dark-cyan": "rgb(90, 200, 245)",
        "macos-dark-gray": "rgb(152, 152, 157)",
        "macos-dark-green": "rgb(50, 215, 75)",
        "macos-dark-indigo": "rgb(94, 92, 230)",
        "macos-dark-mint": "rgb(102, 212, 207)",
        "macos-dark-orange": "rgb(255, 159, 10)",
        "macos-dark-pink": "rgb(255, 55, 95)",
        "macos-dark-purple": "rgb(191, 90, 242)",
        "macos-dark-red": "rgb(255, 69, 58)",
        "macos-dark-teal": "rgb(106, 196, 220)",
        "macos-dark-yellow": "rgb(255, 214, 10)",
      },
    },
  },
  plugins: [],
};
export default config;
