import React, { useEffect, useRef } from 'react';
export const Header = (props) => {
	const inputAddTodo = useRef(null);
	useEffect(() => {
		if (props.focusAddTodo) {
			inputAddTodo.current.focus();
		}
	});
	return (<header className="header">
		<h1>todos</h1>
		<input ref={inputAddTodo} className="new-todo" placeholder="What needs to be done?" onKeyPress={props.inputKeyCallback} />
	</header>);
};
