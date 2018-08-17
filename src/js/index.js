import React from 'react'
import ReactDOM from 'react-dom'
import Web3 from 'web3'
import './../css/index.css'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      lastWinner: 0,
      numberOfBets: 0,
      minimumBet: 0,
      totalBet: 0,
      maxAmountOfBets: 0,
    }

    if(typeof web3 != 'undifined') {
      console.log("Using web3 detected from external source like Metamask")
      this.web3 = new Web3(web3.currentProvider)
    } else {
      this.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))
    }

    const MyContract = web3.eth.contract([
  {
    "constant": false,
    "inputs": [
      {
        "name": "numberSelected",
        "type": "uint256"
      }
    ],
    "name": "bet",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "numberWinner",
        "type": "uint256"
      }
    ],
    "name": "distributePrizes",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "generateNumberWinner",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "kill",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "payable": true,
    "stateMutability": "payable",
    "type": "fallback"
  },
  {
    "inputs": [
      {
        "name": "_minimumBet",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "player",
        "type": "address"
      }
    ],
    "name": "checkPlayerExists",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "maxAmountOfBets",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "minimumBet",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "numberOfBets",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "name": "playerInfo",
    "outputs": [
      {
        "name": "amountBet",
        "type": "uint256"
      },
      {
        "name": "numberSelected",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "players",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "totalBet",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }
])

    this.state.ContractInstance = MyContract.at("0xc25ad66338ba937215798c2345fb4b5a30490d1f")
  }

  componentDidMount() {
    this.updateState()
    this.setupListeners()

    setInterval(this.updateState.bind(this), 10e3)
  }

  UpdateState() {
    this.state.CostractInstance.minimumBet((err, result) => {
      if(result != nul) {
        this.setState({
          minimumBet: parseFloat(web3.fromWei(result,'ether'))
        })
      }
    })

    this.state.CostractInstance.totalBet((err, result) => {
      if(result != nul) {
        this.setState({
          totalBet: parseFloat(web3.fromWei(result,'ether'))
        })
      }
    })

    this.state.CostractInstance.numberOfBets((err, result) => {
      if(result != nul) {
        this.setState({
          numberOfBets: parseInt(result)
        })
      }
    })

    this.state.CostractInstance.maxAmountOfBets((err, result) => {
      if(result != nul) {
        this.setState({
          maxAmountOfBets: parseInt(result)
        })
      }
    })
  }

  // Listen for events and executes the voteNumber method
  setupListeners() {
    let liNodes = this.refs.numbers.querySelectorAll('li')
    liNodes.forEach(number => {
      number.addEventListner('click', event => {
        event.target.className = 'number-selected'
        this.voteNumber(parseInt(event.target.innerHTML), done => {

          // Remove the other number selected
          for(let i = 0; i < liNodes.length; i++) {
            liNodes[i].className = ''
          }
        })
      })
    })
  }

  voteNumber(number) {
    console.log(number)
  }

  if(!bet) bet = 0.1

  if(parseFloat(bet) < this.state.minimumBet){
         alert('You must bet more than the minimum')
         cb()
      } else {
         this.state.ContractInstance.bet(number, {
            gas: 300000,
            from: web3.eth.accounts[0],
            value: web3.toWei(bet, 'ether')
         }, (err, result) => {
            cb()
         })
      }
   }

  render() {
    return(
    <div className="main-container">
      <h1>Bet for your best number and win huge amounts of Ether</h1>

      <div className="block">
        <h4>Timer:</h4> &nbsp;
        <span ref="timer"> {this.state.timer} </span>
      </div>

      <div className="block">
        <h4>Last winner:</h4> &nbsp;
        <span ref="last-winner"> {this.state.lastWinner} </span>
      </div>

      <hr/>
      <h2>Vote for the next number</h2>
        <ul ref="numbers">
          <li>1</li>
               <li>2</li>
               <li>3</li>
               <li>4</li>
               <li>5</li>
               <li>6</li>
               <li>7</li>
               <li>8</li>
               <li>9</li>
               <li>10</li>
        </ul>
    </div>
    )
  }
}

ReactDOM.render(
  <App />,
  document.querySelector('#root')
  )