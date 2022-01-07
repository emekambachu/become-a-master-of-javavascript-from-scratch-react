import logo from './logo.svg';
import './App.css';
import list from './list';
import React, {Component} from "react";
import { Container, Row, FormGroup} from 'react-bootstrap';
import PropTypes from 'prop-types';
import { sortBy } from 'lodash';
import {
    DEFAULT_QUERY, DEFAULT_PAGE, DEFAULT_HPP, PATH_BASE, PATH_SEARCH, PARAM_SEARCH, PARAM_PAGE, PARAM_HPP
} from './constants/index';

const SORTS = {
    NONE: list => list,
    TITLE: list => sortBy(list, 'title'),
    AUTHOR: list => sortBy(list, 'author'),
    COMMENTS: list => sortBy(list, 'num_comments').reverse(),
    POINTS: list => sortBy(list, 'points').reverse(),
}

// const url = PATH_BASE + PATH_SEARCH + '?' + PARAM_SEARCH + DEFAULT_QUERY;
const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}&${PARAM_PAGE}&${PARAM_HPP}${DEFAULT_HPP}`;
console.log(url);

// Filter the results by search
function isSearched(searchTerm){
  return function(item){
    return !searchTerm || item.title.toLowerCase().includes(searchTerm.toLowerCase());
  }
}

const withLoading = (Component) => ({ isLoading, ...rest }) =>
    isLoading ? <Loading /> : <Component {...rest} />

const updateTopStories = (hits, page) => prevState => {
    const { searchKey, results } = prevState;
    const oldHits = results && results[searchKey] ? results[searchKey].hits : [];
    const updatedHits = [...oldHits, ...hits];

    return { results: { ...results, [searchKey]: { hits: updatedHits, page }}, isLoading: false
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
      searchTerm: DEFAULT_QUERY,
      isLoading: false,
    }

    // bind the functions to this (app component)
    this.removeItem = this.removeItem.bind(this);
    this.searchvalue = this.searchValue.bind(this);
    this.fetchTopStories = this.fetchTopStories.bind(this);
    this.setTopStories = this.setTopStories.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

  }

  // Check top stories search term
    checkTopStoriesSearchTerm(searchTerm){
      return !this.state.results[searchTerm];
    }

  // Set top stories
    setTopStories(result){
      // get hits and page from result
      const {hits, page} = result;

      this.setState(updateTopStories(hits, page));
    }

  // Fetch the stories
  fetchTopStories(searchTerm, page){
      this.setState({ isLoading: true });
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

      if(this.checkTopStoriesSearchTerm(searchTerm)){
          this.fetchTopStories(this.state.searchTerm, DEFAULT_PAGE);
      }

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
    const { results, searchTerm, searchKey, isLoading } = this.state;

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

        <Container>
            <Row>
                <Table
                list={ list }
                removeItem={ this.removeItem }
                />

                <div className="text-center alert">
                    <ButtonWithLoading
                        isLoading={isLoading}
                        className="btn btn-success"
                        onClick={ () => this.fetchTopStories(searchTerm, page + 1) }>
                        Load more
                    </ButtonWithLoading>
                </div>
            </Row>
        </Container>

        </div>
    );

  }
}

// class Search extends Component {
//   render() {
//     const { onChange, value, children } = this.props;
//   }
// }

class Search extends Component {

    componentDidMount() {
        this.input.focus();
    }

    render(){
        const { onChange, value, children, onSubmit } = this.props;
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
                            ref={(node) => { this.input = node }}
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
}

class Table extends Component {

    constructor(props){
        super(props);
        this.state = {
            sortKey: 'NONE',
            isSortReverse: false
        }
        this.onSort = this.onSort.bind(this);
    }

    // Sorting Function
    onSort(sortKey){
        const isSortReverse = this.state.sortKey === sortKey && !this.state.isSortReverse;
        this.setState({ sortKey, isSortReverse });
    }

    render() {
        const {list, removeItem} = this.props;
        const {sortKey, isSortReverse} = this.state;
        const sortedList = SORTS[sortKey](list);
        const reverseSortedList = isSortReverse ? sortedList.reverse() : sortedList;

        return (
            <div className="col-sm-10 col-sm-offset-1">
                <div className="text-center">

                    <hr/>

                    <sort
                        className="btn btn-xs btn-primary sortBtn"
                        sortKey={'NONE'}
                        onSort={this.onSort}
                        activeSortKey={sortKey}
                    >Default
                    </sort>

                    <sort
                        className="btn btn-xs btn-primary sortBtn"
                        sortKey={'TITLE'}
                        onSort={this.onSort}
                        activeSortKey={sortKey}
                    >Title
                    </sort>

                    <sort
                        className="btn btn-xs btn-primary sortBtn"
                        sortKey={'AUTHOR'}
                        onSort={this.onSort}
                        activeSortKey={sortKey}
                    >Author
                    </sort>

                    <sort
                        className="btn btn-xs btn-primary sortBtn"
                        sortKey={'COMMENTS'}
                        onSort={this.onSort}
                        activeSortKey={sortKey}
                    >Comments
                    </sort>

                    <sort
                        className="btn btn-xs btn-primary sortBtn"
                        sortKey={'POINTS'}
                        onSort={this.onSort}
                        activeSortKey={sortKey}
                    >Points
                    </sort>

                    <hr/>
                </div>

                {
                    SORTS[sortKey](list).map(item =>
                        <div key={item.objectId}>
                            <h1>
                                <a href={item.url}>{item.title}</a> by {item.author}
                            </h1>
                            <h4>
                                {item.num_comments} Comments | {item.points} Points
                                <button className="btn btn-danger btn-xs"
                                        type="button"
                                        onClick={() => removeItem(item.objectId)}>
                                    Remove</button>
                            </h4>
                            <hr/>

                        </div>
                    )
                }
            </div>
        )
    }
}

Table.propTypes = {
    list: PropTypes.arrayOf(
        PropTypes.shape({
            objectID: PropTypes.string.isRequired,
            author: PropTypes.string,
            url: PropTypes.string,
            num_comments: PropTypes.number,
            points: PropTypes.number,
        })
    ).isRequired,
    removeItem: PropTypes.func.isRequired,
}

const Button = ({ onclick, children, className='' }) =>
    <button
        className={ className }
        onClick={ onclick }>
      { children }
    </button>

    Button.propTypes = {
        onClick: PropTypes.func.isRequired,
        className: PropTypes.string,
        children: PropTypes.node.isRequired,
    }

    Button.defaultProps = {
        className: '',
    }

    const Loading = () => <div>Loading...</div>
    const ButtonWithLoading = withLoading(Button);

    const Sort = ({ sortKey, onSort, children, className, activeSortKey }) => {
        const sortClass = ['btn default'];

        if(sortKey === activeSortKey){
            sortClass.push('btn btn-primary')
        }

       return (
           <Button
               className={ sortClass.join(' ') }
               onClick={() => onSort(sortKey)}>
               { children }
           </Button>
       )
    }

export default App;
