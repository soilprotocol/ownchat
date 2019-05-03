import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const FriendsList = props => {
  return (
    <Col lg="3" style={{ border: "solid black 3px" }}>
      {props.friends.map(friend => {
        return <Row>{friend.webId}</Row>;
      })}
    </Col>
  );
};

export default FriendsList;
