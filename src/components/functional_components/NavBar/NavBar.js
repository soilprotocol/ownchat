import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { NavLink } from "react-router-dom";
import { Button } from "yoda-design-system";

const NavBar = props => {
  return (
    <div style={{paddingTop: "70px"}}>
      <Navbar bg="dark" variant="dark" fixed="top">
        <Navbar.Brand>OWNCHAT</Navbar.Brand>
        {/* <Nav>
        <NavLink to="/">Chat</NavLink>
      </Nav> */}
        <Button onClick={props.onClick}>{props.webId ? "Logout" : "Login"}</Button>
      </Navbar>
    </div>
  );
};

export default NavBar;