import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PostProps } from "./PostList";
import { db } from "firebaseApp";
import Loader from "./Loader";
import { toast } from "react-toastify";
import { Comments } from "./Comments";

const PostDetail = () => {
  const [post, setPost] = useState<PostProps | null>(null);
  const params = useParams();
  const navigate = useNavigate();

  const getPost = async (id: string) => {
    if (id) {
      const docRef = doc(db, "posts", id);
      const docSnap = await getDoc(docRef);

      //docSnap이 데이터를 가지고 있는것이 아니라 데이터를 한번더 호출해야함
      setPost({ id: docSnap.id, ...(docSnap.data() as PostProps) });
    }
  };

  const handleDelete = async () => {
    //윈도우에 내장되어있는 confirm을 이용하여 유저에게 한번 더 삭제할지 물어봄
    const confirm = window.confirm("해당 게시글을 삭제하시겠습니까?");
    if (confirm && post && post.id) {
      await deleteDoc(doc(db, "posts", post.id));
      toast?.success("게시글을 삭제했습니다.");
      navigate("/");
    }
  };

  useEffect(() => {
    //params에 id가 있을때만 상세페이지의 게시물을 가져올수 있기 때문에 id가 있을때 getPost를 함
    if (params?.id) getPost(params?.id);
  }, [params?.id]);

  return (
    <>
      <div className="post__detail">
        {post ? (
          <>
            <div className="post__box">
              <div className="post__title">{post?.title}</div>
              <div className="post__profile-box">
                <div className="post__profile" />
                <div className="post__author-name">{post?.email}</div>
                <div className="post__date">{post?.createdAt}</div>
              </div>
              <div className="post__utils-box">
                {post?.category && (
                  <div className="post__category">{post?.category}</div>
                )}
                <div
                  className="post__delete"
                  role="presentation"
                  onClick={handleDelete}
                >
                  삭제
                </div>
                <div className="post__edit">
                  <Link to={`/posts/edit/${post?.id}`}>수정</Link>
                </div>
              </div>
              <div className="post__text post__text--pre-wrap">
                {post?.content}
              </div>
            </div>
            <Comments post={post} getPost={getPost}/>
          </>
        ) : (
          <Loader />
        )}
      </div>
    </>
  );
};

export default PostDetail;
