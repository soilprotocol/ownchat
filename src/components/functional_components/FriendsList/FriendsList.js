import React from "react";
import Row from "react-bootstrap/Row";
import ListGroup from "react-bootstrap/ListGroup";
import FriendSlot from "../FriendSlot/FriendSlot";

const FriendsList = props => {
  return (
    <ListGroup variant="flush">
      {props.friends.map((friend, index) => {
        return (
          <ListGroup.Item action href={"#" + index} key={index} onClick={props.onClick}>
            <FriendSlot friend={friend} index={index}/>
          </ListGroup.Item>
        );
      })}
    </ListGroup>
  );
};

export default FriendsList;
