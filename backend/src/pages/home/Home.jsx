import React, { useEffect } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { usePostContext } from "../../hooks/usePostContext";
import ProfileCard from "../../components/profileCard/ProfileCard";
import Posts from "../../components/posts/Posts";
import NewPostForm from "../../components/newPostForm/NewPostForm";
import "./Home.css";

const Home = () => {
  const { posts, dispatch } = usePostContext();
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch("/posts/feed", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const json = await response.json();

      if (response.ok) {
        dispatch({ type: "SET_POSTS", payload: json });
      } else {
        console.log(json.error);
      }
    };

    if (user) {
      fetchPosts();
    }
  }, [user, dispatch]);

  return (
    <div className="home">
      <div className="profile-card-container">
        <ProfileCard />
      </div>
      <div className="posts-container">
        <div className="posts">
          {posts && posts.map((post) => <Posts key={post._id} post={post} />)}
        </div>
      </div>
      <div className="new-post-form-container">
        <NewPostForm />
      </div>
    </div>
  );
};

export default Home;
