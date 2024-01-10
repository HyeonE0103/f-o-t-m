import AuthContext from "context/AuthContext";
import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { db, storage } from "firebaseApp";
import useTranslation from "hooks/useTranslation";
import { useContext, useState } from "react";
import { FiImage } from "react-icons/fi";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

const PostForm = () => {
  const [content, setContent] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]); //전체 태그
  const [hashTag, setHashTag] = useState<string>(""); //현재 태그
  const [imageFile, setImageFile] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); //업로드 ing인지 확인
  const { user } = useContext(AuthContext);
  const t = useTranslation();

  const handleFileUpload = (e: any) => {
    const {
      target: { files },
    } = e;

    const file = files?.[0]; //파일을 하나만 올리도록 해야해서

    /*FileReader 객체는 웹 애플리케이션이 비동기적으로 데이터를 읽기 위해 사용하는 용도 
    FileReader를 통해 이미지 파일을 읽고 해당이미지를 readAsDataURL메서드를 사용해 base64 인코딩 된 데이터 리턴
    데이터 url을 다 읽었는지 여부를 확인하기 위해서는 loadend 이벤트를 사용
    따라서 파일 읽기가 끝났으면 loadend이벤트를 같이 호출해주면서 마무리*/

    const fileReader = new FileReader(); //FileReader 객체 선언
    fileReader?.readAsDataURL(file); //file 읽기

    fileReader.onloadend = (e: any) => {
      //읽기 행위가 끝난 경우에는 currentTarget.result 즉 인코딩된 데이터를 set
      const { result } = e?.currentTarget;
      setImageFile(result);
    };
  };

  const handleDeleteImage = () => {
    setImageFile(null);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true);
    const key = `${user?.uid}/${uuidv4()}`; //사용자 정보에 따라 고유의 키값
    const storageRef = ref(storage, key); //참조 만들기

    e.preventDefault();
    try {
      // 이미지 먼저 업로드
      let imageUrl = "";
      if (imageFile) {
        const data = await uploadString(storageRef, imageFile, "data_url");
        imageUrl = await getDownloadURL(data?.ref);
      }

      // 업로드된 이미지의 download url 업데이트
      await addDoc(collection(db, "posts"), {
        content: content,
        createdAt: new Date()?.toLocaleDateString("ko", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
        uid: user?.uid,
        email: user?.email,
        hashTags: tags,
        imageUrl: imageUrl,
      });
      setContent("");
      setTags([]);
      setHashTag("");
      toast.success("게시글을 생성했습니다.");
      setIsSubmitting(false);
      setImageFile(null);
    } catch (e: any) {
      console.log(e);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const {
      target: { name, value },
    } = e;

    if (name === "content") {
      setContent(value);
    }
  };

  const removeTag = (tag: string) => {
    //태그값과 같은 값은 배열에서 빠지게 됨
    setTags(tags?.filter((val) => val !== tag));
  };

  const onChangeHashTag = (e: any) => {
    setHashTag(e?.target?.value?.trim());
  };

  const handleKeyUp = (e: any) => {
    //e에 any말고 어떤 타입 넣어야 할지 모르겠음
    //e.keyCode 32가 스페이스 즉 스페이스가 눌렸고 빈값이 아니면
    if (e.keyCode === 32 && e.target.value.trim() !== "") {
      // 만약 같은 태그가 있다면 에러를 띄운다
      // 아니라면 태그를 생성해준다
      if (tags?.includes(e.target.value?.trim())) {
        toast.error("같은 태그가 있습니다.");
      } else {
        //기존의 태그들에다가 추가로 태그 추가
        setTags((prev) => (prev?.length > 0 ? [...prev, hashTag] : [hashTag]));
        setHashTag("");
      }
    }
  };

  return (
    <form className="post-form" onSubmit={onSubmit}>
      <textarea
        className="post-form__textarea"
        required
        name="content"
        id="content"
        placeholder={t("POST_PLACEHOLDER")}
        onChange={onChange}
        value={content}
      />
      <div className="post-form__hashtags">
        <span className="post-form__hashtags-outputs">
          {tags?.map((tag, index) => (
            <span
              className="post-form__hashtags-tag"
              key={index}
              onClick={() => removeTag(tag)}
            >
              #{tag}
            </span>
          ))}
        </span>
        <input
          className="post-form__input"
          name="hashtag"
          id="hashtag"
          placeholder={t("POST_HASHTAG")}
          onChange={onChangeHashTag}
          onKeyUp={handleKeyUp}
          value={hashTag}
        />
      </div>
      <div className="post-form__submit-area">
        <div className="post-form__image-area">
          <label htmlFor="file-input" className="post-form__file">
            <FiImage className="post-form__file-icon" />
          </label>
          <input
            type="file"
            name="file-input"
            id="file-input"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          {imageFile && (
            <div className="post-form__attachment">
              <img src={imageFile} alt="attachment" width={100} height={100} />
              <button
                className="post-form__clear-btn"
                type="button"
                onClick={handleDeleteImage}
              >
                {t("BUTTON_DELETE")}
              </button>
            </div>
          )}
        </div>
        <input
          type="submit"
          value={t("BUTTON_TWEET")}
          className="post-form__submit-btn"
          disabled={isSubmitting}
        />
      </div>
    </form>
  );
};
export default PostForm;
