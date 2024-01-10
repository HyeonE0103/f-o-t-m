import AuthContext from "context/AuthContext";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "firebaseApp";
import useTranslation from "hooks/useTranslation";
import { PostProps } from "pages/home";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

interface FollowingProps {
  post: PostProps;
}

export interface UserProps {
  id: string;
}

const FollowingBox = ({ post }: FollowingProps) => {
  const { user } = useContext(AuthContext);
  const [postFollowers, setPostFollowers] = useState<any[]>([]);
  const t = useTranslation();

  const onClickFollow = async (e: any) => {
    e.preventDefault();

    try {
      if (user?.uid) {
        //로그인이 되어있는지
        // 내가 주체가 되어 '팔로잉' 컬렉션 생성 or 업데이트
        const followingRef = doc(db, "following", user?.uid);

        await setDoc(
          //문서가 없으면 생성, 있으면 덮어쓰지만 기존 문서와 병합하도록 지정할 수 있음
          followingRef,
          {
            users: arrayUnion({ id: post?.uid }),
          },
          { merge: true } //기존 문서와 병합하도록 지정
        );

        // 팔로우 당하는 사람(게시글 주체자)이 주체가 되어 '팔로우' 컬렉션 생성 or 업데이트
        const followerRef = doc(db, "follower", post?.uid);

        await setDoc(
          followerRef,
          { users: arrayUnion({ id: user?.uid }) },
          { merge: true }
        );

        // 팔로잉 알림 생성
        await addDoc(collection(db, "notifications"), {
          //notifications DB에 데이터 추가
          createdAt: new Date()?.toLocaleDateString("ko", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
          content: `${user?.email || user?.displayName}가 팔로우를 했습니다.`,
          //user가 email이 없으면 dispalyName으로 대체
          url: "#", //url은 없수
          isRead: false,
          uid: post?.uid,
          //자신의 uid가 아닌 내가 팔로잉 한 상대편에게 내가 팔로잉 했다고 알림이 가야함으로 post?.uid
        });

        toast.success("팔로우를 했습니다.");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onClickDeleteFollow = async (e: any) => {
    e.preventDefault();
    try {
      if (user?.uid) {
        const followingRef = doc(db, "following", user?.uid);
        await updateDoc(followingRef, {
          //나에서 게시물 작성자 삭제
          users: arrayRemove({ id: post?.uid }),
        });

        const followerRef = doc(db, "follower", post?.uid);
        await updateDoc(followerRef, {
          //게시물 작성자에게서 나 삭제
          users: arrayRemove({ id: user.uid }),
        });

        toast.success("팔로우를 취소했습니다.");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getFollowers = useCallback(async () => {
    if (post.uid) {
      const ref = doc(db, "follower", post.uid);
      onSnapshot(ref, (doc) => {
        //실시간 업데이트
        setPostFollowers([]); //초기화
        doc?.data()?.users?.map((user: UserProps) =>
          /*하나씩 맵핑을 하는것이기 때문에 차곡차곡 추가해주어야함
          [{id:1},{id:2}}]식으로 배열에 객체 있는것을 ['1','2']처럼 풀어서 배열에 넣어주는 것임*/
          setPostFollowers((prev: UserProps[]) =>
            prev ? [...prev, user?.id] : []
          )
        );
      });
    }
  }, [post.uid]);

  useEffect(() => {
    if (post.uid) getFollowers();
  }, [getFollowers, post.uid]);

  return (
    <>
      {user?.uid !== post?.uid && //내 게시물은 내가 팔로우 할수 없도록 막음
        (postFollowers?.includes(user?.uid) ? (
          <button
            type="button"
            className="post__following-btn"
            onClick={onClickDeleteFollow}
          >
            {t("BUTTON_FOLLOWING")}
          </button>
        ) : (
          <button
            type="button"
            className="post__follow-btn"
            onClick={onClickFollow}
          >
            {t("BUTTON_FOLLOW")}
          </button>
        ))}
    </>
  );
};

export default FollowingBox;
