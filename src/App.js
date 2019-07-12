import React, { useState, useEffect } from 'react';
import '../node_modules/todomvc-app-css/index.css';
import { TodoItem } from './components/TodoItem';
import { FilterFooter } from './components/FilterFooter';
import { Header } from './components/Header';
const serializedLocalstorage = JSON.parse(localStorage.getItem('todoJSON'));
const initialTodosState = !!serializedLocalstorage ? serializedLocalstorage : [];

const SetupTodos = () => {
	const [todoList, updateTodoList] = useState(initialTodosState);
	useEffect(() => {
		//Don't save editable state
		const todoListNoEdit = todoList.map((item) => {
			return { label: item.label, completed: item.completed, editing: false }
		})
		localStorage.setItem('todoJSON', JSON.stringify(todoListNoEdit));
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
		updateTodoList(todoList.map((item) => {
			return { label: item.label, completed: allItemsCompleted, editing: item.editing }
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

function App() {

	//TODO: should hooks intialize on every render? 
	// below is placeholder for componentdidmount Equivalent
	// useEffect(() => {

	// }, [])

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

	const numActiveTodos = todoList.filter((item) => !item.completed).length;
	const focusAddTodo = !todoList.filter((item) => item.editing).length

	return (
		<>
			<section className="todoapp">

				{/* <!-- This section should be hidden by default and shown when there are todos --> **/}
				<Header inputKeyCallback={addTodoItem} focusAddTodo={focusAddTodo}/>
				<section className="main" style={{ display: todoList.length === 0 ? 'none' : 'block' }}>
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
