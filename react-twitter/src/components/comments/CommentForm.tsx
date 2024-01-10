import AuthContext from "context/AuthContext";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "firebaseApp";
import useTranslation from "hooks/useTranslation";
import { PostProps } from "pages/home";
import React, { useContext, useState } from "react";
import { toast } from "react-toastify";

export interface CommentFormProps {
  post: PostProps | null;
}

const CommentForm = ({ post }: CommentFormProps) => {
  const [comment, setComment] = useState<string>("");
  const { user } = useContext(AuthContext);
  const t = useTranslation();

  const truncate = (str: string) => {
    //내용이 길경우 짧게 만들어 생략기호(...)추가
    return str?.length > 10 ? str?.substring(0, 10) + "..." : str;
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (post && user) {
      //post가 있는 경우에만 예외처리
      const postRef = doc(db, "posts", post?.id); //현재 포스터 찾기

      const commentObj = {
        comment: comment,
        uid: user?.uid,
        email: user?.email,
        createdAt: new Date()?.toLocaleDateString("ko", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      };

      await updateDoc(postRef, {
        //DB수정
        //array의 값을 추가할때는 arrayUnion. 새로 생성된 object를 배열에 추가해줌
        comments: arrayUnion(commentObj),
      });

      // 댓글 생성 알림 만들기
      if (user?.uid !== post?.uid) {
        //나의 게시물인 경우 알림X
        await addDoc(collection(db, "notifications"), {
          //notifications라는 콜렉션을 만들어 추가
          createdAt: new Date()?.toLocaleDateString("ko", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
          uid: post?.uid,
          isRead: false,
          url: `/posts/${post?.id}`,
          //content내용이 길경우 적절히 내용 짜르기
          content: `"${truncate(post?.content)}" 글에 댓글이 작성되었습니다.`,
        });
      }

      toast.success("댓글을 생성했습니다.");
      setComment("");

      try {
      } catch (e: any) {
        console.log(e);
      }
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const {
      target: { name, value },
    } = e;
    if (name === "comment") setComment(value);
  };

  return (
    <form className="post-form" onSubmit={onSubmit}>
      <textarea
        className="post-form__textarea"
        name="comment"
        id="comment"
        required
        placeholder={t("POST_PLACEHOLDER")}
        onChange={onChange}
        value={comment}
      />
      <div className="post-form__submit-area">
        <div />
        <input
          type="submit"
          value={t("BUTTON_COMMENT")}
          className="post-form__submit-btn"
          disabled={!comment}
        />
      </div>
    </form>
  );
};

export default CommentForm;
