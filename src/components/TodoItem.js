import React, { useRef, useEffect } from 'react';
export const TodoItem = (props) => {

	const inputEditTodo = useRef(null)

	useEffect(() => {
		if (props.editing) {
			inputEditTodo.current.focus();
		}

	}, [props.editing]);

	return (
		<li className={props.editing ? "editing" : props.completed ? "completed" : null}>
			<div className="view">
				<input className="toggle"
					type="checkbox"
					checked={props.completed ? props.completed : false}
					onChange={props.completeCallback} />
				<label onDoubleClick={props.selectCallback}>{props.label}</label>
				<button className="destroy" onClick={props.deleteCallback}></button>
			</div>
			<input
				ref={inputEditTodo}
				className="edit"
				value={props.label}
				onChange={props.editCallback}
				onKeyPress={props.stopEditingItem}
				onBlur={props.onBlurCallback} />
		</li>
	);
};
