import logo from './logo.svg';
import './App.css';
import list from './list';
import React, {Component} from "react";
import { Container, Row, FormGroup} from 'react-bootstrap';

// Default parameters to fetch data from API
const DEFAULT_QUERY = 'react';
const DEFAULT_PAGE = 0;
const DEFAULT_HPP = 100;

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

// const url = PATH_BASE + PATH_SEARCH + '?' + PARAM_SEARCH + DEFAULT_QUERY;
const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}&${PARAM_PAGE}&${PARAM_HPP}${DEFAULT_HPP}`;
console.log(url);

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

    // Setting up state
    this.state = {
      results: null,
      searchKey: '',
      searchTerm: DEFAULT_QUERY
    }

    // bind the functions to this (app component)
    this.removeItem = this.removeItem.bind(this);
    this.searchvalue = this.searchValue.bind(this);
    this.fetchTopStories = this.fetchTopStories.bind(this);
    this.setTopStories = this.setTopStories.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

  }

  // Set top stories
    setTopStories(result){
      // get hits and page from result
      const {hits, page} = result;
      // meaning page is not 0, button might has been clicked, page might be 1 or 2
        // Old hits are already available in the state
      // const oldHits = page !== 0 ? this.state.result.hits : [];
        const { searchKey, results } = this.state;
        const oldHits = results && results[searchKey] ? results[searchKey].hits : [];
      const updatedHits = [...oldHits, ...hits];
      this.setState({ results: { ...results, [searchKey]: {hits: updatedHits, page} } });
    }

  // Fetch the stories
  fetchTopStories(searchTerm, page){
      fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
          .then(response => response.json())
          .then(result => this.setTopStories(result))
          .catch( e => e);
  }

    // component did mount
    componentDidMount() {
      const { searchTerm } = this.state;
      this.setState({ searchKey: searchTerm });
      this.fetchTopStories(searchTerm, DEFAULT_PAGE);
    }

    // on search submit function
    onSubmit(event){
      const { searchTerm } = this.state;
      this.setState({ searchKey: searchTerm });
      this.fetchTopStories(searchTerm, DEFAULT_PAGE);
      event.preventDefault();
    }

    // let's rewrite removeItem function in ES6
  removeItem(id){
    const { results, searchKey } = this.state;
    const {hits, page} = results[searchKey];
    // const isNotId = item => item.objectId !== id;
    const updatedList = hits.filter(item => item.objectID !== id);
    // Object assign
    // this.setState({ result: Object.assign({}, this.state.result, {hits: updatedList}) });

    // Spread operator
    this.setState({ results: {...results, [searchKey]: {hits: updatedList, page}} });
  }

  // Get input fields value from search form
  searchValue = (event) => {
    // console.log(event);
    this.setState({ searchTerm: event.target.value })
  }

  render (){

    const { results, searchTerm, searchKey } = this.state;

    // if(!result){ return null; }

    const page = (results && results[searchKey] && results[searchKey].page) || 0;
    const list = (results && results[searchKey] && results[searchKey].hits) || [];

    console.log(this);

    return (
        <div>

          <Container fluid>
              <Row>
                  <div className="jumbotron text-center">
                  <Search
                      onChange={ this.searchValue }
                      value={ searchTerm }
                      onSubmit={ this.onSubmit }
                  >News App</Search>
                  </div>
              </Row>
          </Container>

        <Table
            list={ list }
            searchTerm={ searchTerm }
            removeItem={ this.removeItem }
        />

        <div className="text-center alert">
            <button
                className="btn btn-success"
                onClick={ () => this.fetchTopStories(searchTerm, page + 1) }>
                Load more
            </button>
        </div>

        </div>
    );

  }
}

// class Search extends Component {
//   render() {
//     const { onChange, value, children } = this.props;
//   }
// }

const Search = ({ onChange, value, children, onSubmit }) => {
  return(
      <form onSubmit={ onSubmit }>
          <FormGroup>
          <h1 style={{ fontWeight: 'bold' }}>{ children }</h1>
          <hr style={{ border: '2px solid black', width: '100px' }} />
          <div className="input-group">
              <input
                  className="form-control width100 searchForm"
                  type="text"
                  onChange={ onChange }
                  value={ value }
              />

              <span className="input-group-btn">
                <Button
                    className="btn btn-primary searchBtn"
                    type="submit">Search
                </Button>
              </span>

          </div>
          </FormGroup>
      </form>
  )
}

const Table = ({ list, searchTerm, removeItem}) => {
  return(
      <div className="col-sm-10 col-sm-offset-1">
        {
          list.map((item) => {

            return (<div key={item.objectId}>
              <h1>
                <a href={ item.url }>{item.title}</a> by {item.author}
              </h1>
              <h4>
                {item.num_comments} Comments | { item.points } Points
                  <button className="btn btn-danger btn-xs"
                          type="button"
                          onClick={() => removeItem(item.objectId)}>
                      Remove</button>
              </h4><hr />

            </div>);
          })
        }
      </div>
  )
}

const Button = ({ onclick, children, className='' }) =>
    <button
        className={ className }
        onClick={ onclick }>
      { children }
    </button>

export default App;
