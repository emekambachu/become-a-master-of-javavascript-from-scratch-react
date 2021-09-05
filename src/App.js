import logo from './logo.svg';
import './App.css';
import list from './list';
import React, {Component} from "react";

// Filter the results by search
function isSearched(searchTerm){
  return function(item){
    return !searchTerm || item.title.toLowerCase().includes(searchTerm.toLowerCase());
  }
}

class App extends Component{

  // Setting up internal component state
  // ES6 class can use constructors to initialize internal state
  constructor(props){
    // super props sets this.props to the constructor
    super(props);

    this.state = {
      list: list,
      searchTerm: ''
    }

    this.removeItem = this.removeItem.bind(this);
    this.searchvalue = this.searchValue.bind(this);
  }

  // let's rewrite removeItem function in ES6
  removeItem(id){
    const isNotId = item => item.objectId !== id;
    const updatedList = this.state.list.filter(isNotId);
    this.setState({ list: updatedList });
  }

  // Get input fields value from search form
  searchValue = (event) => {
    // console.log(event);
    this.setState({ searchTerm: event.target.value })
  }

  render (){
    console.log(this);

    return (
        <div className="App">

          <form>
            <input type="text" onChange={ this.searchValue } />
          </form>

          {
            this.state.list.filter( isSearched(this.state.searchTerm) ).map((item) => {

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
