import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Button } from "yoda-design-system";

const GreetPage = (props) => {
  return (
    <Row>
      <Col lg />
      <Col lg="6">
        <h1 style={{margin: "10%"}}>You are not logged in! To take ownership of your messages and contacts, please register or login.</h1>
        <Button onClick={props.onClick} style={{margin: "10%"}}>Login</Button>
      </Col>
      <Col lg />
    </Row>
  );
};

export default GreetPage;
