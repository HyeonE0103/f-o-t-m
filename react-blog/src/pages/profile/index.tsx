import Profile from "../../components/Profile";
import PostList from "../../components/PostList";

const ProfilePage = () => {
  return (
    <>
      <Profile />
      <PostList hasNavigation={false} defaultTab="my" />
    </>
  );
};

export default ProfilePage;
