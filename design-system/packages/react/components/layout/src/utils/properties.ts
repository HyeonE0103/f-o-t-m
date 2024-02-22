export const extractSprinkleProps = <T extends Object>(
  props: T, //props에는 기존에 props를 전달
  keys: (keyof T)[],
) => {
  const result: any = {};

  keys.forEach((key) => {
    //해당 하는 키들을 뽑아 vanilla Sprinkle StyleSprinkles에 해당하는 props만 추출
    if (props?.[key]) {
      result[key] = props[key];
    }
  });

  return result;
};
