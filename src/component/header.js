import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import { onLogoutUser } from '../action'

import {
    Button,
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem } from 'reactstrap';

    class Header extends Component {
        constructor(props) {
            super(props);
        
            this.toggle = this.toggle.bind(this);
            this.state = {
              isOpen: false
            };
          }
          toggle() {
            this.setState({
              isOpen: !this.state.isOpen
            });
          }

        onButtonClick = () => {
            this.props.onLogoutUser()
        }
    
        render () {
            if(this.props.user.username === ''){
                // Render ketika belum login
                return (
                    <div>
                        <Navbar color="light" light expand="md">
                        <NavbarBrand href="/">Simple E-Commerce</NavbarBrand>
                        <NavbarToggler onClick={this.toggle} />
                        <Collapse isOpen={this.state.isOpen} navbar>
                            <Nav className="ml-auto" navbar>
                            <NavItem>
                                <Link to='/' >All Products</Link>
                            </NavItem>
                            <NavItem>
                                <Link to='/register'>
                                    <Button color="primary" className="mx-3">Register</Button>
                                </Link>
                            </NavItem>
                            <NavItem>
                                <Link to='/login' >
                                    <Button color="success">Login</Button>
                                </Link>
                            </NavItem>
                            </Nav>
                        </Collapse>
                        </Navbar>
                    </div>
                )
            } 
    
            // Render setelah login
            return (
                <div>
                    <Navbar color="light" light expand="md">
                        <NavbarBrand href="/">Simple E-Commerce</NavbarBrand>
                    <NavbarToggler onClick={this.toggle} />
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav className="ml-auto" navbar>
                        <NavItem className='mt-2 ml-auto'>
                            <Link to='/' >All Products</Link>
                        </NavItem>
                        <NavItem className='mt-2 ml-auto'>
                        <Link to='/checkout' >
                            <button className = 'btn btn-primary ml-1 mt-auto'>
                            <img id='cart' src='https://image.flaticon.com/icons/svg/34/34568.svg'></img> Shopping Cart
                            </button>
                        </Link>
                        </NavItem>
                        <UncontrolledDropdown nav inNavbar>
                        <DropdownToggle nav caret>
                            Welcome, {this.props.user.username}
                        </DropdownToggle>
                        <DropdownMenu right>
                            <DropdownItem>
                            <Link to='/manageProduct' >Manage Product</Link>
                            </DropdownItem>
                            {/* <DropdownItem>
                            <Link to='/checkout' >Check-out</Link>
                            </DropdownItem> */}
                            <DropdownItem divider />
                            <Link to='/login' >
                            <Button className="dropdown-item" onClick={this.onButtonClick}>
                            Logout
                            </Button>
                            </Link>
                        </DropdownMenu>
                        </UncontrolledDropdown>
                        </Nav>
                    </Collapse>
                    </Navbar>
                </div>
                
                        
              );
        }
    }
    
    const mapStateToProps = state => {
        return {
            user: state.auth // {id, username}
        }
    }
    
    export default connect(mapStateToProps,{onLogoutUser})(Header)