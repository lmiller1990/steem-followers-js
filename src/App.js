import React, { Component } from 'react';
import './App.css';
import steem from 'steem'

class App extends Component {
  constructor(props) {

    steem.api.setOptions({ url: 'https://api.steemit.com'   });

    super(props);
    this.state = {username: '', followers: []};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({username: event.target.value});
  }

  handleSubmit(event) {
    console.log('Submitted', this.state.username);
    event.preventDefault();

    steem.api.getFollowers(this.state.username, 0, 'blog', 100, (err, result) => {
      console.log(result)
      this.setState({ followers: result })
    })
  }

  render() {
    return (
      <div className={"outer"}>
        <form className={"form"} onSubmit={this.handleSubmit}>
          <label>
            Followers for:
            <input type="text" value={this.state.username} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Submit" />
        </form>
        {this.state.followers.map((user, idx) =>
          <div className={'follower'} key={idx}>
            {user.follower}
          </div>
        )}
      </div>
    );
  }
}

export default App;
