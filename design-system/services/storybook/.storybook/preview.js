import "@hyeon/themes/themes.css";
import "./style.css";

/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    rootAttributesTooltip: true, //Tooltip을 보여준다
    rootAttributes: [
      {
        root: "body",
        attribute: "class",
        defaultState: {
          name: "light", //body에 class에 light가 있을때에는 theme-light를
          value: "theme-light",
        },
        states: [
          {
            name: "dark", //body에 class에 light가 있을때에는 theme-dark를 설정
            value: "theme-dark",
          },
        ],
      },
    ],
  },
};

const initTheme = () => {
  const isDarkTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (isDarkTheme) {
    document.body.classList.add("theme-dark");
  }

  const mediaQueryList = window.matchMedia("(prefers-color-scheme: dark)");

  mediaQueryList.addEventListener("change", (e) => {
    if (e.matches) {
      document.body.classList.add("theme-dark");
    } else {
      document.body.classList.remove("theme-dark");
    }
  });
};

initTheme();

export default preview;
