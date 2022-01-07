import React, {Component} from "react";
import PropTypes from "prop-types";
import { sortBy } from 'lodash';
import { Button, Sort } from '../Button/index';

const SORTS = {
    NONE: list => list,
    TITLE: list => sortBy(list, 'title'),
    AUTHOR: list => sortBy(list, 'author'),
    COMMENTS: list => sortBy(list, 'num_comments').reverse(),
    POINTS: list => sortBy(list, 'points').reverse(),
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

export default Table;