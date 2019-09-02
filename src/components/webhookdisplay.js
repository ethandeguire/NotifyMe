import React from "react";
import "./../styles/login.css";
import "./../styles/buttons.css"
import "./../styles/webhooks.css"

export default class Webhookdisplay extends React.Component {
  constructor(props) {
    super(props);
    // this.state = { email: '', pastwebhooks: [{ from: 'sender', to: 'reciever' }, { from: 'john', to: 'stacy' }, { from: 'mom', to: 'dad' }] };
    this.state = { email: '', name: '', pastwebhooks: [] };

  };

  componentDidMount() {
    this.getPastWebhooks()
  }

  getPastWebhooks = () => {
    this.setState((state) => {
      this.state.email = localStorage.getItem('email')

      return fetch(`https://notifyme.netlify.com/.netlify/functions/get-users-webhook-history?username=${this.state.email}`, {
        method: 'POST'
      })
        .then(response => response.json())
        .then(res => {
          // check if we recieved an error
          if (res["error"]) console.log('***error:', res['error'])
          else {
            let newPastWebhooks = []

            for (let i = 0; i < res.webhooks.length; i++) {
              const to = res['webhooks'][i]['data']['to']
              const from = res["webhooks"][i]['data']['webhook']["headers"]["user-agent"]
              newPastWebhooks.push({ to: to, from: from })
            }

            this.setState((state) => {
              return { pastwebhooks: newPastWebhooks }
            }, () => {
              this.showWebhooks()
            });
          }
        })
        .catch((error) => {
          console.log("**Error:", error)
        })
    })
  }

  showWebhooks() {
    if (this.state.pastwebhooks.length == 0) {
      return <p><i>You haven't recieved any webhooks yet. Get started using the link above!</i></p>
    }

    let divList = [];
    for (var i = 0; i < this.state.pastwebhooks.length; i++) {
      divList.push(<Singlewebhook
        to={this.state.pastwebhooks[i].to}
        from={this.state.pastwebhooks[i].from}
        key={i}
      />)
    }
    return divList;
  }

  render() {
    return (
      <div className='allwebhooks'>
        <h4>Past Webhooks (test):</h4>
        <button className='purplebutton' onClick={this.getPastWebhooks} > Update </button>
        <br /><br />
        {this.showWebhooks()}
        <br /><br /><br /><br /><br /><br />
      </div>

    )
  }
}

class Singlewebhook extends React.Component {
  constructor(props) {
    super(props);
    this.state = { from: 'placeholder sender', to: 'placeholder reciever', key: '' }
  };


  render() {
    return (
      <div className='webhookhistorybox'>
        <div className='webhooktextline'>From: <i>{this.props.from}</i> </div>
        <div className='webhooktextline'>To: <i>{this.props.to}</i></div>
      </div >
    )
  }
}