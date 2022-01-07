import PropTypes from "prop-types";
import React from "react";

export const Button = ({ onclick, children, className='' }) =>
    <button
        className={ className }
        onClick={ onclick }>
        { children }
    </button>

Button.propTypes = {
    onClick: PropTypes.func,
    className: PropTypes.string,
    children: PropTypes.node.isRequired,
}

Button.defaultProps = {
    className: '',
}

export const Loading = () => <div><p>Loading...</p></div>

export const Sort = ({ sortKey, onSort, children, className, activeSortKey }) => {
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