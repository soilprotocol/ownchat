import React from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Image from "react-bootstrap/Image";

const FriendSlot = props => {
  const friend = props.friend;
  return (
    <Row
      style={{
        width: "100%",
        paddingBottom: "20px"
      }}
      index={props.index}
      webid={friend.webId}
    >
      <Col lg="3" style={{ width: "20%" }}>
        <div
          style={{
            overflow: "hidden",
            borderRadius: "50%",
            width: "100px",
            height: "100px"
          }}
        >
          <Image
            style={{
              maxWidth: "150px",
              maxHeight: "150px",
              display: "block",
              marginLeft: "auto",
              marginRight: "auto"
            }}
            src={friend.picture}
            alt={"Profile picture of " + friend.name}
            webid={friend.webId}
          />
        </div>
      </Col>
      <Col
        lg="8"
        style={{
          marginTop: "auto",
          marginBottom: "20%",
          display: "block",
          width: "80%",
          paddingLeft: "20%"
        }}
      >
        <strong index={props.index} webid={friend.webId}>{friend.name}</strong>
      </Col>
      <Col lg />
    </Row>
  );
};

export default FriendSlot;
