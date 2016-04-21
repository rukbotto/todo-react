var Todo = React.createClass({
  displayName: "Todo",

  onTodoClick: function (event) {
    event.preventDefault();
    this.props.completeTodo({ todoId: this.props.id });
  },

  render: function () {
    return React.createElement(
      "li",
      { className: "todo", id: "{this.props.id}" },
      this.props.children,
      "  -  ",
      this.props.done ? React.createElement(
        "span",
        null,
        "Done!"
      ) : React.createElement(
        "a",
        { href: "#", onClick: this.onTodoClick },
        "Mark as done"
      )
    );
  }
});

var TodoList = React.createClass({
  displayName: "TodoList",

  render: function () {
    var todoNodes = this.props.data.map(function (todo) {
      return React.createElement(
        Todo,
        {
          id: todo.id,
          done: todo.done ? true : false,
          completeTodo: this.props.completeTodo },
        todo.description
      );
    }.bind(this));

    return React.createElement(
      "ul",
      { className: "todo-list" },
      todoNodes
    );
  }
});

var TodoForm = React.createClass({
  displayName: "TodoForm",

  onDescriptionChange: function (event) {
    this.setState({ description: event.target.value });
  },

  onSubmit: function (event) {
    event.preventDefault();
    var description = this.state.description.trim();
    if (!description) return;
    this.props.createTodo({ description: description });
    this.setState({ description: '' });
  },

  getInitialState: function () {
    return { description: '' };
  },

  render: function () {
    return React.createElement(
      "form",
      { className: "todo-form", onSubmit: this.onSubmit },
      React.createElement("input", {
        type: "text",
        value: this.state.description,
        onChange: this.onDescriptionChange
      }),
      React.createElement("input", { type: "submit", value: "Add todo" })
    );
  }
});

var TodoBox = React.createClass({
  displayName: "TodoBox",

  loadTodoList: function () {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function (data) {
        this.setState({ data: data });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  createTodo: function (description) {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: description,
      success: function (data) {
        this.setState({ data: data });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  completeTodo: function (todoId) {
    $.ajax({
      url: this.props.url + '/done',
      dataType: 'json',
      type: 'POST',
      data: todoId,
      success: function (data) {
        this.setState({ data: data });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  getInitialState: function () {
    return { data: [] };
  },

  componentDidMount: function () {
    this.loadTodoList();
    setInterval(this.loadTodoList, 2000);
  },

  render: function () {
    return React.createElement(
      "div",
      { className: "todo-box" },
      React.createElement(
        "h1",
        null,
        "Todo List"
      ),
      React.createElement(TodoList, { data: this.state.data, completeTodo: this.completeTodo }),
      React.createElement(TodoForm, { createTodo: this.createTodo })
    );
  }
});

ReactDOM.render(React.createElement(TodoBox, { url: "/api/todos" }), document.getElementById('main'));