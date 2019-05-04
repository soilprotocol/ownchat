import React from "react";
import styles from './FriendSlot.module.css';

const FriendSlot = props => {
  const friend = props.friend;
  return (
    <div
      className={styles.container}
      index={props.index}
      webid={friend.webId}
    >
      <div 
        className={styles.image}
        style={{backgroundImage:`url(${friend.picture})`}}
      />
      <strong 
        className={styles.nameText}
        index={props.index}
        webid={friend.webId}
      >
      {friend.name}
      </strong>
    </div>
  );
};

export default FriendSlot;
