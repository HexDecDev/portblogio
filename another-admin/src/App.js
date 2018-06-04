import React, { Component } from 'react';
import { Form, TextArea, Button } from 'semantic-ui-react'


import './App.css';
import './Modal.css';




import axios from 'axios';

import SideMenu from './components/SideMenu'
import Editor from './components/Editor'
import PostPreview from './components/PostPreview'


class App extends Component {

  constructor(props) {

    super(props);

    this.state = {
      inputValue: '',
      titleValue: '',
      coverValue: '',
      categoryValue: '',
      activePostID: '',
      imHere: false,
      key: '',
      posts: [],
      totalPages: '',
      currentPage: 1
    };

  }



  handleChangeEditor = (e, {value}) => {
    console.log(e.target.name);
    localStorage.setItem(e.target.name, value);
    this.setState({ [e.target.name]: value })
  }

  handleChangeDropdown = (e, {value}) => {
    console.log(value);
    localStorage.setItem('categoryValue', value);
    this.setState({ categoryValue: value })
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  } 

  setEditorContent = (storageName) => {

    var storageData = localStorage.getItem(storageName);

    if (storageData !== null){
      this.setState({[storageName]: storageData });
      if (document.getElementById(storageName) !== null)document.getElementById(storageName).value = storageData;
    }
  }



  componentDidMount() {

    if (localStorage.getItem('sessionID')){
      this.checkLogin();
    }
    this.getPosts(0,10);
    this.calculatePages();
  }

  clearID = () => {
    console.log('ID cleared')
    this.setState( {activePostID: '', inputValue: '', titleValue: '', coverValue: '', categoryValue: ''} )
    
    localStorage.setItem('activePostID', '');
    localStorage.setItem('titleValue', '');
    localStorage.setItem('coverValue', '');
    localStorage.setItem('categoryValue', '');
    localStorage.setItem('inputValue', '');
    

  }

  workWithPost = () => {

    var config = { headers: { authorization: localStorage.getItem('sessionID') }}

    var title = this.state.titleValue;
    var post = this.state.inputValue;
    var header = this.state.coverValue;
    var category = this.state.categoryValue;
    var id = this.state.activePostID;
    

    //Check if exist

    if (id && id !== 'lock')
    axios.post('http://192.168.1.30:4000/getbyid',{ id: id}).then(res => {
      console.log('And here');
      if (res.data){ 

        console.log('Post found');
        if (title && post && header && category)
        axios.post('http://192.168.1.30:4000/edit', { id: id, title: title, post: post, header: header, category: category }, config) .then(response => {

          this.getPosts(0,10);
  
        }).catch(error =>  {
  
          console.log(error);
  
        });

        else console.log('not all fields complete')

      } 
      else {
        console.log('Post NOT found');
        

      }
    })

    else {
      console.log('new post');

      if (id === 'lock') console.log('Lockdown')
      else if (title && post && header && category)

      axios.post('http://192.168.1.30:4000/new', { title: title, post: post, header: header, category: category }, config) .then(response => {

        
        this.clearID();
        this.getPosts(0,10);

      }).catch(error =>  { console.log(error); });

      else console.log('not all fields complete')

    }


    
    
  }

  changeActivePost = (title) => {

    var config = { headers: { authorization: localStorage.getItem('sessionID') }}

    axios.post('http://192.168.1.30:4000/getbytitle', { title:title }, config).then(response => {

      localStorage.setItem('titleValue', response.data.title);
      localStorage.setItem('coverValue', response.data.header);
      localStorage.setItem('categoryValue', response.data.category);
      localStorage.setItem('inputValue', response.data.post);
      localStorage.setItem('activePostID', response.data._id);

      this.setState({activePostID: response.data._id});

      this.setterShortcut();

      console.log(response.data)

    })
    .catch(error =>  {

      console.log(error);

    });

  }


