import { doc, getDoc, onSnapshot } from "firebase/firestore";
import Loader from "components/loader/Loader";
import PostBox from "components/posts/PostBox";
import { PostProps } from "pages/home";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "firebaseApp";
import PostHeader from "components/posts/Header";
import CommentForm from "components/comments/CommentForm";
import CommentBox, { CommentProps } from "components/comments/CommentBox";

const PostDetail = () => {
  const params = useParams();
  const [post, setPost] = useState<PostProps | null>(null);

  const getPost = useCallback(async () => {
    if (params.id) {
      const docRef = doc(db, "posts", params.id); //post중에 params.id가진거

      onSnapshot(docRef, (doc) => {
        //댓글 새로고침이 안되기 때문에 onSnapshot이용
        setPost({ ...(doc?.data() as PostProps), id: doc?.id });
        // docSnap에 여러가지가 많아서 내가 원하는 데이터를 뽑아 setPost
      });
    }
  }, [params.id]);

  useEffect(() => {
    if (params.id) getPost();
  }, [getPost, params.id]);

  return (
    <div className="post">
      <PostHeader />
      {/* 포스트를 가져오는 중이면 Loader를 가져왔으면 post 보여주기 */}
      {post ? (
        <>
          <PostBox post={post} />
          <CommentForm post={post} />
          {/* slice를 이용해 불변서 reverse를 이용해 최신순 map으로 돌림 */}
          {post?.comments
            ?.slice(0)
            ?.reverse()
            ?.map((comment: CommentProps, index: number) => (
              <CommentBox comment={comment} key={index} post={post} />
            ))}
        </>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default PostDetail;
