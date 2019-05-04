import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const EmptyChat = () => {
  return (
    <Row>
      <Col lg />
      <Col lg="6">
        <h1 style={{ margin: "10%" }}>
          Select a friend to start chatting
        </h1>
      </Col>
      <Col lg />
    </Row>
  );
};

export default EmptyChat;
