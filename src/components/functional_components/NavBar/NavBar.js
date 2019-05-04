import React from "react";
import Navbar from "react-bootstrap/Navbar";
import { Button } from "yoda-design-system";

const NavBar = props => {
  return (
    <div style={{height: "60px"}}>
      <Navbar bg="dark" variant="dark" fixed="top">
        <Navbar.Brand style={{marginLeft: "auto", marginRight: "auto"}}>OWNCHAT</Navbar.Brand>
        {/* <Nav>
        <NavLink to="/">Chat</NavLink>
      </Nav> */}
        <Button onClick={props.onClick}>{props.webId ? "Logout" : "Login"}</Button>
      </Navbar>
    </div>
  );
};

export default NavBar;