  deletePost = () => {
    var config = { headers: { authorization: localStorage.getItem('sessionID') }}

    if (this.state.activePostID) {

      console.log('Delete post: ' + this.state.activePostID)

      axios.post('http://192.168.1.30:4000/delete', { id: this.state.activePostID }, config).then(response => {

        this.clearID();
        this.calculatePages();
        this.getPosts(0,10);
  
      }).catch(error =>  {console.log(error);});
    }

  }

  changePage = (forward) => {

    var currentPage = this.state.currentPage;

    if (forward) currentPage ++;
    else currentPage--;


    this.setState({currentPage: currentPage});

    this.getPosts( 10 * (currentPage-1), 10 );



  }

  calculatePages = () => {
    axios.get('http://192.168.1.30:4000/getpostscount').then(res => this.setState( { totalPages: Math.ceil(res.data / 10) }))
  }

  
  getPosts = (skip, limit) => {

    var config = { headers: { authorization: localStorage.getItem('sessionID') }}

    axios.post('http://192.168.1.30:4000/getposts', { skip: skip, limit: limit }, config).then(response => {

      this.setState({posts:response.data});

    })
    .catch(error =>  {

      console.log(error);

    });
  }

  checkLogin = () => {

    var config = { headers: { authorization: localStorage.getItem('sessionID') }}

    axios.get('http://192.168.1.30:4000/check', config).then(response => {

        if (response.data) {
          this.setterShortcut();
        }

      }).catch();

  }
  
  setterShortcut = () => {

    this.setState({imHere: true});
    this.setEditorContent('inputValue');
    this.setEditorContent('titleValue');
    this.setEditorContent('coverValue');
    this.setEditorContent('categoryValue');
    this.setEditorContent('activePostID');
  }


  loginMe = () => {

    var config = { headers: { authorization: this.state.key }}

    if (this.state.key)
    axios.get('http://192.168.1.30:4000/login', config)
        .then(response => {
            if (response.data !== 'no') {
              localStorage.setItem('sessionID', response.data);
              this.setterShortcut();
            }
        })
        .catch();
  }


  logout = () => {
    localStorage.removeItem('sessionID');
    window.location.reload();
  }


  render() {
    

    var loggedIn = <div id = 'Editor-container'>
    
                      <SideMenu 
                          posts = {this.state.posts}
                          changeActivePost = {this.changeActivePost}
                          clearID = {this.clearID}
                          currentPage = {this.state.currentPage}
                          totalPages = {this.state.totalPages}
                          changePage = {this.changePage}
                          activePostID = {this.state.activePostID}
                      />
                      <Editor 
                          handleChangeEditor = {this.handleChangeEditor} 
                          handleChangeDropdown = {this.handleChangeDropdown}
                          dropdownValue = {this.state.categoryValue}
                          savePost = {this.workWithPost}
                          titleValue = {this.state.titleValue}
                          coverValue = {this.state.coverValue}
                          categoryValue = {this.state.categoryValue}
                          inputValue = {this.state.inputValue}
                          activePostID = {this.state.activePostID}
                          deletePost = {this.deletePost}
                          
                      />
                      <PostPreview 
                          text = {this.state.inputValue}
                          titleValue = {this.state.titleValue}
                          coverValue = {this.state.coverValue}
                      />
  
                    </div>


    var loginField =   
                        <Form onSubmit={this.loginMe} >
                        <Form.Field>
                          <label>Key</label>
                          <input placeholder='Key' 
                                 name = 'key' 
                                 value={this.state.key}  
                                 onChange={this.handleChange} 
                          />
                        </Form.Field>
                        <Button type='submit'>Submit</Button>
                      </Form>


    var renderMe = (this.state.imHere) ? loggedIn : loginField;


    return (
      <div className="App">

        <header className="App-header">
          <h1 className="App-title">Mah awesum blogue</h1>
        </header>
        {renderMe}


      </div>
    );
  }
}

export default App;
