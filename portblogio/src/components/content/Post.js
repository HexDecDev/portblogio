import React, { Component } from 'react';
import axios from 'axios';

import Highlight from 'react-highlight'

import MDReactComponent from 'markdown-react-js';
import emoji from 'markdown-it-emoji';

const imageDescMarker = ':::: '
const youtubeLinkMarker = ':youtube: '

class Post extends Component {


    constructor(props) {

        super(props);
    
        this.state = {
            currentPost: []
        };
    
    }

    handleIterate = (Tag, props, children)  => {

        switch(Tag) {
        case 'p':
          
          var str = children[0];
          var strToRet;
      
          if (str.length > 4 && str.substring(0, 5) === imageDescMarker) 
          {
            strToRet = str.substring(4);
            return <div key = {Math.random()} className = 'Image-description'>{strToRet}</div>
          }
      
          else if (str.length > 8 && str.substring(0, 10) === youtubeLinkMarker)
          {
            strToRet = str.substring(10);
            var videoID = strToRet.split('=');
      
            if (videoID[1]) return <div key = {Math.random()} className = 'Youtube-embed-container'>
                                        <iframe width="560" 
                                                height="315" 
                                                src={'https://www.youtube.com/embed/' + videoID[1]}
                                                frameBorder="0" 
                                                allow="autoplay; encrypted-media" 
                                                allowFullScreen
                                                title = {Math.random()}>
                                        </iframe>
                                    </div>
          } 
      
          break;
      
        case 'table':
          props.className = 'table table-striped';
          break;
      
        case 'code':
          if (props['data-language']) {
            return <Highlight key = {Math.random()} language={props['data-language']}>{children}</Highlight>
          };
          break;
      
        case 'a':
          return <Tag {...props} target='_blank'>{children}</Tag>;
    
      
        case 'img':
          //return <a href = {props.src} target='_blank' ><Tag {...props} >{children}</Tag></a>;
          return <Tag {...props} onClick = {this.testClick} >{children}</Tag>;
    
    
        default:
          break;
        }
      
      
      
        return <Tag {...props}>{children}</Tag>;
    }


    getPost = () => {

    
        axios.post('http://192.168.1.30:4000/getbyid', { id: this.props.match.params.post }).then(response => {
    
          this.setState({currentPost:response.data});
    
        })
        .catch(error =>  {
    
          console.log(error);
    
        });
    }



    componentDidMount(){
        this.getPost();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.match.params.post !== this.props.match.params.post) this.getPost()
      }

    render(){

        
        var output = 'none';

        if (this.state.currentPost.post) output = this.state.currentPost.post;


        return(
            <div>
            <button onClick={() => window.history.back()}>Go Back</button>
            <MDReactComponent 
            text={output}
            markdownOptions={{ typographer: true }}
            onIterate={this.handleIterate}
            linkify = {true}
            plugins={[
              emoji
            ]}/>
            </div>
        )
    }
}

export default Post;