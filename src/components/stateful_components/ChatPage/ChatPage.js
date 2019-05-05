import React from "react";
import auth from "solid-auth-client";
import rdf from "rdflib";
import FriendsList from "../../functional_components/FriendsList";
import Tab from "react-bootstrap/Tab";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import classNames from "classnames";
import ChatWindow from "../ChatWindow/ChatWindow";
import AddChat from "../AddChat/AddChat";
import ChatInput from "../ChatInput/ChatInput";
import EmptyChat from "../../functional_components/EmptyChat/EmptyChat";
import styles from "./ChatPage.module.css";

const LDP = new rdf.Namespace("http://www.w3.org/ns/ldp#");
const RDF = new rdf.Namespace("http://www.w3.org/1999/02/22-rdf-syntax-ns#");
//const ACT = new rdf.Namespace("https://www.w3.org/ns/activitystreams#");
const FOAF = new rdf.Namespace("http://xmlns.com/foaf/0.1/");
const VCARD = new rdf.Namespace("http://www.w3.org/2006/vcard/ns#");
const ACL = new rdf.Namespace("http://www.w3.org/ns/auth/acl#");
const MEET = new rdf.Namespace("http://www.w3.org/ns/pim/meeting#");
const DC = new rdf.Namespace("http://purl.org/dc/elements/1.1/");
const FLOW = new rdf.Namespace("http://www.w3.org/2005/01/wf/flow#");
const SIOC = new rdf.Namespace("http://rdfs.org/sioc/ns#");
const TERMS = new rdf.Namespace("http://purl.org/dc/terms/");

class ChatPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      webId: undefined,
      contacts: [],
      chats: [],
      ownMessages: undefined,
      friendMessages: undefined,
      messages: undefined,
      newContact: undefined,
      currentChat: window.location.href.split("#").length > 1 ? "#" + window.location.href.split("#")[1] : undefined
    };
  }

  fetchChats() {
    const store = rdf.graph();
    const fetcher = new rdf.Fetcher(store);

    const webId = this.state.webId;
    const inboxAddress = webId.replace("profile/card#me", "inbox/");

    fetcher.load(inboxAddress).then(() => {
      const inboxFiles = store.each(rdf.sym(inboxAddress), LDP("contains"));
      const chats = [];
      const chatChecks = [];
      inboxFiles.forEach(inboxFile => {
        const typeStore = rdf.graph();
        const typeFetcher = new rdf.Fetcher(typeStore);
        chatChecks.push(
          typeFetcher.load(inboxFile.value).then(() => {
            const chatBool = typeStore.any(null, RDF("type"), MEET("Chat"));
            if (chatBool) {
              const inboxFileValues = inboxFile.value.split("/");
              const contactName = inboxFileValues[inboxFileValues.length - 1];
              const contactWebId =
                "https://" + contactName + ".solid.community/profile/card#me";
              console.log(contactWebId);
              chats.push(contactWebId);
            }
          })
        );
      });
      Promise.all(chatChecks).then(results => {
        this.setState({
          chats: chats
        });
        this.fetchContacts();
        this.checkForMessages(chats);

        const currentChatName = window.location.href.split("#")[1];
        if (currentChatName) {
          const currentChatWebId = "https://" + currentChatName + ".solid.community/profile/card#me";
          if(chats.includes(currentChatWebId)){
            this.fetchMessages(currentChatWebId);
          }
        }
      });
    });
  }

  fetchContacts() {
    const store = rdf.graph();
    const fetcher = new rdf.Fetcher(store);

    const webId = this.state.webId;
    //const inboxAddress = webId.replace("profile/card#me", "inbox/");

    const permissionStore = rdf.graph();
    const permissionFetcher = new rdf.Fetcher(permissionStore);

    let viewerNode = webId.replace("card#me", "card.acl#viewer");
    permissionFetcher.load(viewerNode);

    const friends = this.state.chats.map(friend => {
      return fetcher.load(friend).then(() => {
        console.log("Fetched " + friend + "'s Profile");
        const friendName = store.any(rdf.sym(friend), FOAF("name"));

        var friendPicture = store.any(rdf.sym(friend), VCARD("hasPhoto"));
        friendPicture = friendPicture ? friendPicture.value : "";

        const friendAccess =
          permissionStore.statementsMatching(
            viewerNode,
            ACL("agent"),
            rdf.sym(friend)
          ).length > 0
            ? true
            : false;
        //console.log(friend.value, friendAccess)
        return {
          name: friendName.value,
          webId: friend,
          access: friendAccess,
          picture: friendPicture
        };
      });
    });
    Promise.all(friends).then(results => {
      this.setState({ contacts: results });
    });
  }

  fetchMessages(friendsWebId) {
    const store = rdf.graph();
    const fetcher = new rdf.Fetcher(store);

    const username = this.state.webId.split(".")[0].replace("https://", "");
    const userInboxAddress = this.state.webId.replace(
      "profile/card#me",
      "inbox/"
    );

    const friendsName = friendsWebId.split(".")[0].replace("https://", "");
    const friendsInboxAddress = friendsWebId.replace(
      "profile/card#me",
      "inbox/" + username
    );

    const messagePromises = [
      fetcher
        .load(userInboxAddress + friendsName)
        .then(response => {
          const userInbox = rdf.sym(userInboxAddress + friendsName);
          const ownMessages = store
            .each(userInbox, FLOW("message"))
            .map(message => {
              message = rdf.sym(message);
              const messageContent = store.any(message, SIOC("content"));
              const messageTimestamp = store.any(message, DC("created"));
              const altMessageTimestamp = messageTimestamp
                ? ""
                : store.any(message, TERMS("created"));
              const messageContentValue = messageContent.value;
              const messageTimestampValue = messageTimestamp
                ? messageTimestamp.value
                : altMessageTimestamp.value;
              return {
                content: messageContentValue,
                created: messageTimestampValue
              };
            });
          console.log(ownMessages);
          return ownMessages;
        })
        .catch(err => {
          console.log("You haven't send any messages yet!");
        })
    ];

    messagePromises.push(
      fetcher
        .load(friendsInboxAddress)
        .then(response => {
          const friendMessages = store
            .each(rdf.sym(friendsInboxAddress), FLOW("message"))
            .map(message => {
              message = rdf.sym(message.value);
              const messageContent = store.any(message, SIOC("content"));
              const messageTimestamp = store.any(message, DC("created"));
              const altMessageTimestamp = messageTimestamp
                ? ""
                : store.any(message, TERMS("created"));
              const messageContentValue = messageContent.value;
              const messageTimestampValue = messageTimestamp
                ? messageTimestamp.value
                : altMessageTimestamp.value;
              return {
                content: messageContentValue,
                created: messageTimestampValue
              };
            });
          return friendMessages;
        })
        .catch(err => {
          console.log("This friend has no chat with you yet.");
        })
    );

    console.log(messagePromises);
    Promise.all(messagePromises).then(results => {
      console.log(results);
      const messages = this.sortMessages(results[0], results[1]);
      this.setState({ messages: messages });
    });

    console.log(this.state.messages);
  }

  sendMessage(e) {
    const message = e.target.getAttribute("message");

    const store = rdf.graph();
    const fetcher = new rdf.Fetcher(store);
    const updater = new rdf.UpdateManager(store);

    //const username = this.state.webId.split(".")[0].replace("https://", "");
    const userInboxAddress = this.state.webId.replace(
      "profile/card#me",
      "inbox/"
    );

    const friendsName = window.location.href.split("#")[1];
    //const friendsWebId = this.state.webId.replace(username, friendsName);

    fetcher
      .load(userInboxAddress + friendsName)
      .then(response => {
        const newChat = rdf.sym(userInboxAddress + friendsName);
        const user = rdf.sym(this.state.webId);
        const newMessage = new rdf.sym(
          userInboxAddress +
            friendsName +
            "#Msg" +
            Math.floor(Math.random() * 1231231241)
        );

        let del = [];
        let ins = [
          rdf.st(newChat, FLOW("message"), newMessage, newChat.doc()),
          rdf.st(newMessage, DC("created"), new Date(), newChat.doc()),
          rdf.st(newMessage, FOAF("maker"), user, newChat.doc()),
          rdf.st(newMessage, SIOC("content"), rdf.lit(message), newChat.doc())
        ];

        updater.update(del, ins, (uri, ok, message) => {
          if (ok) {
            console.log("Message sent!");
            const friendsWebId = "https://" + friendsName + ".solid.community/profile/card#me"
            this.fetchMessages(friendsWebId);
          } else alert(message);
        });
      })
      .catch(err => {
        console.log(
          "Could not find inbox... Maybe try to re-add this friend to your chat"
        );
      });
  }

  addChat(e) {
    const store = rdf.graph();
    const fetcher = new rdf.Fetcher(store);
    const updater = new rdf.UpdateManager(store);

    const username = this.state.webId.split(".")[0].replace("https://", "");
    const userInboxAddress = this.state.webId.replace(
      "profile/card#me",
      "inbox/"
    );

    const friendsName = e.target
      .getAttribute("webId")
      .split(".")[0]
      .replace("https://", "");
    const friendsWebId = this.state.webId.replace(username, friendsName);

    fetcher.load(userInboxAddress + friendsName).catch(err => {
      const newChat = rdf.sym(userInboxAddress + friendsName);
      const user = rdf.sym(this.state.webId);
      const friend = rdf.sym(friendsWebId);
      const newAclFile = rdf.sym(userInboxAddress + friendsName + ".acl").doc();
      const viewerNode = rdf.sym(
        userInboxAddress + friendsName + ".acl#viewer"
      );
      const ownerNode = rdf.sym(userInboxAddress + friendsName + ".acl#owner");

      //Create new chat file
      const newChatTriples = [
        rdf.st(newChat, RDF("type"), MEET("Chat"), newChat.doc()),
        rdf.st(newChat, DC("title"), rdf.lit("Chat", "en"), newChat.doc()),
        rdf.st(newChat, DC("created"), new Date(), newChat.doc())
      ];

      updater.put(newChat, newChatTriples, "text/turtle", function(
        uri,
        ok,
        message
      ) {
        if (ok)
          console.log("Created new chatfile for chat data with " + friendsName);
        else alert(message);
      });

      //Create new ACL File too

      const newACLTriples = [
        rdf.st(ownerNode, ACL("agent"), user, newAclFile),
        rdf.st(ownerNode, ACL("accessTo"), newChat, newAclFile),
        rdf.st(ownerNode, ACL("mode"), ACL("Control"), newAclFile),
        rdf.st(ownerNode, ACL("mode"), ACL("Read"), newAclFile),
        rdf.st(ownerNode, ACL("mode"), ACL("Write"), newAclFile),
        rdf.st(viewerNode, ACL("agent"), friend, newAclFile),
        rdf.st(viewerNode, ACL("accessTo"), newChat, newAclFile),
        rdf.st(viewerNode, ACL("mode"), ACL("Read"), newAclFile)
      ];

      updater.put(newAclFile, newACLTriples, "text/turtle", function(
        uri,
        ok,
        message
      ) {
        if (ok) {
          console.log("New ACL File has been created");
        } else {
          console.log(message);
        }
      });
      this.fetchChats();
    });
  }

  listenForMessage(inboxAddress, username) {
    var socket = new WebSocket(inboxAddress.replace("https", "wss").replace("/inbox/" + username, ""));
      socket.onopen = function() {
        this.send("sub " + inboxAddress);
        console.log("sub to chat-socket");
      };
      socket.onmessage = function(msg) {
        console.log(msg);
        if (msg.data && msg.data.slice(0, 3) === "pub") {
          const username = inboxAddress.split(".")[0].replace("https://", "");
          const userWebId =
            "https://" + username + ".solid.community/profile/card#me";
          const currentChatName = window.location.href.split("#") ? window.location.href.split("#")[1] : undefined;
          if (currentChatName === username){
            this.fetchMessages(userWebId);
          }
        }
      }.bind(this);
  }

  checkForMessages(chats) {
    console.log(chats);
    const store = rdf.graph();
    const fetcher = new rdf.Fetcher(store);

    const username = this.state.webId.split(".")[0].replace("https://", "");
    const userInboxAddress = this.state.webId.replace(
      "profile/card#me",
      "inbox/"
    );

    const inboxAddressess = chats
      ? chats.map(chat => {
          const chatName = chat.split(".")[0].replace("https://", "");
          const inboxAddress =
            userInboxAddress.replace(username, chatName) + username;
          return inboxAddress;
        })
      : undefined;

    inboxAddressess.forEach(inboxAddress => {
      this.listenForMessage(inboxAddress, username)
    });
  }

  fetchUser() {
    auth.trackSession(session => {
      if (session) {
        console.log("You are logged in... Fetching your data now");
        this.setState({
          webId: session.webId
        }, () => {console.log("feeeeeeeeeeeeeeeeeeeeeeeeeeeeeetch"); this.fetchChats()});
        
        // setInterval(() => {
        //   this.fetchChats();
        // }, 5000)
        //this.fetchMessages();
      }
    });
  }

  componentDidMount() {
    this.fetchUser();
  }

  sortMessages(ownMessages, friendMessages) {
    if (ownMessages !== undefined || friendMessages !== undefined) {
      const messages = [];
      for (var message in ownMessages) {
        messages.push({ message: ownMessages[message], from: "me" });
        //console.log(new Date(ownMessages[message].created))
      }

      for (message in friendMessages) {
        messages.push({ message: friendMessages[message], from: "friend" });
      }

      messages.sort(function(a, b) {
        return new Date(a.message.created) - new Date(b.message.created);
      });

      return messages;
    } else {
      return undefined;
    }
  }

  render() {
    const messages = this.state.messages;
    console.log(this.state)
    return (
      <Row className={styles.container}>
        <Tab.Container defaultActiveKey={this.state.currentChat} >
          <Col lg="4">
            <AddChat onClick={this.addChat.bind(this)} />
            <FriendsList
              onClick={this.fetchMessages.bind(this)}
              friends={this.state.contacts}
            />
          </Col>
          <Col
            lg="8"
            className={classNames(styles.container, styles.borderLeft)}
          >
            {this.state.messages ? (
              <div className={styles.container}>
                <ChatWindow webId={this.state.webId}fetchMessage={this.fetchMessages.bind(this)} friends={this.state.contacts} messages={messages} />
                <ChatInput onClick={this.sendMessage.bind(this)} />
              </div>
            ) : (
              <EmptyChat />
            )}
          </Col>
        </Tab.Container>
      </Row>
    );
  }
}

export default ChatPage;
