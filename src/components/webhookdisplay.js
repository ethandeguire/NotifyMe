import React from "react";
import "./../styles/login.css";
import "./../styles/buttons.css"
import "./../styles/webhooks.css"

export default class Webhookdisplay extends React.Component {
  constructor(props) {
    super(props);
    // this.state = { email: '', pastwebhooks: [{ from: 'sender', to: 'reciever' }, { from: 'john', to: 'stacy' }, { from: 'mom', to: 'dad' }] };
    this.state = { email: props.email || '', name: props.name || '', pastwebhooks: [] };

  };

  componentDidMount() {
    this.getPastWebhooks()
  }

  getPastWebhooks = () => {
    console.log('Refreshing past webhooks')
    return fetch(`https://notifyme.netlify.com/.netlify/functions/get-users-webhook-history?username=${this.state.email}`, {
      method: 'POST'
    })
      .then(response => response.json())
      .then(res => {
        // check if we recieved an error
        if (res["error"]) console.log('***error:', res['error'])
        else {
          let newPastWebhooks = []

          //  loop through hooks backwards to display most recent ones first
          for (let i = res.webhooks.length - 1; i >= 0; i--) {
            // const to = res['webhooks'][i]['data']['to']
            const to = `${res['webhooks'][i]['data']['computer_name']} - ${res['webhooks'][i]['data']['computer_os']}`
            if (!res['webhooks'][i]['data']['computer_name']) to = res['webhooks'][i]['data']['to'] || 'unknown'
            const from = res["webhooks"][i]['data']['webhook']["headers"]["user-agent"]

            const timeInMS = res["webhooks"][i]['data']['timestamp'] / 1000
            const datetime = new Date(res["webhooks"][i]['data']['timestamp'] / 1000).toLocaleDateString("en-US", { weekday: 'short', year: 'numeric', month: 'long', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });

            let timeAgoInS = Math.round((Date.now() - timeInMS) / 1000)
            let timeAgoInM = Math.round(timeAgoInS / 60)
            let timeAgoInH = Math.round(timeAgoInS / 60 / 60)
            let timeAgoInD = Math.round(timeAgoInS / 60 / 60 / 24)
            let timeAgoInMo = Math.round(timeAgoInS / 60 / 60 / 24 / 30)

            let timeAgoInUnit = 'some time ago'
            switch (true) {
              case (timeAgoInS < 60): timeAgoInUnit = `${timeAgoInS} seconds ago`; break;
              case (timeAgoInM >= 1 && timeAgoInM < 60): timeAgoInUnit = `${timeAgoInM} minutes ago`; break;
              case (timeAgoInH >= 1 && timeAgoInH < 24): timeAgoInUnit = `${timeAgoInH} hours ago`; break;
              case (timeAgoInD >= 1 && timeAgoInD < 30): timeAgoInUnit = `${timeAgoInD} days ago`; break;
              case (timeAgoInMo >= 1): timeAgoInUnit = `${timeAgoInMo} months ago`; break;
            }

            newPastWebhooks.push({ to: to, from: from, timeago: timeAgoInUnit, datetime: datetime })
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
        timeago={this.state.pastwebhooks[i].timeago}
        key={i}
      />)
    }
    return divList;
  }

  render() {
    return (
      <div>
        <h4>Past Webhooks:</h4>
        <button className='purplebutton' onClick={this.getPastWebhooks} > Update </button>
        <div className='allwebhooks'>
          {this.showWebhooks()}
        </div>
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
        <div className='webhooktextline'>{this.props.timeago}</div>
      </div >
    )
  }
}