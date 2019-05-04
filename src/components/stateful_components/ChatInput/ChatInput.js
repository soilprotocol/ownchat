import React from "react";
import FormControl from "react-bootstrap/FormControl";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

class ChatInput extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            message: ""
        }
    }

    changeMessage(e){
        this.setState({
            message: e.target.value
        })
        console.log(this.state)
    }

    render(){
        return (
          <Row style={{ margin: "2%" }}>
            <Col lg="8">
              <FormControl
                placeholder="Enter your message"
                as="textarea"
                onChange={this.changeMessage.bind(this)}
              />
            </Col>
            <Col lg="2">
              {this.state.message !== "" ? (
                <Button onClick={this.props.onClick} message={this.state.message}>
                  Send
                </Button>
              ) : (
                <Button disabled>Send</Button>
              )}
            </Col>
            <Col lg />
          </Row>
        );
    }
};

export default ChatInput;
