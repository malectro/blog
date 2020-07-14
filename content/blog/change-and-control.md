---
title: Change and Control
date: "2020-07-10T22:12:03.284Z"
description: managing React forms can be challenging
---

One of the most difficult parts of UI development is the implementation of forms. On the traditional web, forms were the most interactive pages and left the most room for error. Because networks were too slow to allow servers to support real-time updates and interactions, client-side scripting was created to bridge this gap. Many of the earliest uses of JavaScript focused on validating form fields, providing suggestions, and generally imbuing behavior into an otherwise simple HTML API.

For a lot of us who spent years developing "unobtrusive" jQuery plugins to manage this extra behavior, React was a gift. If a PHP template was a reflection of the current state of the database, a rendered React application was a simply a function of its underlying "state". Libraries like Redux took this idea further, encouraging developers to hoist their entire state to a single location where all components could access it.

This thinking permeates the React docs, including the section on forms.

> This form has the default HTML form behavior of browsing to a new page when the user submits the form. If you want this behavior in React, it just works. But in most cases, it’s convenient to have a JavaScript function that handles the submission of the form and has access to the data that the user entered into the form. The standard way to achieve this is with a technique called “controlled components”.

Whereas a React newbie might code a form like so.

```jsx
function MyForm() {
  const formRef = React.useRef();

  const handleSubmit = (event) => {
    event.preventDefault();
    fetch('/endpoint', {
      method: 'POST',
      body: JSON.stringify({
        email: event.target.email,
        password: event.target.password,
      }),
    });
  };

  return <form ref={formRef} onSubmit={handleSubmit}>
    <input type="email" name="email" />
    <input type="password" name="password" />
  </form>;
}
```

A seasoned React developer will default to this.

```jsx
function MyForm() {
  const [state, setState] = React.useState({
    email: '',
    password: '',
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    fetch('/endpoint', {
      method: 'POST',
      body: JSON.stringify(state),
    });
  };

  const handleChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.value,
    });
  };

  return <form onSubmit={handleSubmit}>
    <input type="email" name="email" value={state.email} onChange={handleChange} />
    <input type="password" name="password" value={state.password} onChange={handleChange} />
  </form>;
}
```

"Controlling" inputs effectively hoist their state to a higher point in the application. This allows for powerful but concise responses to user input that would otherwise be a headache to tackle with vanilla JS or jQuery. Things like filtering and validation are a cynch.

(In the following example we only post the form if inputs are valid, and for good measure, we only show the password field after the user has added a valid email address.)

```jsx
function MyForm() {
  const [state, setState] = React.useState({
    email: '',
    password: '',
  });

  // NOTE: this is simplest possible validation.
  const isValidEmail = state.email.trim();
  const isValidPassword = state.password.trim();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isValidEmail && isValidPassword) {
      fetch('/signup', {
        method: 'POST',
        body: JSON.stringify(state),
      });
    }
  };

  const handleChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.value,
    });
  };

  const getValidationStyle = (isValid) => ({
    backgroundColor: isValid ? 'black' : 'red',
  });

  return <form onSubmit={handleSubmit}>
    <input type="email" name="email" value={state.email} onChange={handleChange}
      style={getValidationStyle(isValidEmail)}
    />
    { isValidEmail && 
      <input type="password" name="password" value={state.password} onChange={handleChange}
        style={getValidationStyle(isValidPassword)}
      />
    }
  </form>;
}
```

Backtracking a bit, if you are a veteran JS programmer you may have been confused by a couple of things. (I definitely was.)

First, the React docs say this.
> Since handleChange runs on every keystroke to update the React state, the displayed value will update as the user types.

But the Mozilla Developer Network says this.
> The change event is fired for `<input>`, `<select>`, and `<textarea>` elements when an alteration to the element's value is committed by the user. Unlike the input event, the change event is not necessarily fired for each alteration to an element's value.

