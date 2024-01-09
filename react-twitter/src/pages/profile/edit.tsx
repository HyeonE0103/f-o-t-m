import { useEffect, useState, useContext } from "react";
import { FiImage } from "react-icons/fi";
import AuthContext from "context/AuthContext";
import {
  ref,
  deleteObject,
  uploadString,
  getDownloadURL,
} from "firebase/storage";
import { updateProfile } from "firebase/auth";

import { v4 as uuidv4 } from "uuid";
import { storage } from "firebaseApp";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import PostHeader from "components/posts/Header";

const STORAGE_DOWNLOAD_URL_STR = "https://firebasestorage.googleapis.com";

const ProfileEdit = () => {
  const [displayName, setDisplayName] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e;

    setDisplayName(value);
  };

  const onSubmit = async (e: any) => {
    let key = `${user?.uid}/${uuidv4()}`;
    const storageRef = ref(storage, key);
    let newImageUrl = null;

    e.preventDefault();

    try {
      // 기존 유저 이미지가 Firebase Storage 이미지일 경우에만 삭제
      /* 생성된 다운로드된 이미지는 https://firebasestorage.googleapis.com으로 시작함
      따라서 해당값이 있는 url인 경우에는 삭제가 되고 해당값이 없는 url은 삭제X
      E따라서 photoURL이 있고 해당 도메인이 들어있는 경우에만 삭제*/
      if (
        user?.photoURL &&
        user?.photoURL?.includes(STORAGE_DOWNLOAD_URL_STR)
      ) {
        const imageRef = ref(storage, user?.photoURL);
        if (imageRef) {
          await deleteObject(imageRef).catch((error) => {
            console.log(error);
          });
        }
      }
      // 이미지 업로드
      if (imageUrl) {
        const data = await uploadString(storageRef, imageUrl, "data_url");
        newImageUrl = await getDownloadURL(data?.ref);
      }
      // updateProfile 호출
      if (user) {
        await updateProfile(user, {
          displayName: displayName || "", //이름이 있으면 아니면 공백
          photoURL: newImageUrl || "", //이미지가 있으면 아니면 공백
        })
          .then(() => {
            toast.success("프로필이 업데이트 되었습니다.");
            navigate("/profile");
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } catch (e: any) {
      console.log(e);
    }
  };

  const handleFileUpload = (e: any) => {
    const {
      target: { files },
    } = e;

    const file = files?.[0];
    //FileReader는 웹브라우저 환경에서 파일을 비동기적으로 읽어올수 있는 JS Api
    const fileReader = new FileReader();
    /* readAsDataURL 메소드는 컨텐츠를 특정 데이터 url로 읽어올수 있게 함
    base64 인코딩된 문자열로 표현이 되기 때문에 이미지나 텍스트 파일등에 내용들을 문자열로 반환해서 사용할 수 있음 */
    fileReader.readAsDataURL(file);
    //onloadend는 이벤트 성공여부와 관계없이 파일읽기가 끝나면 실행됨
    fileReader.onloadend = (e: any) => {
      const { result } = e?.currentTarget;
      setImageUrl(result);
    };
  };

  const handleDeleteImage = () => {
    setImageUrl(null);
  };

  useEffect(() => {
    if (user?.photoURL) {
      //유저 프로필 이미지가 있다면
      setImageUrl(user?.photoURL);
    }
    if (user?.displayName) {
      //유저 닉네임이 있다면
      setDisplayName(user?.displayName);
    }
  }, [user?.displayName, user?.photoURL]);

  return (
    <div className="post">
      <PostHeader />
      <form className="post-form" onSubmit={onSubmit}>
        <div className="post-form__profile">
          <input
            type="text"
            name="displayName"
            className="post-form__input"
            placeholder="이름"
            onChange={onChange}
            value={displayName}
          />
          {imageUrl && (
            <div className="post-form__attachment">
              <img src={imageUrl} alt="attachment" width={100} height={100} />
              <button
                type="button"
                onClick={handleDeleteImage}
                className="post-form__clear-btn"
              >
                삭제
              </button>
            </div>
          )}

          <div className="post-form__submit-area">
            <div className="post-form__image-area">
              <label className="post-form__file" htmlFor="file-input">
                {/* htmlFor에 input의 아이디나 네임을 적어 인풋과 연결 */}
                <FiImage className="post-form__file-icon" />
              </label>
            </div>
            <input
              type="file"
              name="file-input"
              id="file-input"
              accept="image/*"
              className="hidden"
              //파일선택 선택된 파일없음 이라는 못생긴 부분 안보이게
              onChange={handleFileUpload}
            />
            <input
              type="submit"
              value="프로필 수정"
              className="post-form__submit-btn"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProfileEdit;
