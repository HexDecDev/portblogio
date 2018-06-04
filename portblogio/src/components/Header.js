import React, { Component } from 'react';
import { Link } from 'react-router-dom';


class Header extends Component {

    /*
                <div id = 'LogoBlock'>
                    HexDec
                </div>



                <div id = 'NavBlock'>
                    <Link to='/'>
                        <div className = 'HedaerLink'>Home</div>
                    </Link>
                    <Link to='/blog'>
                        <div className = 'HedaerLink'>Blog</div>
                    </Link>
                    <Link to='/contacts'>
                        <div className = 'HedaerLink'>Contacts</div>
                    </Link>
                </div>

                            <div id = 'Header'>

                <div id = 'NavBlock'>
                    {btn}
                </div>

            </div>
    */

    
    state = { activeItem: 'home' }

    handleItemClick = (e, { name }) => {
        console.log(name);
        this.setState({ activeItem: name });
        var gotolink = '/' + name;
        window.location.href = gotolink;
    }


    render(){

        return(
            <div id = 'Header'>

                <div id = 'LogoZone'>
                    HexDec
                </div>


                <div id = 'NavBlock'>
                        <Link to='/'>
                            <div className = 'HedaerLink'>Home</div>
                        </Link>
                        <Link to='/blog'>
                            <div className = 'HedaerLink'>Blog</div>
                        </Link>
                        <Link to='/contacts'>
                            <div className = 'HedaerLink'>Contacts</div>
                        </Link>
                </div>

            </div>
        )
    }
}

export default Header;