import React from 'react';
export const FilterFooter = (props) => {
	/* <!-- This footer should hidden by default and shown when there are todos --> **/
	return (<footer style={{ display: props.shouldDisplay ? 'block' : 'none' }} className="footer">

		<span className="todo-count"><strong>{props.todosActive}</strong> item{props.todosActive !== 1 ? 's' : ''} left</span>

		<ul className="filters">
			<li>
				<a onClick={() => props.filterCallback(props.filterEnum.ALL)} className={props.filterState === props.filterEnum.ALL ? "selected" : null} href="#/">All</a>
			</li>
			<li>
				<a onClick={() => props.filterCallback(props.filterEnum.ACTIVE)} className={props.filterState === props.filterEnum.ACTIVE ? "selected" : null} href="#/active">Active</a>
			</li>
			<li>
				<a onClick={() => props.filterCallback(props.filterEnum.COMPLETED)} className={props.filterState === props.filterEnum.COMPLETED ? "selected" : null} href="#/completed">Completed</a>
			</li>
		</ul>

		<button onClick={props.clearCompleted} className="clear-completed">Clear completed</button>
	</footer>);
};
