import React, { Component } from 'react';
import {  Link } from 'react-router-dom'
import axios from 'axios';
import { Button, Icon, Divider } from 'semantic-ui-react'

//Код в этом файле - это грех.
//Почти каждая строчка - оскорбительна и греховна.
//«Ленивый работник – все равно что разрушитель» (18:10)
//// Update!
//// Все уже не так плохо, я много поправил и переписал нормально.
//// Кроме вот этого. Вот это нужно в отдельный файлик чтоль...

const BlogCategories = [ 
    { key: 'all', value: 'Все посты'},
    { key: 'general', value: 'Общее'},
    { key: 'games', value: 'Игры'},
    { key: 'code', value: 'Кодинг'},
   ]


const TextPreviewLenght = 50;

class PostList extends Component {

    constructor(props) {

        super(props);
    
        this.state = {
            categorySelected: '',
            currentPage: 1,
            totalPages: 1,
            posts: [] 
        };
    
    }


    componentDidUpdate(prevProps) {
        console.log('Update must be here')
        this.postManager();
        
    }

    componentDidMount() {
        console.log('Mount must be here')
        this.postManager();
        
    }


    getPosts = (category, skip, limit) => {

        if (category !== 'all')         
            axios.post('http://192.168.1.30:4000/getincategory', { skip: skip, limit: limit, category: category}).then(response => {
                this.setState({posts:response.data});
            })
          .catch(error =>  { console.log(error);});

        else 
            axios.post('http://192.168.1.30:4000/getposts', { skip: skip, limit: limit }).then(response => {
                this.setState({posts:response.data});
            })
          .catch(error =>  {console.log(error);});

    }

    calculatePages = (category) => {
        if (category !== 'all')
            axios.post('http://192.168.1.30:4000/countincategory', {category: category}).then(
                res => {
                    this.setState( { totalPages: Math.ceil(res.data / 10) })
                    console.log('Pages: ' + Math.ceil(res.data / 10))
                }
            )
        else 
            axios.get('http://192.168.1.30:4000/getpostscount').then(
                res => {
                    this.setState( { totalPages: Math.ceil(res.data / 10) })
                    console.log('Pages: ' + Math.ceil(res.data / 10))
                }
            )
    }

    changePage = (forward) => {

        
        var currentPage = this.state.currentPage;
        console.log('===== ' + this.state.categorySelected)
    
        if ( (forward && currentPage < this.state.totalPages) || (!forward && currentPage > 1)){ 

            if (forward) currentPage ++;
            else currentPage--;
        
            this.setState({currentPage: currentPage});
            this.getPosts(this.state.categorySelected,  10 * (currentPage-1), 10 );
        }

        else console.log("You can't do that")
    }

    postManager = () => {

        //Some GOTO-style vars. Because I'm really tired...
        var categoryChanged = false;
        var pageChanged = false;

        //Checking and category
        const {match} = this.props;
        var category;
        if (match.params.category) 
            category = match.params.category;
        else 
            category = 'all';

        if (category !== this.state.categorySelected) {
            this.setState({categorySelected: category});
            categoryChanged = true;
        }
        //EOB

        //Get posts and pages if needed
        if (categoryChanged){
            this.getPosts(category, 0, 10);
            this.calculatePages(category);
            this.setState({currentPage: 1});
        }

    }

   render(){
        //const {match, location} = this.props;

        //Х.Х.И.В.П
        var catCheck = BlogCategories.find(input => input.key===this.state.categorySelected);
        var catOutput = 'Loading...';
        if (catCheck !== undefined) catOutput = catCheck.value;


        return(
            <div id = 'PostListContainer' >
            <div id = 'CategoryHeader'>
                <p>{catOutput}</p>
            </div>

            <div id = 'ActuallyThisIsARealPostListAndFuckYouAnyway'>
            {this.state.posts.map((data, index) =>
                <Link to = {'/blog/post/' + data._id} key = {data._id}>

                <div className = 'PostPreviewContainer' style = {{
                        backgroundImage: 'url(' + data.header + ')',
                        backgroundPosition: 'center center',
                        backgroundSize: 'cover'}}>
                    <div className = 'PostHeaderContainer'>
                        <div className = 'PostTitle'>
                            {data.title} 
                        </div>
                        <div className = 'PostDescriptionMeta'>
                            <div className = 'PostDescriptionDate'>{data.date}</div>
                            @
                            <div className = 'PostDescriptionCategory'>
                            {data.category}
                            </div>
                        </div>

                    </div>


                </div>
                
                </Link>)
            }
            </div>


            <Divider horizontal>Страницы: {this.state.currentPage} / {this.state.totalPages}</Divider>

            <div id = 'NavigationButtonsContainer'>
                <Button icon labelPosition='left' onClick = {() => this.changePage(false)}>
                    Назад
                    <Icon name='left arrow' />
                </Button>

                <Button icon labelPosition='right' onClick = {() => this.changePage(true)}>
                    Вперед
                    <Icon name='right arrow' />
                </Button>
            </div>

            </div>
        )
   }
}

export default PostList;