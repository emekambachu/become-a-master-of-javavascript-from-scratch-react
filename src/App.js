import logo from './logo.svg';
import './App.css';
import list from './list';
import React, {Component} from "react";

// let paragraph = "Welcome to react App Development";
// let name = "Ryan";

class App extends Component{

  // Setting up internal component state
  // ES6 class can use constructors to initialize internal state
  constructor(props){

    // super props sets this.props to the constructor
    super(props);

    this.state = {
      list: list
    }

    this.removeItem = this.removeItem.bind(this);
  }

  removeItem(id){
    console.log('Remove Item');

    // const isNotId = item => item.objectId !== id;
    // const updatedList = list.filter(isNotId);
    // this.setState({ list:updatedList });


    // isNotId(item){
    //   return item.objectId !== id;
    // }
    //
    // // create a new updated list
    // const updatedList = list.filter(isNotId);
    //
    // // assign the new updated list to the list using setState method
    // this.setState({ list: updatedList});
  }

  // Get input fields value from search form
  // searchValue(){
  //   console.log('From Search')
  // }

  render (){
    return (
        <div className="App">

          {/*<form>*/}
          {/*  <input type="text" onChange={ this.searchValue } />*/}
          {/*</form>*/}

          {
            list.map(function(item){

              return (<div key={item.objectId}>
                <h1>{item.title} | {item.author}</h1>
                <h4>{item.author}</h4>
                {/* to use this keyword use the arrow function not the real one */}
                <button type="button"
                        onClick={() => this.removeItem(item.objectId)}>
                  Remove</button>
              </div>);
            })
          }
        </div>
    );

  }
}

export default App;
