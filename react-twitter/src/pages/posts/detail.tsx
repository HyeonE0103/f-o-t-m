import { doc, getDoc } from "firebase/firestore";
import Loader from "components/loader/Loader";
import PostBox from "components/posts/PostBox";
import { PostProps } from "pages/home";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "firebaseApp";
import PostHeader from "components/posts/Header";

const PostDetail = () => {
  const params = useParams();
  const [post, setPost] = useState<PostProps | null>(null);

  const getPost = useCallback(async () => {
    if (params.id) {
      const docRef = doc(db, "posts", params.id); //post중에 params.id가진거
      const docSnap = await getDoc(docRef); //내가 원한 조건에 따른 놈 가져와

      // docSnap에 여러가지가 많아서 내가 원하는 데이터를 뽑아 setPost
      setPost({ ...(docSnap?.data() as PostProps), id: docSnap?.id });
    }
  }, [params.id]);

  useEffect(() => {
    if (params.id) getPost();
  }, [getPost, params.id]);

  return (
    <div className="post">
      <PostHeader />
      {/* 포스트를 가져오는 중이면 Loader를 가져왔으면 post 보여주기 */}
      {post ? <PostBox post={post} /> : <Loader />}
    </div>
  );
};

export default PostDetail;
