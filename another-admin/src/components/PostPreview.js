import React, { Component } from 'react';

import Highlight from 'react-highlight'

import MDReactComponent from 'markdown-react-js';
import emoji from 'markdown-it-emoji';

const imageDescMarker = ':::: '
const youtubeLinkMarker = ':youtube: '

class PostPreview extends Component {
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

    render(){

        var coverStyle = {
          
          
          backgroundImage: 'url(' + this.props.coverValue + ')',
          backgroundPosition: 'center center',
          backgroundSize: 'cover'
          
        };

        return(
            <div id = 'Editor-preview-wrapper'>

            <div className = 'Shadowed' style={coverStyle} >
              <div id = 'Post-header'  >
                {this.props.titleValue}
              </div>
            </div>

            <div id = 'Editor-preview'>
            <MDReactComponent 
                text={this.props.text}
                markdownOptions={{ typographer: true }}
                onIterate={this.handleIterate}
                linkify = {true}
                plugins={[
                  emoji
                ]}/>
            </div>
            </div>
        );
    }
}


export default PostPreview;