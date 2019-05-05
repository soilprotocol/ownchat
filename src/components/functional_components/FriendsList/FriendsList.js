import React from "react";
import ListGroup from "react-bootstrap/ListGroup";
import FriendSlot from "../FriendSlot/FriendSlot";
import styles from './FriendsList.module.css';
const FriendsList = props => {
  return (
    <ListGroup variant="flush" className={styles.scrollDiv}>
      {props.friends.map((friend, index) => {
        const username = friend.webId.split(".")[0].replace("https://", "");
        return (
          <ListGroup.Item action href={"#" + username} key={index} onClick={() => props.onClick(friend.webId)}>
            <FriendSlot friend={friend} index={index}/>
          </ListGroup.Item>
        );
      })}
    </ListGroup>
  );
};

export default FriendsList;
