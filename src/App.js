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

  removeItem = (id) => {
    console.log('Remove Item');

    // const isNotId = item => item.objectId !== id;
    // const updatedList = list.filter(isNotId);
    // this.setState({ list:updatedList });

    // using javascript filter method, we can filter out the clicked item
    // and render the updated list
    function isNotId(item){
      return item.objectId !== id;
    }

    // create a new updated list
    const updatedList = this.state.list.filter(isNotId);
    // assign the new updated list to the list using setState method
    this.setState({ list: updatedList});
  }

  // Get input fields value from search form
  // searchValue(){
  //   console.log('From Search')
  // }

  render (){
    console.log(this);

    return (
        <div className="App">

          {/*<form>*/}
          {/*  <input type="text" onChange={ this.searchValue } />*/}
          {/*</form>*/}

          {
            this.state.list.map((item) => {

              return (<div key={item.objectId}>
                <h1>
                  <a href={ item.url }>{item.title}</a> by {item.author}
                </h1>
                <h4>
                  {item.num_comments} comments | { item.points } points
                </h4>
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
