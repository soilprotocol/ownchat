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

    render(){
        return (
          <Row className={styles.container}>
            <Col lg="9">
              <FormControl
                className={styles.input}
                placeholder="Enter your message"
                rows="2"
                as="textarea"
                onChange={this.changeMessage.bind(this)}
              />
            </Col>
            <Col lg="3">
              {this.state.message !== "" ? (
                <Button onClick={this.props.onClick} message={this.state.message}>
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
