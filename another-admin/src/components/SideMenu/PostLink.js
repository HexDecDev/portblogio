import React, { Component } from 'react';
import { Button, Menu } from 'semantic-ui-react'

const coloringOptions = [ { value: 'general', color: 'blue' }, { value: 'code', color: 'violet' }, { value: 'games', color: 'teal' }  ]

// <Button  fluid onClick = { () => this.props.changeActivePost(this.props.data.title) } >{this.props.data.title}</Button>
class PostLink extends Component {

    
    handleItemClick= (e, { name }) => {

        this.props.changeActivePost(this.props.data.title);
        this.props.changeActiveMenu(this.props.data._id);
    }

    render(){
        

        return(
            <Menu.Item name={this.props.data._id} active={this.props.activeItem === this.props.data._id} onClick={this.handleItemClick} content = {this.props.data.title} />
        )
    }
}


export default PostLink;

