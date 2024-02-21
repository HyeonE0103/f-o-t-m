import * as theme from "../dist/index.js";
import fs from "fs";

const toCssCasting = (str) => {
  return str
    .replace(/([a-z])(\d)/, "$1-$2")
    .replace(/([A-Z])/g, "-$1")
    .toLowerCase();
  //카멜 케이스로 되어있는 경우에는 정규표현식을 이용해서 원하는 규격으로 변경
  //blackAlpha의 경우에는 -> black-alpha
};

// theme.css
// :root {
//   --gray-900: #171923
// }
const generateThemeCssVariables = () => {
  const cssString = [];

  Object.entries(theme.vars).forEach(([key, value]) => {
    if (key === "colors") {
      //컬러는 light와 dark모드가 나뉘어 depth가 달라서 조건에 따라 나눔
      Object.entries(value.$static).forEach(([colorKey, colorValue]) => {
        if (colorKey === "light") {
          const selector = ":root";

          const cssVariables = Object.entries(colorValue)
            //각각의 변수를 루프를 돌림(gray, whiteAlpha, ...)
            .map(
              ([mainKey, mainValue]) =>
                Object.entries(mainValue)
                  .map(
                    ([subKey, subValue]) =>
                      `--${toCssCasting(mainKey)}-${toCssCasting(
                        subKey
                      )}: ${subValue};`
                  )
                  .join("\n") //array(X)를 위해 join해서 줄바꿈
            )
            .join("\n"); //array(X)를 위해 join해서 줄바꿈

          return cssString.push(`${selector} {\n${cssVariables}\n}`);
        }

        if (colorKey === "dark") {
          const selector = ":root .theme-dark";

          const cssVariables = Object.entries(colorValue)
            .map(([mainKey, mainValue]) =>
              Object.entries(mainValue)
                .map(
                  ([subKey, subValue]) =>
                    `--${toCssCasting(mainKey)}-${toCssCasting(
                      subKey
                    )}: ${subValue};`
                )
                .join("\n")
            )
            .join("\n");

          return cssString.push(`${selector} {\n${cssVariables}\n}`);
        }
      });

      return;
    }

    const selector = ":root";

    const cssVariables = Object.entries(value)
      .map(([mainKey, mainValue]) =>
        Object.entries(mainValue)
          .map(
            ([subKey, subValue]) =>
              `--${toCssCasting(mainKey)}-${toCssCasting(subKey)}: ${subValue};`
          )
          .join("\n")
      )
      .join("\n");

    return cssString.push(`${selector} {\n${cssVariables}\n}`);
  });
  return cssString;
};

// .headingxl {
//   font-size: 3rem;
//   font-weight: 700;
//   line-height: 100%;
// }
const generateThemeCssClasses = () => {
  const cssString = [];

  Object.entries(theme.classes).forEach(([, value]) => {
    //이번에는 variable이 아닌 theme에 classes에 접근해서 루프돌기
    const cssClasses = Object.entries(value)
      .map(([mainKey, mainValue]) =>
        Object.entries(mainValue)
          .map(([subKey, subValue]) => {
            const className = `.${toCssCasting(mainKey)}${toCssCasting(
              subKey
            )}`;

            const styleProperties = Object.entries(subValue)
              .map(
                ([styleKey, styleValue]) =>
                  `${toCssCasting(styleKey)}: ${styleValue};`
              )
              .join("\n");  //줄바꿈 조인

            return `${className} {\n${styleProperties}\n}`;
          })
          .join("\n") //줄바꿈 조인
      )
      .join("\n");

    cssString.push(cssClasses);
  });

  return cssString;
};

const generateThemeCss = () => {
  const variables = generateThemeCssVariables();
  const classes = generateThemeCssClasses();

  fs.writeFileSync("dist/themes.css", [...variables, ...classes].join("\n"));
  //dist폴더안에 themes.css파일 만들고 안에 내용은 variables
  //내용은 array가 아닌 stream으로 넘겨야 하기에 join사용하고 엔터처리
};

generateThemeCss();
