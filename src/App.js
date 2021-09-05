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

    const { list, searchTerm } = this.state;

    console.log(this);

    return (
        <Search className="App">

          <Search
              onChange={ this.searchValue }
              value={ searchTerm }
          >Search Here</Search>

          <Table
            list={ list }
            searchTerm={ searchTerm }
            removeItem={ this.removeItem }
          />

        </div>
    );

  }
}

class Search extends Component {
  render() {
    const { onChange, value, children } = this.props;
    return(
      <form>
        { children }
        <input
            type="text"
            onChange={ this.props.onChange }
            value={ this.props.value }
        />
      </form>
    )
  }
}

class Table extends Component {
  render(){
    const { list, searchTerm, removeItem} = this.props;
    return(
        <div>
          {
            list.filter( isSearched(searchTerm) ).map((item) => {

              return (<div key={item.objectId}>
                <h1>
                  <a href={ item.url }>{item.title}</a> by {item.author}
                </h1>
                <h4>
                  {item.num_comments} comments | { item.points } points
                </h4>

                <button type="button"
                        onClick={() => removeItem(item.objectId)}>
                  Remove</button>
              </div>);
            })
          }
        </div>
    )
  }
}

export default App;
