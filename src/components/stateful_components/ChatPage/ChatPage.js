import React from "react";
import auth from "solid-auth-client";
import rdf from "rdflib";
import FriendsList from "../../functional_components/FriendsList";
import Tab from "react-bootstrap/Tab";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

const LDP = new rdf.Namespace("http://www.w3.org/ns/ldp#");
const RDF = new rdf.Namespace("http://www.w3.org/1999/02/22-rdf-syntax-ns#");
const ACT = new rdf.Namespace("https://www.w3.org/ns/activitystreams#");
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
      friends: []
    };
  }

  fetchUser() {
    auth.trackSession(session => {
      if (session) {
        console.log("You are logged in... Fetching your data now");
        this.setState({
          webId: session.webId
        });
        this.fetchFriends();
        //this.fetchMessages();
      }
    });
  }

  fetchFriends() {
    const store = rdf.graph();
    const fetcher = new rdf.Fetcher(store);

    const webId = this.state.webId;

    const permissionStore = rdf.graph();
    const permissionFetcher = new rdf.Fetcher(permissionStore);

    let viewerNode = webId.replace("card#me", "card.acl#viewer");
    permissionFetcher.load(viewerNode);

    fetcher.load(webId).then(response => {
      const friendsWebId = store.each(rdf.sym(webId), FOAF("knows"));

      const friends = friendsWebId.map(friend => {
        return fetcher.load(friend.value).then(() => {
          console.log("Fetched " + friend.value + "'s Profile");
          const friendName = store.any(rdf.sym(friend.value), FOAF("name"));

          var friendPicture = store.any(
            rdf.sym(friend.value),
            VCARD("hasPhoto")
          );
          friendPicture = friendPicture ? friendPicture.value : "";

          const friendAccess =
            permissionStore.statementsMatching(
              viewerNode,
              ACL("agent"),
              rdf.sym(friend.value)
            ).length > 0
              ? true
              : false;
          //console.log(friend.value, friendAccess)
          return {
            name: friendName.value,
            webId: friend.value,
            access: friendAccess,
            picture: friendPicture
          };
        });
      });
      Promise.all(friends).then(results => {
        this.setState({ friends: results });
      });
    });
  }

  fetchMessages() {
    const store = rdf.graph();
    const fetcher = new rdf.Fetcher(store);

    const username = this.state.webId.split(".")[0].replace("https://", "");
    const userInboxAddress = this.state.webId.replace(
      "profile/card#me",
      "inbox/"
    );

    const friendsName = window.location.href.split("#")[1];
    const friendsWebId = this.state.webId.replace(username, friendsName);
    const friendsInboxAddress = friendsWebId.replace(
      "profile/card#me",
      "inbox/" + username
    );

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
              created: messageTimestampValue.replace("Z", "").split("T")
            };
          });
        this.setState({
          ownMessages: ownMessages
        });
      })
      .catch(err => {
        this.setState({
          ownMessages: []
        });
        console.log("You haven't send any messages yet!");
      });

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
        this.setState({
          friendMessages: friendMessages
        });
      })
      .catch(err => {
        this.setState({
          friendMessages: []
        });
        console.log("This friend has no chat with you yet.");
      });
  }

  sendMessage() {
    const store = rdf.graph();
    const fetcher = new rdf.Fetcher(store);
    const updater = new rdf.UpdateManager(store);

    const username = this.state.webId.split(".")[0].replace("https://", "");
    const userInboxAddress = this.state.webId.replace(
      "profile/card#me",
      "inbox/"
    );

    const friendsName = window.location.href.split("#")[1];
    const friendsWebId = this.state.webId.replace(username, friendsName);

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
          rdf.st(
            newMessage,
            SIOC("content"),
            rdf.lit(this.state.newMessage),
            newChat.doc()
          )
        ];

        updater.update(del, ins, (uri, ok, message) => {
          if (ok) {
            console.log("Message sent!");
          } else alert(message);
        });
      })
      .catch(err => {
        const newChat = rdf.sym(userInboxAddress + friendsName);
        const user = rdf.sym(this.state.webId);
        const friend = rdf.sym(friendsWebId);
        const newAclFile = rdf
          .sym(userInboxAddress + friendsName + ".acl")
          .doc();
        const viewerNode = rdf.sym(
          userInboxAddress + friendsName + ".acl#viewer"
        );
        const ownerNode = rdf.sym(
          userInboxAddress + friendsName + ".acl#owner"
        );

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
            console.log(
              "Created new chatfile for chat data with " + friendsName
            );
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
          if (ok) console.log("New ACL File has been created");
          else console.log(message);
        });

        //Send message
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
          rdf.st(
            newMessage,
            SIOC("content"),
            rdf.lit(this.state.newMessage),
            newChat.doc()
          )
        ];

        updater.update(del, ins, (uri, ok, message) => {
          if (ok) {
            console.log("Message sent!");
          } else alert(message);
        });
      });
  }

  selectChat(e) {
    //console.log(e.target.getAttribute("index"))
    // if (e.target.getAttribute("class") == "row") {
    //   console.log(e.target.getAttribute("style"))
    // }
    console.log(e.target)
  }

  componentDidMount() {
    this.fetchUser();
  }

  render() {
    console.log(this.state);
    return (
      <Tab.Container>
        <Row>
        <Col lg />
        <Col lg="3">
          <FriendsList
            onClick={this.selectChat.bind(this)}
            friends={this.state.friends}
          />
        </Col>
        <Col lg="7">
        </Col>
        <Col lg />
        </Row>
      </Tab.Container>
    );
  }
}

export default ChatPage;