This is because `onChange` in React is not the same as `onchange` in HTML. The React team implemented it differently to make controlling components much easier. It seems to fire on every keystroke, which would imply that it's the same as `keydown` or `input`, but, regardless, it fires for any change to the input value. This is great if what you need is full control, but do you? 99% of "controlled" forms simply set the unmodified input value on the their state and rerender needlessly. Setting state and rerendering the form for every keystroke is surprisingly performant for a small component, but it can be wasteful and slow if your form has a large number of inputs and child components.

Here's an example of an admin page that lets us edit the names of all our users.

```jsx
function MyForm() {
  const [users, setUsers] = React.useState();

  React.useEffect(() => {
    fetch('/api/users').then(async (response) => {
      setUsers(
        new Map(await response.json().map(
          (user) => [user.id, user]
        )),
      );
    });
  }, []);

  if (!users) {
    return 'loading';
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify([...users.values()]),
    });
  };

  return <form onSubmit={handleSubmit}>
    {users.map((user) => (
      <div key={user.id}>
        <span>{user.id}</span>
        <input type="text" value={user.name} onChange={(event) => {
          const nextUsers = new Map(users);
          nextUsers.set(user.id, {...user, name: event.currentTarget.value});
          setUsers(nextUsers);
        }} />
      </div>
    ))}
  </form>;
}
```

Depending on how many users we have, we may be unnecessarily rendering hundreds of React elements on every keystroke. And this is just a simple example. Many applications are a bit more complex.

Beyond performance, the intention of `change` is to allow users to make changes and "commit" them before the application responds to them. This is important for accessbility, alternative keyboards, and ligatures. It also means users can indicate exactly when they'd like the application to validate their inputs, knowing that the intermediate state might not be valid.

Let's look at our signup component again, but this time, let's validate the email address with a regex.

```jsx
function MyForm() {
  const [state, setState] = React.useState({
    email: '',
    password: '',
  });

  // NOTE: this is not how you validate emails addresses.
  const isValidEmail = state.email.match(/^[^@]+@.+\.[a-z]+$/);
  const isValidPassword = state.password.trim().length > 7;

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isValidEmail && isValidPassword) {
      fetch('/signup', {
        method: 'POST',
        body: JSON.stringify(state),
      });
    }
  };

  const handleChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.value,
    });
  };

  const getValidationStyle = (isValid) => ({
    backgroundColor: isValid ? 'black' : 'red',
  });

  return <form onSubmit={handleSubmit}>
    <input type="email" name="email" value={state.email} onChange={handleChange}
      style={getValidationStyle(isValidEmail)}
    />
    <input type="password" name="password" value={state.password} onChange={handleChange}
      style={getValidationStyle(isValidPassword)}
    />
  </form>;
}
```

This form now exemplifies a common UX problem, premature validation. As a user begins typing out their email address, they will be immediately notified that it is invalid, and the field will stay red until they've finished typing `.com`. This is jarring, pretty annoying, and just all-around shoddy. Imagine being told your dinner is unsafe to eat while you're in the middle of cooking it. Obviously?

If I were writing vanilla JS, I would switch from `input` to `change` and call it a day, but React does not provide a way of listening to the regular `change` event. Luckily we can use `ref` as an escape hatch to access the vanilla DOM API.

```jsx
function MyInput() {
  const ref = React.useRef();
  
  const handleChange = () => {
    console.log('change');
  };
  
  React.useEffect(() => {
    const el = ref.current;
    if (el) {
      el.addEventListener('change', handleChange);
      return () => {
        el.removeEventListener('change', handleChange);
      };
    }
  }, [handleChange]);
  
  return <input type="text" ref={handleRef} />;
}  
```

The example above is pretty ugly but straightforward, and if we wanted to reuse this pattern, we could abstract it into a hook. Let's make it a component for now and use it in our form.

