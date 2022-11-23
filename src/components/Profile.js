import React from "react";

const Profile = (props) => {
  const person = props.person;
  return (
    <div className="profile">
      <p>Name: {person.profileName}</p>
      <p>Number Of Followers: {person.totalFollowers}</p>
      <p>Total Number Of Posts: {person.totalPosts}</p>
      <p>Total Number Of Comments: {person.totalComments}</p>
      <p>Total Number Of Likes: {person.totalLikes}</p>
    </div>
  );
};

export default Profile;
