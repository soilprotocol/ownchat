import React from "react";
import Tab from "react-bootstrap/Tab";
import Message from "../../functional_components/Message/Message";
import styles from './ChatWindow.module.css';
import EmptyChat from "../../functional_components/EmptyChat/EmptyChat";

class ChatWindow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      webId: undefined,
      friends: this.props.friends,
      messages: this.props.messages
    };
  }

  componentDidUpdate(){
    var scrollDiv = document.getElementById("scrollDiv");
    if(scrollDiv){
      console.log("scroll baby scroll")
      scrollDiv.scrollTop = scrollDiv.scrollHeight
    }

  }

  render() {
    console.log(this.props.messages)
    if (this.props.messages.length <= 0) {
      return (
        <Tab.Content style={{ height: "84%", overflowY: "scroll" }}>
          {this.props.friends.map((friend, index) => {
            const username = friend.webId.split(".")[0].replace("https://", "");
            return (
              <Tab.Pane eventKey={"#" + username} key={index} style={{height: "100%"}}>
                <EmptyChat nomessages/>
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
      <Tab.Content className={styles.scrollDiv} id="scrollDiv" style={{ height: "calc(100% - 120px)", overflowY: "auto", boxShadow:"4px 2px 4px rgba(0, 0, 0, 0.5)"}}>
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
