A simple app using `steem.js` and [React](https://reactjs.org) to show the followers for a user. Try it live here: https://lmiller1990.github.io/steem-followers-js/

Read the article to create your own version, step by step, and follow me on Steemit @xenetics for more Steem Blockchain development tutorials.

___


I build a app using [Ruby on Rails](https://rubyonrails.org) recently using the Steem Blockchain, so show the followers for a particular user. I'll be doing a similar application, but this time in JavaScript, with a bit more functionality. The final app I'll be building in this article is live [here](https://lmiller1990.github.io/steem-followers-js/) so you can try it out. I assume some programming knowledge but nothing too advanced. The source code is [here on my Github](https://github.com/lmiller1990/steem-followers-js).

The final app looks like this:

<center>![](https://steemitimages.com/DQmNgvTTkbXWUgoLhgPewJhGMEM5LNujZje6pHps4j1t67F/image.png)</center>

I'll be using [React](https://reactjs.org/), a popular framework for building websites created by Facebook to build the interface, and allow the app to scale up into something large like Steemworld in the future. Other websites like Netflix, Instagram, and Airbnb are build with React. 

It will also give a bit more real world context on how to build and mange client side JavaScript apps. [Steemit.com](https://steemit.com) it also built using React, so if you learn it, you might be able to contribute back to the platform we all know and love.

This will be a relatively long tutorial, since we are not only building the app, but laying the base for what can scale into a larger, robust platform with lots of features like voting, analytics, etc.

### Technologies:
- [npm](https://npmjs.com/) to manage the modules (in this case, react and the steem.js
- [create react app](https://github.com/facebookincubator/create-react-app) to configure the app in one line of code
- [steem.js](https://github.com/steemit/steem-js), the official JavaScript library for the Steem blockchain.

### Installation
You will be needing [Node.js](https://nodejs.org/en/), which includes npm. Go download it and run the installer.

To check if it was installed, open a terminal and run `node -v`and `npm -v`. I get:

``` js
node -v
v8.4.0
npm -v
5.3.0
```
<br>

Next we need to install `create-react-app`. This package helps you configure a new React app in just one line. 

Open a terminal, and run `npm install -g create-react-app` to install the package. Once that finishes, you can create a new React app by running:

```js
create-react-app followers
```
<br>
Wait a bit, and if everything went well, you should see:

```js
Success! Created followers at /Users/lachlan/javascript/steemit-followers/followers
Inside that directory, you can run several commands:

  yarn start
    Starts the development server.

  yarn build
    Bundles the app into static files for production.

  yarn test
    Starts the test runner.

  yarn eject
    Removes this tool and copies build dependencies, configuration files
    and scripts into the app directory. If you do this, you can’t go back!

We suggest that you begin by typing:

  cd followers
  yarn start

Happy hacking!
```
<br>
As suggested, run `cd followers` to change into the app directory.  I had to run `npm install` again here -- not sure why, perhaps a conflict between npm and yarn (another package manager that `create-react-app` defaults to, but we are using npm).

### Adding Steemit.js
Now we have our application installed, we need to add [steem.js](https://github.com/steemit/steem-js), a package that will give us access to all the data on the Steem blockchain.  To install steem.js, inside of your app folder (mine is  `followers`), run:

```js
npm install steem --save
```
<br>
Now you should be able to run `npm run start` and visiting `localhost:3000` in should display:

<center>![](https://steemitimages.com/DQmSYBDPkXFEkEmCDmSF1eNfE5Z1JpJ9GG7VFAstM98QbgU/image.png)</center>

### Setting up the form

Ok, now the fun part, actually using the Steem blockchain to show some data. Inside of `src`, open `App.js`. You should see:

```js
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
```
<br>

We are going to update a bunch of stuff here - the explanation follows the code. I included line numbers to help with the explanation:

```js
  0 import React, { Component } from 'react';
  1 import './App.css';
  2
  3 class App extends Component {
  4   constructor(props) {
  5     super(props);
  6     this.state = {username: ''};
  7
  8     this.handleChange = this.handleChange.bind(this);
  9     this.handleSubmit = this.handleSubmit.bind(this);
 10   }
 11
 12   handleChange(event) {
 13     this.setState({username: event.target.value});
 14   }
 15
 16   handleSubmit(event) {
 17     console.log('Submitted', this.state.username);
 18     event.preventDefault();
 19   }
 20
 21   render() {
 22     return (
 23       <div>
 24         <form onSubmit={this.handleSubmit}>
 25           <label>
 26             Name:
 27             <input type="text" value={this.state.username} onChange={this.handleChange} />
 28           </label>
 29           <input type="submit" value="Submit" />
 30         </form>
 31       </div>
 32     );
 33   }
 34 }
 35
 36 export default App;
```
<br>

Before explaining, let's make sure it's all running correctly. Save you file and check `locahost:3000`. If you typed it all correctly, you should see:

<center>![](https://steemitimages.com/DQmd5M8LopAh3mWc6aZ9e5CcsZf8a4ugYBBLPvbduX4WaEJ/image.png)</center>

If you enter something into the input box and press enter, you should see `Submitted [name] App.js.18` in your browsers devtools like this:

<center>![](https://steemitimages.com/DQmcx8TJrrxmYQGJjsskdKiJm89S5WEVMcGHC9T5Wcq5Xyv/image.png)</center>

If you don't know how, Google how to open your browser devtools. In Chrome it's ctrl+shift+c on Windows and cmd+shift+c on MacOS.

So _what's going on here?_ A ton of new code.

The first new thing is the `constructor` on line 4. `super()` is required, as explained in [here](https://reactjs.org/docs/react-component.html#constructor) in the React docs, so I won't go into it. Basically, the constructor will be called immediately when the app is mounted.

We then set the initial state on line 6, an object containing a `username` property. This is where we will save the username. In React, anything variable we expected to be changing goes in the component's `state` object, which is declared in the `constructor`.  

I want to let the user query lots of different Steem account's followers - I expected `username` to change - so I put it in the `state` object.

Line 8 and 9 use `bind` to let any functions I create have access to the constructor's `this` value, which includes `state`. Now I can access the `username `in both the `handleChange` and `handleSubmit` functions.

`handleChange` is called whenever the user inputs a new username. It simply updates `this.state.username` to reflect the current input. `handleSubmit`doesn't do anything yet, but it will make a request using steem.js to get the followers soon.

The `render` function sets up some basic HTML and binds `onChange` and `onSubmit` events to the functions I created above. This example is basically copied from [React's form example](https://reactjs.org/docs/forms.html). See there or post below if you don't understand something.

### Using steem.js

Now we need to use Steem.js to make some queries. At the top of `App.js`, add:

```js
import steem from 'steem'
```
<br>
To import steem.js. To see if it's working, inside of `constructor` add:


```js
steem.api.setOptions({ url: 'https://api.steemit.com' });
steem.api.getFollowers('xenetics', 0, 'blog', 100, (err, result) => {
  console.log(result)
})
```
<br>
The first line sets the endpoint where we will query the Steem blockchain. There are lots of servers, this one was working for me at the time of writing this. The next line uses the _Follower API_, which is detailed [here](https://github.com/steemit/steem-js/tree/master/doc#follow-api). Basically the followings arguments are available:

> steem.api.getFollowers(following, startFollower, followType, limit)

`following` is the username - I'm using mine for now. `startFollower` is the follower number to start from, I used 0 to get all the followers. `type` is `blog` - I am not sure what other options are available at this point. `limit` is how many followers to get - I just put 100 for now. I then print the followers out using `console.log(result)`.

Refresh `localhost:3000` and check the terminal. You should see something like this:

<center>
![](https://steemitimages.com/DQmNvqP6eETLeUweJgKnQKwoSgR9ZsSbfhjMD7zhAA3x9ps/image.png)</center>

Clicking reveals more details:

<center>![](https://steemitimages.com/DQmbeUbzEFsmEEtyQArhkQntAZmGNTF8ZFkvnmZGsm9rcCn/image.png)</center>

### Displaying the followers

Let's display the follows on the screen. We need to do a few things.

- add a `followers` property to the `state` object
- move `steem.api.getFollowers` to a `handleSubmit` method.
- use `setState` to update the component's `state` object.
- render the followers.

#### 1. Adding `followers` to the `state` object
We need somewhere to store the followers. Update `this.state` in the constructor:

```js
this.state = {username: '', followers: []};
```
<br>

####  2. Move `steem.api.getFollowers` to `handleSubmit`

We want to get new followers for the user when the form is submitted. Move 

```js
steem.api.setOptions({ url: 'https://api.steemit.com' });
steem.api.getFollowers('xenetics', 0, 'blog', 100, (err, result) => {
  console.log(result)
})
```
<br>
to `handleSubmit`:

```js
handleSubmit(event) {
    console.log('Submitted', this.state.username);
    event.preventDefault();

    steem.api.getFollowers('xenetics', 0, 'blog', 100, (err, result) => {
      console.log('followers', result)
  })
}
```
<br>
#### 3. Use `setState` to update the component's `state.followers`

Update `handleSubmit` to look like this:

```js
handleSubmit(event) {
    console.log('Submitted', this.state.username);
    event.preventDefault();

    steem.api.getFollowers('xenetics', 0, 'blog', 100, (err, result) => {
      this.setState({ followers: result })
  })
}
```
<br>

Which will save the `followers` to the `this.state`.

#### 4. Render the followers
Time to render the followers. We will do it like this:

```js
{this.state.followers.map((user, idx) =>
  <div key={idx}>
    {user.follower}
  </div>
)}
```

What is happening here? `followers` is an `Array`, which has a `map` method. `map` just iterates over each element, like a `for` loop. Then we just display the follower using `{user.follower}`. If you haven't seen JSX before, it's a bit strange, but it's definitely my favorite way to build interfaces.

Put this code in `render`. The updated `render` is like this:

```js
  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            Name:
            <input type="text" value={this.state.username} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Submit" />
        </form>
        {this.state.followers.map((user, idx) =>
          <div key={idx}>
            {user.follower}
          </div>
        )}
      </div>
    );
  }

```
<br>

This is all the code. See the full `App.js` [here](https://github.com/lmiller1990/steem-followers-js/blob/master/src/App.js).

If you did everything right, get back to the brower and enter a username in the input box. Press enter or click submit, and:

<center>![](https://steemitimages.com/DQmQ3GUk3Mw3iH6UvyWtHirUP8EkWswsKhuKD6RhGyv2VvU/image.png)</center>

Perfect! I added some styling in `App.css`, which you find in the source code (see the top of the article for hte link). Now it looks like this:

<center>![](https://steemitimages.com/DQmNgvTTkbXWUgoLhgPewJhGMEM5LNujZje6pHps4j1t67F/image.png)</center>

Phew! That was a lot of work. We could have done it without React, and it would have been faster and less complex, but I want to continue this app in the future to something more robust. Putting the extra work in at the start pays off down the road.

If anything in this tutorial doesn't work, it's entirely possible I made some mistakes, typos or missed something. I am using a Mac, so Windows users might have some variations - we can work through it, though, Node and React work fine on any OS.

Please leave a comment and I'll get back to you as soon as possible and update the article to reflect any errors.