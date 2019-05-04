import React from "react";
import auth from "solid-auth-client";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import ChatPage from "./components/stateful_components/ChatPage";
import NavBar from "./components/functional_components/NavBar";
import GreetPage from "./components/functional_components/GreetPage/GreetPage";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      webId: undefined
    };
  }

  async login() {
    const session = await auth.currentSession();
    if (!session) {
      await auth.login("https://solid.community");
    } else {
      this.setState({
        webId: session.webID
      });
    }
  }

  logout() {
    auth.logout().then(() => {
      this.setState({
        webId: undefined
      });
    });
  }

  componentDidMount() {
    auth.trackSession(session => {
      if (!session) {
        console.log("You are logged out...");
      } else {
        console.log("You are logged in... Fetching your data now");
        this.setState({
          webId: session.webId
        });
      }
    });
  }

  render() {
    console.log("Rerendered")
    return (
      <div style={{ height: "100%" }}>
        <NavBar
          onClick={
            this.state.webId ? this.logout.bind(this) : this.login.bind(this)
          }
          webId={this.state.webId}
        />
        <BrowserRouter>
            <Switch>
              <div style={{ height: "calc(100vh - 90px)" }}>
                <Route path="/" render={() => this.state.webId ? <ChatPage /> : <GreetPage onClick={this.login.bind(this)}/>} />
              </div>
            </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
