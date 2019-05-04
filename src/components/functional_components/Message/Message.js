import React from "react";
import styles from './Message.module.css';
import classNames from 'classnames';

const Message = (props) => {
  return (
    <div className={styles.container}>
      <div className={classNames(styles.message, {[styles.friend]: props.from === "friend"})}>
        {props.message.content}
      </div>
    </div>
  );
};

export default Message;