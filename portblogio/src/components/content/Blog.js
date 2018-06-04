import React, { Component } from 'react';
import { Switch, Route, Link } from 'react-router-dom'
import { Grid, Menu, Segment } from 'semantic-ui-react'


import Post from './Post'
import PostList from './PostList';

const BlogCategories = [ 
                        { key: 'general', value: 'Общее'},
                        { key: 'games', value: 'Игры'},
                        { key: 'code', value: 'Кодинг'},
                       ]
                        

class Blog extends Component {

    state = { currentCategory: 'all' }


    setCategory = (name) => {
        if (this.state.currentCategory !== name) this.setState({currentCategory: name})
    }

    checkCategoryFromLink = () => {
        
        // Мне НАСТОЛЬКО лень подключать реакт ради одного действия, да.

        var inputString = this.props.location.pathname;
        var splitLink = inputString.split('/')
        if (splitLink.length === 2) 
            this.setState ({currentCategory: 'all'});
        else
            if (splitLink[2] === 'category')
                this.setState ({currentCategory: splitLink[3]});
            
    }

    componentDidMount() {
        this.checkCategoryFromLink();
    }
    render(){
        //const {match, location} = this.props;
        const {match} = this.props;

         /*
            <nav>
                    <ul>
                        {posts.map((data, index) =>
                        <li key = {Math.random()} >
                        <Link to = {testLink + '/post/' + data._id}>
                        {data.title}
                        </Link>
                        </li>)
                        }
                    </ul>
                </nav> 


                <Switch>
                    <Route path={testLink + '/post/:post'} component={Post}/>
                </Switch>

                    <li key = {Math.random()} >
                        <Link to = {match.url}>Все посты</Link>
                    </li>

                    {BlogCategories.map((data, index) =>
                        <li key = {Math.random()} >
                            <Link to = {match.url + '/category/' + data.key}>
                                {data.value}
                            </Link>
                        </li>)
                    }

         */

        
        var postsList = <Switch>
                            <Route path={match.url} exact component={PostList}/>
                            <Route path={match.url + '/category/:category'} exact component={PostList}/>
                        </Switch>
        
        
        return(
            <div id  = 'Blog' >    

                <div id = 'CategoryNavigation'>

                    <Link to={match.url}>
                        <div className = {'CategoryLink ' + ((this.state.currentCategory === 'all') ? 'CategoryLinkSelected' : 'CategoryLinkNotSelected') }  
                             onClick = {() => this.setCategory('all')} >Все посты</div>
                    </Link>

                    {BlogCategories.map((data, index) =>
                        <Link key = {Math.random()} to = {match.url + '/category/' + data.key}>
                            <div className = {'CategoryLink ' + ((this.state.currentCategory === data.key) ? 'CategoryLinkSelected' : 'CategoryLinkNotSelected') }
                                 onClick = {() => this.setCategory(data.key)}>
                                {data.value}
                            </div>
                        </Link>)
                    }
                </div>

                <div id = 'PostList'>
                    {postsList}
                </div>

                <div id = 'PostText'>
                    <Switch>
                        <Route path={'/blog/post/:post'} component={Post}/>
                    </Switch>
                </div>

            </div>
        )
    }
}

export default Blog;