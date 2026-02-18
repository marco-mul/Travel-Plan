// had to update the config file because not all classes were being applied,
// this is a known issue with tailwind and postcss 8, see https://github.com/tailwindlabs/tailwindcss/discussions/5863

const config = {
  plugins: ["@tailwindcss/postcss"],
};

export default config;
