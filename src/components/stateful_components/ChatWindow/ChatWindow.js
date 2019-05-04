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
    console.log(this.props.messages)
    if (this.props.messages.length <= 0) {
      return (
        <Tab.Content style={{ height: "84%", overflowY: "scroll" }}>
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

    const chatMarkup = this.props.messages.map((message) => {
        return <Message message={message.message} from={message.from}/>;
    })

    return (
      <Tab.Content style={{ maxHeight: "calc(100% - 120px)", overflowY: "scroll", boxShadow:"4px 2px 4px rgba(0, 0, 0, 0.5)"}}>
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
