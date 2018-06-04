import React, { Component } from 'react';

import { Switch, Route } from 'react-router-dom'

//Subcomponents

import Home from './content/Home'
import Blog from './content/Blog'
import Contacts from './content/Contacts'

class Content extends Component {

    render(){
        return(
            <div id = 'Content'>
                <Switch>
                    <Route exact path='/' component={Home}/>
                    <Route path='/blog' component={Blog}/>
                    <Route path='/contacts' component={Contacts}/>
                </Switch>
            </div>
        )
    }
}

export default Content;