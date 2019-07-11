import React, { useState, useEffect } from 'react';
import '../node_modules/todomvc-app-css/index.css';
const serializedLocalstorage = JSON.parse(localStorage.getItem('todoJSON'));
const initialTodosState = !!serializedLocalstorage ? serializedLocalstorage : [] ;
/*
useRef(() => {
	const addTodoInput = useRef("type here");
	console.log("the Ref: ", addTodoInput);
});
*/
const SetupTodos = () => {
	const [todoList, updateTodoList] = useState(initialTodosState);
	useEffect(() => {
		localStorage.setItem('todoJSON', JSON.stringify(todoList));
	});

	const filterEnum = {
		'ALL': 'all',
		'COMPLETED': 'completed',
		'ACTIVE': 'active'
	}
	const [filterState, setFilterState] = useState(filterEnum.ALL);

	const addTodoItem = (event) => {
		if (event.key !== 'Enter') return;
		updateTodoList([
			...todoList,
			{
				label: event.target.value,
				completed: false,
				editing: false
			}
		]);
	}

	//TODO: following functions contains a pattern that could be refactored to a common function
	const deleteItem = (index) => {
		updateTodoList(todoList.filter((item, inx) => inx !== index));
	}
	const deleteItems = () => {
		updateTodoList(todoList.filter((item) => !item.completed));
	}
	const completeItem = (index, checked) => {
		updateTodoList(todoList.map((item, inx) => {
			return inx === index ? { label: item.label, completed: checked, editing: false } : item
		}));
	}
	const completeAllItems = () => {
		const allItemsCompleted = todoList.filter((item) => !item.completed).length === 0 ? false : true;
		console.log('allItemsCompleted', allItemsCompleted)
		updateTodoList(todoList.map((item) => { 
			return {label: item.label, completed: allItemsCompleted, editing: item.editing}
		}));
	}
	const selectToEditItem = (index) => {
		updateTodoList(todoList.map((item, inx) => {
			return inx === index ?
				{ label: item.label, completed: item.completed, editing: true } :
				{ label: item.label, completed: item.completed, editing: false };
		}));
	}
	const editItem = (index, event) => {
		updateTodoList(todoList.map((item, inx) => {
			return inx === index ? { label: event.target.value, completed: item.completed, editing: item.editing } : item;
		}));
	}
	const stopEditingItem = (index, event) => {
		if (event.key === 'Enter') {
			if (event.target.value === '') {
				deleteItem(index);
			} else {
				updateTodoList(todoList.map((item, inx) => {
					return inx === index ? { label: item.label, completed: item.completed, editing: false } : item;
				}));
			}
		}
	}
	const saveOnBlur = (index, event) => {
		console.log('saveOnBlur' ,index)
		if (event.target.value === '') {
			deleteItem(index);
		} else {
			updateTodoList(todoList.map((item, inx) => {
				return { label: item.label, completed: item.completed, editing: false };
			}));
		}		
	}
	const updateFilterState = (selectedFilter) => {
		setFilterState(selectedFilter);
	}
	return [
		todoList,
		filterState,
		filterEnum,
		{
			addTodoItem,
			deleteItem,
			completeItem,
			selectToEditItem,
			editItem,
			stopEditingItem,
			updateFilterState,
			deleteItems,
			completeAllItems,
			saveOnBlur
		}];
}

const TodoItem = (props) => {
	//Don't like this nested ternary, they tend to be hard to follow
	return (
		<li className={props.editing ? "editing" : props.completed ? "completed" : null}
		
		>
			<div className="view">
				<input className="toggle"
					type="checkbox"
					checked={props.completed}
					onClick={props.completeCallback} />
				<label onDoubleClick={props.selectCallback}>{props.label}</label>
				<button className="destroy" onClick={props.deleteCallback}></button>
			</div>
			<input className="edit"
				value={props.label}
				onChange={props.editCallback}
				onKeyPress={props.stopEditingItem}
				autoFocus={props.editing ? true : null} onBlur={props.onBlurCallback}
				 />
		</li>
	)
}

const FilterFooter = (props) => {
	/* <!-- This footer should hidden by default and shown when there are todos --> **/
	return (
		<footer style={{display: props.shouldDisplay ? 'block' : 'none'}}className="footer">
			{/* <!-- This should be `0 items left` by default --> **/}
			<span className="todo-count"><strong>{props.todosActive}</strong> item{props.todosActive !== 1 ? 's': ''} left</span>
			{/* <!-- Remove this if you don't implement routing --> **/}
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
			{/* <!-- Hidden if no completed items are left ↓ --> **/}
			<button onClick={props.clearCompleted} className="clear-completed">Clear completed</button>
		</footer>
	)
}

function App() {

	//TODO: should hooks intialize on every render? 
	const [
		todoList,
		filterState,
		filterEnum,
		{
			addTodoItem,
			deleteItem,
			completeItem,
			selectToEditItem,
			editItem,
			stopEditingItem,
			updateFilterState,
			deleteItems,
			completeAllItems,
			saveOnBlur 
		}
	] = SetupTodos();
	//console.log('todoList', todoList)
	const numActiveTodos = todoList.filter((item) => !item.completed).length;
	const focusAddTodo = !todoList.filter((item) => item.editing).length
	console.log('focusAddTodo', focusAddTodo ? true : null)
	return (
		<>
			<section className="todoapp">
				<header className="header">
					<h1>todos</h1>
					<input autoFocus={focusAddTodo ? true : null} className="new-todo" placeholder="What needs to be done?" onKeyPress={addTodoItem}  />
				</header>
				{/* <!-- This section should be hidden by default and shown when there are todos --> **/}
				
				<section className="main" style={{display: todoList.length === 0 ? 'none' : 'block'}}>
					<input onClick={completeAllItems} id="toggle-all" className="toggle-all" type="checkbox" />
					<label htmlFor="toggle-all">Mark all as complete</label>
					<ul className="todo-list">
						{/* <!-- These are here just to show the structure of the list items --> **/}
						{/* <!-- List items should get the class `editing` when editing and `completed` when marked as completed --> **/}
						{
							todoList.filter((item) => {
								switch (filterState) {
									case filterEnum.ALL:
										return item;
									case filterEnum.COMPLETED:
										return item.completed ? item : null;
									case filterEnum.ACTIVE:
										return !item.completed ? item : null;
									default: return item;
								}
							}).map((item, id) => {
								return <TodoItem
									label={item.label}
									completed={item.completed}
									editing={item.editing}
									key={id}
									deleteCallback={() => deleteItem(id)}
									completeCallback={(event) => completeItem(id, event.target.checked)}
									selectCallback={() => selectToEditItem(id)}
									editCallback={(event) => editItem(id, event)}
									stopEditingItem={(event) => stopEditingItem(id, event)}
									onBlurCallback={(event) => saveOnBlur(id, event)} />
							})
						}

					</ul>
				</section>
			<FilterFooter filterState={filterState}
						filterEnum={filterEnum}
						filterCallback={updateFilterState}
						todosActive={numActiveTodos}
						clearCompleted={deleteItems}
						shouldDisplay={todoList.length > 0 ? true : false}
						 />
			</section>

			<footer className="info">
				<p>Double-click to edit a todo</p>
			</footer>
		</>
	);
}

export default App;
