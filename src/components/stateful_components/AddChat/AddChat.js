import React from "react";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

class AddChat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newChat: "",
      canAddFriend: false
    };
  }

  changeChatToAdd(e) {
    var xhr = new XMLHttpRequest();
    const url = e.target.value;
    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200 && this.state.canAddFriend === false) {
          this.setState({
            newChat: url,
            canAddFriend: true
          });
        } else {
          this.setState({
            canAddFriend: false
          });
        }
      }
    };
    const urlRegExp = new RegExp(/(\w+(:\/\/){1})(\w+\.)(\w+\.)(\w+\/)+/g);
    if (urlRegExp.test(e.target.value)) {
      xhr.open("GET", url);
      xhr.send();
    }

    var format = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    if (format.test(e.target.value) === false){
      const alturl = "https://" + e.target.value + ".solid.community/profile/card#me";
      xhr.open("GET", alturl);
      xhr.send();
    }
  }

  render() {
    return (
      <Row style={{ margin: "5%" }}>
        <Col lg="8">
          <FormControl
            placeholder="Add a new chat:"
            onChange={this.changeChatToAdd.bind(this)}
          />
        </Col>
        <Col lg="2">
        {this.state.canAddFriend ? <Button onClick={this.props.onClick} webId={this.state.newChat}>+</Button> : <Button disabled>+</Button>}
        </Col>
        <Col lg />
      </Row>
    );
  }
}

export default AddChat;