```jsx
function MyInput({onChange, ...props}) {
  const ref = React.useRef();

  React.useEffect(() => {
    const el = ref.current;
    if (el) {
      el.addEventListener('change', onChange);
      return () => {
        el.removeEventListener('change', onChange);
      };
    }
  }, [onChange]);

  return <input {...props} ref={ref} />;
}

function MyForm() {
  const [state, setState] = React.useState({
    email: null,
    password: null,
  });

  // NOTE: this is not how you validate emails addresses.
  const isValidEmail = state.email != null && state.email.match(/^[^@]+@.+\.[a-z]+$/);
  const isValidPassword = state.password != null && state.password.trim().length > 7;

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isValidEmail && isValidPassword) {
      fetch('/signup', {
        method: 'POST',
        body: JSON.stringify(state),
      });
    }
  };

  const handleChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.value,
    });
  };

  const getValidationStyle = (isValid) => ({
    backgroundColor: isValid ? 'white' : 'red',
  });

  return <form onSubmit={handleSubmit}>
    <MyInput type="email" name="email" defaultValue={state.email} onChange={handleChange}
      style={getValidationStyle(state.email == null || isValidEmail)}
    />
    <MyInput type="password" name="password" defaultValue={state.password} onChange={handleChange}
      style={getValidationStyle(state.password == null || isValidPassword)}
    />
  </form>;
}
```

Note that we've made a few changes here. First, we initialize the field values as `null`. This allows us to avoid showing the invalid state before the user has entered any text. Second, instead of passing `value` to our inputs, we pass `defaultValue`, which, among other things, indicates that we do not intend to "control" them.

Now our validation occurs only after the user has finished typing in a field. This gives the user a chance to finish their work before they are assaulted with information, and as a bonus, it avoids rerendering the component unnecessarily.

The pattern of "edit" and "commit" is a useful one, and even though React makes accessing the vanilla `change` event difficult, constructing an application in this matter is pretty easy and rewarding.

As a last example, let's refactor our account admin page so that it keeps state low and only hoists it when the users has committed.

```jsx
function AccountsPage() {
  const [state, setState] = React.useState({
    users: [],
    editing: null,
  });

  React.useEffect(() => {
    fetch('/api/users').then(async (response) => {
      setState({
        ...state,
        users: new Map(await response.json().map(
          (user) => [user.id, user]
        )),
      });
    });
  }, []);

  const handleSubmit = (user) => {
    const nextUsers = new Map(state.users);
    nextUsers.set(user.id, user);
    setState({...state, users: nextUsers});

    fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify([...state.users.values()]),
    });
  };

  const handleCancel = () => {
    setState({...state, editing: null});
  };

  return <div>
    {users.map((user) => (
      <div key={user.id}>{
        user.id === state.editing ?
          <UserForm user={user} onSubmit={handleSubmit} onCancel={handleCancel} />
        :
          <>
            <span>{user.id}</span>
            <span>{user.name}</span>
            <button onClick={() => setState({...state, editing: user.id})}>Edit</button>
          </>
      </div>
    ))}
  </div>;
}

function UserForm({user, onSubmit, onCancel}) {
  const [state, setState] = React.useState(user);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(state);
  };

  const handleCancel = (event) => {
    event.preventDefault();
    onCancel();
  };

  const handleChange = (event) => {
    setState({
      [event.target.name]: event.target.value,
    });
  };

  return <form onSubmit={handleSubmit}>
    <input type="text" value={state.name} onChange={handleChange} />
    <button onClick={handleCancel}>Cancel</button>
    <button>Done</button>
  </form>
}
```

This is what I'd call "the best of both worlds". When the user indicates that they'd like to edit an account, a form is shown. Editing the form only rerenders the form itself, and when the user is done, the final state of the form is hoisted and saved to the server. Not only does this make for cleaner code, but it also makes things like "canceling" simpler. We just unmount the `UserForm` and let its local state get garbage collected.

For some, this sort of use of local state might go against their React/Redux thinking. But I'd argue that keeping state local and only hoisting it when a user commits it, is much better for the health of an application. Not every update needs to update every component.
