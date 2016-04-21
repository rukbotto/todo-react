var Todo = React.createClass({
  onTodoClick: function(event) {
    event.preventDefault();
    this.props.completeTodo({todoId: this.props.id});
  },

  render: function() {
    return (
      <li className="todo" id="{this.props.id}">
        {this.props.children}
        &nbsp; - &nbsp;
        {this.props.done ? <span>Done!</span> : <a href="#" onClick={this.onTodoClick}>Mark as done</a>}
      </li>
    );
  }
});

var TodoList = React.createClass({
  render: function() {
    var todoNodes = this.props.data.map(function(todo) {
      return (
        <Todo
          id={todo.id}
          done={todo.done ? true : false}
          completeTodo={this.props.completeTodo}>
          {todo.description}
        </Todo>
      );
    }.bind(this));

    return (
      <ul className="todo-list">
        {todoNodes}
      </ul>
    );
  }
});

var TodoForm = React.createClass({
  onDescriptionChange: function(event) {
    this.setState({description: event.target.value})
  },

  onSubmit: function(event) {
    event.preventDefault();
    var description = this.state.description.trim();
    if (!description) return;
    this.props.createTodo({description: description});
    this.setState({description: ''});
  },

  getInitialState: function() {
    return {description: ''};
  },

  render: function() {
    return (
      <form className="todo-form" onSubmit={this.onSubmit}>
        <input
          type="text"
          value={this.state.description}
          onChange={this.onDescriptionChange}
        />
        <input type="submit" value="Add todo" />
      </form>
    );
  }
});

var TodoBox = React.createClass({
  loadTodoList: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  createTodo: function(description) {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: description,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  completeTodo: function(todoId) {
    $.ajax({
      url: this.props.url + '/done',
      dataType: 'json',
      type: 'POST',
      data: todoId,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  getInitialState: function() {
    return {data: []};
  },

  componentDidMount: function() {
    this.loadTodoList();
    setInterval(this.loadTodoList, 2000);
  },

  render: function() {
    return (
      <div className="todo-box">
        <h1>Todo List</h1>
        <TodoList data={this.state.data} completeTodo={this.completeTodo} />
        <TodoForm createTodo={this.createTodo} />
      </div>
    );
  }
});

ReactDOM.render(
  <TodoBox url="/api/todos" />,
  document.getElementById('main')
);
