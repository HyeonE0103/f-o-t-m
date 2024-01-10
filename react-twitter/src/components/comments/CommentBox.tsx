import React, { useContext } from "react";
import { PostProps } from "pages/home";
import AuthContext from "context/AuthContext";
import styles from "./Comment.module.scss";
import { arrayRemove, doc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { db } from "firebaseApp";

export interface CommentProps {
  comment: string;
  uid: string;
  email: string;
  createdAt: string;
}

interface CommentBoxProps {
  comment: CommentProps;
  post: PostProps;
}

const CommentBox = ({ comment, post }: CommentBoxProps) => {
  const { user } = useContext(AuthContext);

  const handleDeleteComment = async () => {
    if (post) {
      //post가 있어야 그 안에 comment가 있으므로
      try {
        const postRef = doc(db, "posts", post?.id); //해당 게시물 찾기
        await updateDoc(postRef, {
          //게시물 수정
          comments: arrayRemove(comment),
          ////arryRemove를 사용해 바로 삭제하고 싶은 값을 넣음
        });
        toast.success("댓글을 삭제했습니다");
      } catch (e) {
        console.log(e);
      }
    }
  };
  return (
    <div key={comment?.createdAt} className={styles.comment}>
      <div className={styles.comment__borderBox}>
        <div className={styles.comment__imgBox}>
          <div className={styles.comment__flexBox}>
            <img src={`/logo192.png`} alt="profile" />
            <div className={styles.comment__email}>{comment?.email}</div>
            <div className={styles.comment__createdAt}>
              {comment?.createdAt}
            </div>
          </div>
        </div>
        <div className={styles.comment__content}>{comment?.comment}</div>
        <div className={styles.comment__submitDiv}>
          {comment?.uid === user?.uid && (
            <button
              type="button"
              className="comment__delete-btn"
              onClick={handleDeleteComment}
            >
              삭제
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentBox;
