import { languageState } from "atom";
import TRANSLATIONS from "constants/language";
import { useRecoilValue } from "recoil";

const useTranslation = () => {
  const lang = useRecoilValue(languageState);
  //recoil 값만 가져오기

  //key를 통해서 리턴해주는데 TRANSLATIONS으로부터 가져옴, typeof안하면 오류
  return (key: keyof typeof TRANSLATIONS) => {
    return TRANSLATIONS[key][lang];
    //key는 이름 ex)MENU_HOME, lang은 안에 언어 ex)ko
  };
};

export default useTranslation;
