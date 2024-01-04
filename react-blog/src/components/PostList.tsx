import AuthContext from "context/AuthContext";
import { collection, getDocs } from "firebase/firestore";
import { db } from "firebaseApp";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface PostListProps {
  hasNavigation?: boolean;
}

export interface PostProps {
  id?: string;
  title: string;
  email: string;
  summary: string;
  content: string;
  createdAt: string;
}

type TabType = "all" | "my";

const PostList = ({ hasNavigation = true }: PostListProps) => {
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [posts, setPosts] = useState<PostProps[]>([]);
  const { user } = useContext(AuthContext);

  const getPosts = async () => {
    const datas = await getDocs(collection(db, "posts"));

    datas?.forEach((doc) => {
      const dataObj = { ...doc.data(), id: doc.id };
      setPosts((prev) => [...prev, dataObj as PostProps]); //타입지정
      //이전것에 새로운것을 추가, 바로 datObj를 하게 되면 마지막 하나만 됨
    });
  };

  //페이지가 마운트 될때마다 모든 포스터를 firestore통해 가져옴
  useEffect(() => {
    getPosts();
  }, []);

  return (
    <>
      {hasNavigation && (
        <div className="post__navigation">
          <div
            role="presentation"
            onClick={() => setActiveTab("all")}
            className={activeTab === "all" ? "post__navigation--active" : ""}
          >
            전체
          </div>
          <div
            role="presentation"
            onClick={() => setActiveTab("my")}
            className={activeTab === "my" ? "post__navigation--active" : ""}
          >
            나의 글
          </div>
        </div>
      )}
      <div className="post__list">
        {posts?.length > 0 ? (
          posts?.map((post, index) => (
            <div key={post?.id} className="post__box">
              <Link to={`/posts/${post?.id}`}>
                <div className="post__profile-box">
                  <div className="post__profile" />
                  <div className="post__author-name">{post?.email}</div>
                  <div className="post__date">{post?.createdAt}</div>
                </div>
                <div className="post__title">{post?.title}</div>
                <div className="post__text">{post?.summary}</div>
              </Link>
              {post?.email === user?.email && (
                <div className="post__utils-box">
                  <div className="post__delete">삭제</div>
                  <Link to={`/posts/edit/${post?.id}`} className="post__edit">
                    수정
                  </Link>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="post__no-post">게시글이 없습니다.</div>
        )}
      </div>
    </>
  );
};

export default PostList;
