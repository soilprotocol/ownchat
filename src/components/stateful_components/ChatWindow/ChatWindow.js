import React from "react";
import Tab from "react-bootstrap/Tab";
import Message from "../../functional_components/Message/Message";

class ChatWindow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      webId: undefined,
      friends: this.props.friends,
      messages: this.props.messages
    };
  }

  render() {
    if (this.state.messages.length <= 0) {
      return (
        <Tab.Content style={{ height: "80%", overflowY: "scroll" }}>
          {this.props.friends.map((friend, index) => {
            const username = friend.webId.split(".")[0].replace("https://", "");
            return (
              <Tab.Pane eventKey={"#" + username} key={index}>
                You do not have any messages with this person yet
              </Tab.Pane>
            );
          })}
        </Tab.Content>
      );
    }

    const chatMarkup = this.state.messages.map((message) => {
        return <Message message={message.message} from={message.from}/>;
    })

    return (
      <Tab.Content style={{ height: "80%", overflowY: "scroll" }}>
        {this.props.friends.map((friend, index) => {
          const username = friend.webId.split(".")[0].replace("https://", "");
          return (
            <Tab.Pane eventKey={"#" + username} key={index}>
              {chatMarkup}
            </Tab.Pane>
          );
        })}
      </Tab.Content>
    );
  }
}

export default ChatWindow;
