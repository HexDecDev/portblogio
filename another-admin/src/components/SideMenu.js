import React, { Component } from 'react';
import { Button, Label, Menu, Divider } from 'semantic-ui-react'

import PostLink from './SideMenu/PostLink'


class SideMenu extends Component {


    /*
                <Button.Group vertical>
                    {posts.map((data, index) =>
                    <PostLink 
                        data = {data}
                        key = {Math.random() + index}
                        changeActivePost = {this.props.changeActivePost}
                    />)
                }
                </Button.Group>
    */

   state = { activeItem: 'Void' }

    changeActiveMenu = (name) => {
        this.setState({activeItem: name})
    }


    defaultSelectionSetter = () => {
        console.log(this.props.activePostID)
        if (this.state.activeItem !== this.props.activePostID){
            console.log('asdsa')
            setTimeout(() => { this.changeActiveMenu(this.props.activePostID) }, 200);
        }
    }

    componentDidMount (){
        this.defaultSelectionSetter();
    }

    render(){



        var posts = this.props.posts;
    
        var out = '';
        if (!posts) out = 'No posts';
        else out = 'Yes posts';

        return(
            <div id = 'Side-menu'>


                <div id = 'Posts List'>
                    <Menu  secondary vertical inverted>
                        
                    <Menu.Item> 
                        <Button inverted color='blue' fluid onClick = {this.props.clearID} >Новый пост</Button>
                    </Menu.Item> 

                        {posts.map((data, index) =>
                        <PostLink 
                            data = {data}
                            key = {Math.random() + index}
                            changeActivePost = {this.props.changeActivePost}
                            changeActiveMenu = {this.changeActiveMenu}
                            activeItem = {this.state.activeItem}
                        />)
                        }

                    <Menu.Item> 
                    
                    <Button.Group size='tiny' fluid>

                        <Button 
                            color='grey'
                            content='Назад' 
                            disabled = { (this.props.currentPage <= 1)}  
                            icon='left arrow' 
                            labelPosition='left'
                            onClick = { () => this.props.changePage(false)} 
                        />

                        <Button 
                            color='grey'
                            content='Вперед' 
                            disabled = { (this.props.currentPage === this.props.totalPages)}  
                            icon='right arrow' 
                            labelPosition='right' 
                            onClick = { () => this.props.changePage(true)} 
                        />

                        </Button.Group>
                        <Divider inverted horizontal>{this.props.currentPage} из {this.props.totalPages} </Divider>
                        <div id = 'Pagination'>
                            
                        </div>
                    </Menu.Item>  
                    
                    <Menu.Item> 
                        
                        
                    </Menu.Item> 

                    </Menu>
                </div>
                
                



                     
                
            <div id = 'Copyright'>Created by HxDx @ 2018</div>
            </div>
        );
    }
}


export default SideMenu;