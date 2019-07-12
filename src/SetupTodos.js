import { useState, useEffect } from 'react';

const serializedLocalstorage = JSON.parse(localStorage.getItem('todoJSON'));
const initialTodosState = !!serializedLocalstorage ? serializedLocalstorage : [];
export const SetupTodos = () => {
	const filterEnum = {
		'ALL': 'all',
		'COMPLETED': 'completed',
		'ACTIVE': 'active'
	};
	const [todoList, updateTodoList] = useState(initialTodosState);
	const [filterState, setFilterState] = useState(filterEnum.ALL);
	useEffect(() => {
		//Don't save editable state
		onpopstate = (event) => {
			console.log("onpopstate: ", window.location.href);
		};
		const todoListNoEdit = todoList.map((item) => {
			return { label: item.label, completed: item.completed, editing: false };
		});
		localStorage.setItem('todoJSON', JSON.stringify(todoListNoEdit));
	});
	const addTodoItem = (event) => {
		if (event.key !== 'Enter')
			return;
		updateTodoList([
			...todoList,
			{
				label: event.target.value,
				completed: false,
				editing: false
			}
		]);
	};
	//TODO: following functions contains a pattern that could be refactored to a common function
	const deleteItem = (index) => {
		updateTodoList(todoList.filter((item, inx) => inx !== index));
	};
	const deleteItems = () => {
		updateTodoList(todoList.filter((item) => !item.completed));
	};
	const completeItem = (index, checked) => {
		updateTodoList(todoList.map((item, inx) => {
			return inx === index ? { label: item.label, completed: checked, editing: false } : item;
		}));
	};
	const completeAllItems = () => {
		const allItemsCompleted = todoList.filter((item) => !item.completed).length === 0 ? false : true;
		updateTodoList(todoList.map((item) => {
			return { label: item.label, completed: allItemsCompleted, editing: item.editing };
		}));
	};
	const selectToEditItem = (index) => {
		updateTodoList(todoList.map((item, inx) => {
			return inx === index ?
				{ label: item.label, completed: item.completed, editing: true } :
				{ label: item.label, completed: item.completed, editing: false };
		}));
	};
	const editItem = (index, event) => {
		updateTodoList(todoList.map((item, inx) => {
			return inx === index ? { label: event.target.value, completed: item.completed, editing: item.editing } : item;
		}));
	};
	const stopEditingItem = (index, event) => {
		if (event.key === 'Enter') {
			if (event.target.value === '') {
				deleteItem(index);
			}
			else {
				updateTodoList(todoList.map((item, inx) => {
					return inx === index ? { label: item.label, completed: item.completed, editing: false } : item;
				}));
			}
		}
	};
	const saveOnBlur = (index, event) => {
		if (event.target.value === '') {
			deleteItem(index);
		}
		else {
			updateTodoList(todoList.map((item, inx) => {
				return { label: item.label, completed: item.completed, editing: false };
			}));
		}
	};
	const updateFilterState = (selectedFilter) => {
		setFilterState(selectedFilter);
	};
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
		}
	];
};
