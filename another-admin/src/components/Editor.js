import React, { Component } from 'react';
import { TextArea, Input, Dropdown, Button, Label } from 'semantic-ui-react'

const categoryOptions = [ { value: 'general', text: 'Общее' }, { value: 'code', text: 'Кодинг' }, { value: 'games', text: 'Игры' }  ]

class Editor extends Component {
    render(){
        return(
            <div id = 'Editor'>
                
                
                <div className = 'Editor-part'><Input 
                        id = 'titleValue' 
                        name = 'titleValue'  
                        label={<Label color = 'grey' >Заголовок</Label>}
                        placeholder='Введи название!' 
                        fluid  
                        onChange={this.props.handleChangeEditor}
                        value = {this.props.titleValue}  
                /></div>

                <div className = 'Editor-part'><Input 
                        id = 'coverValue' 
                        name = 'coverValue'  
                        label={<Label color = 'grey' >Обложка</Label>}
                        placeholder='Добавь картиночку!' 
                        fluid  
                        onChange={this.props.handleChangeEditor}
                        value = {this.props.coverValue}   
                /></div>

                <div className = 'Editor-part'><Dropdown   
                            id = 'categoryValue'
                            label={<Label color = 'grey' >Обложка</Label>}
                            placeholder='Выбери категорию!' 
                            search 
                            selection 
                            options={categoryOptions} 
                            fluid 
                            onChange={this.props.handleChangeDropdown}  
                            value = {this.props.dropdownValue}
                /></div>

                <div className = 'Editor-part' id = 'inputValue-wrapper'><TextArea 
                    id = 'inputValue' 
                    name = 'inputValue'  
                    placeholder='Расскажи мне историю!' 
                    onChange={this.props.handleChangeEditor} 
                    value = {this.props.inputValue}  
                /></div>


                <Button.Group id = 'Save-buttons' fluid >
                    <Button  color = 'red' disabled = {!this.props.activePostID} onClick = {this.props.deletePost}>Delete!</Button>
                    <Button.Or />
                    <Button  color = 'green' onClick = {this.props.savePost} >Save!</Button>
                </Button.Group>

            </div>
        );
    }
}


export default Editor;