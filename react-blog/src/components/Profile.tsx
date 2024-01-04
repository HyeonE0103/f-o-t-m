import AuthContext from "context/AuthContext";
import { getAuth, signOut } from "firebase/auth";
import { app } from "firebaseApp";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const onSignOut = async () => {
    try {
      const auth = getAuth(app);
      await signOut(auth);
      toast.success("로그아웃 성공");
      navigate("/login");
    } catch (error: any) {
      console.log(error);
      toast.error(error?.code);
    }
  };

  return (
    <div className="profile__box">
      <div className="flex__box-lg">
        <div className="profile__image" />
        <div>
          <div className="profile__email">{user?.email}</div>
          <div className="profile__name">{user?.displayName || "사용자"}</div>
        </div>
      </div>
      <div role="presentation" className="profile__logout" onClick={onSignOut}>
        로그아웃
      </div>
    </div>
  );
};
export default Profile;
