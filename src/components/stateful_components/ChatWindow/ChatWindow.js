import React from "react";
import Tab from "react-bootstrap/Tab";

class ChatWindow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      webId: undefined,
      friends: this.props.friends,
      ownMessages: this.props.ownMessages,
      friendMessages: this.props.friendMessages
    };
  }

  render() {
    if (this.state.ownMessages) {
      if (
        this.state.ownMessages.length === 0 &&
        this.state.friendMessages.length === 0
      ) {
        return (
          <Tab.Content style={{ maxHeight: "80%", overflowY: "scroll" }}>
            {this.props.friends.map((friend, index) => {
              const username = friend.webId
                .split(".")[0]
                .replace("https://", "");
              return (
                <Tab.Pane eventKey={"#" + username} key={index}>
                  You do not have any messages with this person yet
                </Tab.Pane>
              );
            })}
          </Tab.Content>
        );
      }
    }
    return (
      <Tab.Content style={{ maxHeight: "80%", overflowY: "scroll" }}>
        {this.props.friends.map((friend, index) => {
          const username = friend.webId.split(".")[0].replace("https://", "");
          return (
            <Tab.Pane eventKey={"#" + username} key={index}>
              {friend.webId}
            </Tab.Pane>
          );
        })}
      </Tab.Content>
    );
  }
}

export default ChatWindow;
