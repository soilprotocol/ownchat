import React from "react";
import styles from './Message.module.css';
import classNames from 'classnames';

const Message = (props) => {
  return (
    <div className={styles.container}>
      <div className={classNames(styles.message, props.from === "me" ? styles.me : styles.friend)}>
        {props.message.content}
      </div>
    </div>
  );
};

export default Message;