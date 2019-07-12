import React from 'react';
import '../node_modules/todomvc-app-css/index.css';
import { TodoItem } from './components/TodoItem';
import { FilterFooter } from './components/FilterFooter';
import { Header } from './components/Header';
import { SetupTodos } from './SetupTodos';


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
				<Header inputKeyCallback={addTodoItem} focusAddTodo={focusAddTodo} />
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
