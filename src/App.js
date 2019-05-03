import React from "react";
import auth from "solid-auth-client";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import ChatPage from "./components/stateful_components/ChatPage";
import NavBar from "./components/functional_components/NavBar";

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
    return (
      <div>
        <NavBar
          onClick={
            this.state.webId ? this.logout.bind(this) : this.login.bind(this)
          }
          webId={this.state.webId}
        />
        <BrowserRouter>
          <div>
            <Switch>
              <Route path="/" render={() => <ChatPage />} />
            </Switch>
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
