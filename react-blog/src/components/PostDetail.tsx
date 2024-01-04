import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PostProps } from "./PostList";
import { db } from "firebaseApp";
import Loader from "./Loader";

const PostDetail = () => {
  const [post, setPost] = useState<PostProps | null>(null);
  const params = useParams();

  const getPost = async (id: string) => {
    if (id) {
      const docRef = doc(db, "posts", id);
      const docSnap = await getDoc(docRef);

      //docSnap이 데이터를 가지고 있는것이 아니라 데이터를 한번더 호출해야함
      setPost({ id: docSnap.id, ...(docSnap.data() as PostProps) });
    }
  };

  const handleDelete = () => {
    console.log("delete!");
  };

  useEffect(() => {
    //params에 id가 있을때만 상세페이지의 게시물을 가져올수 있기 때문에 id가 있을때 getPost를 함
    if (params?.id) getPost(params?.id);
  }, [params?.id]);

  return (
    <>
      <div className="post__detail">
        {post ? (
          <div className="post__box">
            <div className="post__title">{post?.title}</div>
            <div className="post__profile-box">
              <div className="post__profile" />
              <div className="post__author-name">{post?.email}</div>
              <div className="post__date">{post?.createdAt}</div>
            </div>
            <div className="post__utils-box">
              <div
                className="post__delete"
                role="presentation"
                onClick={handleDelete}
              >
                삭제
              </div>
              <div className="post__edit">
                <Link to={`/posts/edit/1`}>수정</Link>
              </div>
            </div>
            <div className="post__text post__text--pre-wrap">
              {post?.content}
            </div>
          </div>
        ) : (
          <Loader />
        )}
      </div>
    </>
  );
};

export default PostDetail;
