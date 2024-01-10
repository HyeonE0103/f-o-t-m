import { useEffect, useState, useContext } from "react";
import PostBox from "components/posts/PostBox";
import { PostProps } from "pages/home";
import AuthContext from "context/AuthContext";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "firebaseApp";
import useTranslation from "hooks/useTranslation";

const SearchPage = () => {
  const [posts, setPosts] = useState<PostProps[]>([]);
  const [tagQuery, setTagQuery] = useState<string>(""); //검색어
  const { user } = useContext(AuthContext);
  const t = useTranslation();

  const onChange = (e: any) => {
    setTagQuery(e?.target?.value?.trim());
  };

  useEffect(() => {
    if (user) {
      //user가 있을경우 -> 로그인했을 경우
      let postsRef = collection(db, "posts"); //posts라는 collection
      let postsQuery = query(
        postsRef,
        //hastTags필드중에 [tagQuery]를 가지고 있는 데이터 오름차순으로
        where("hashTags", "array-contains-any", [tagQuery]),
        orderBy("createdAt", "desc")
      );

      onSnapshot(postsQuery, (snapShot) => {
        let dataObj = snapShot?.docs?.map((doc) => ({
          ...doc?.data(),
          id: doc?.id,
        }));

        setPosts(dataObj as PostProps[]);
      });
    }
  }, [tagQuery, user]);
  return (
    <div className="home">
      <div className="home__top">
        <div className="home__title">
          <div className="home__title-text">{t("MENU_SEARCH")}</div>
        </div>
        <div className="home__search-div">
          <input
            className="home__search"
            placeholder={t("SEARCH_HASHTAGS")}
            onChange={onChange}
          />
        </div>
      </div>
      <div className="post">
        {posts?.length > 0 ? (
          posts?.map((post) => <PostBox post={post} key={post.id} />)
        ) : (
          <div className="post__no-posts">
            <div className="post__text">{t("NO_POSTS")}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
