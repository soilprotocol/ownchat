import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import styles from "./EmptyChat.module.css";

const EmptyChat = props => {
  let emptyChatText = "";
  if (props.nomessages) {
    emptyChatText = "You have no chat history with this person...";
  } else {
    emptyChatText = "Select a friend to start chatting";
  }
  return (
    <Row style={{height: "100%"}}>
      <Col sm lg />
      <Col sm="6" md="6" lg="6" style={{marginTop: "auto", marginBottom: "auto"}}>
        <h1 className={styles.text}>{emptyChatText}</h1>
      </Col>
      <Col sm lg />
    </Row>
  );
};

export default EmptyChat;
