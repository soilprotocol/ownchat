import React from "react";
import FormControl from "react-bootstrap/FormControl";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import styles from './ChatInput.module.css';

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

    keyPress(e){
      if(e.keyCode == 13 && !e.shiftKey){
        e.preventDefault();
        this.sendMessage();
      }
    }

    sendMessage(){
      this.props.onClick(this.state.message);
      this.setState({
        message:""
      })
    }

    render(){
        return (
          <Row className={styles.container}>
            <Col lg="9">
              <FormControl
                className={styles.input}
                placeholder="Enter your message"
                rows="2"
                as="textarea"
                value={this.state.message}
                onKeyDown={this.keyPress.bind(this)}
                onChange={this.changeMessage.bind(this)}
              />
            </Col>
            <Col lg="3">
              {this.state.message !== "" ? (
                <Button onClick={this.sendMessage.bind(this)} message={this.state.message}>
                  Send
                </Button>
              ) : (
                <Button disabled>Send</Button>
              )}
            </Col>
          </Row>
        );
    }
};

export default ChatInput;
