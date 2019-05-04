import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import styles from './EmptyChat.module.css';

const EmptyChat = () => {
  return (
    <Row>
      <Col sm lg />
      <Col sm="6" md="6" lg="6">
        <h1 className={styles.text}>
          Select a friend to start chatting
        </h1>
      </Col>
      <Col sm lg />
    </Row>
  );
};

export default EmptyChat;
