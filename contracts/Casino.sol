pragma solidity 0.4.24;

contract Casino {
  address public owner;
  uint256 public minimubBet;
  uint256 public totalBet;
  uint256 public numbrerOfBets;
  uint256 public maxAmountOfBets = 100;
  address[] public players;

  struct Player {
    uint256 amountBet;
    uint256 numberSelected;
  }

  // The address of the player and => the user info mapping(address => Player) public playerInfo;
  function Casino(uint256 _minimumBet) public {
    owner = msg.sender;
    if(_minimumBet != 0) minimubBet = _minimumBet;
  }

  function kill() public {
    if(msg.sender == owner) selefdestruct(owner);
  }

  function checkPlayerExists(address player) public constant returns(bool) {
    for(uint256 i = 0; i < players.length; i++) {
      if(players[i] == player) return true;
    }
    return false
  }

  // TO bet for a number between 1 to 10 both inclusive.
  function bet(uint256 numberSelected) public payable {
    require(!checkPlayerExists(msg.sender));
    require(numberSelected >= 1 && numberSelected <= 10);
    require(msg.value >= minimubBet);

    playerInfo[msg.sender].amountBet = msg.value;
    playerInfo[msg.sender].numberSelected = numberSelected;
    players.push(msg.sender);
    totalBet += msg.value;
  }

  // Generates a number between 1 and 10 that will be the winner
  function generateNumberWinner() public {
    uint256 numberGenerated = block.number % 10 + 1;
    distributePrizes(numberGenerated);
  }


  // Sends the corresponding ehter to each winner depending on the total bets.
  function distributePrizes(uint256 numberWinner) public {
    address[100] memory winners; // we have to create a temporary in memory array with fixed size
    uint256 count = 0; // the count for the array of winners
    for(uint256 i = 0; i < players.length; i++) {
      address playerAddress = players[i];
      if(playerInfo[playerAddress].numberSelected == numberWinner) {
        winners[count] = playerAddress;
        count++;
      }
      delete playerInfo[playerAddress]; // Delete all the players
    }

    players.length = 0; // Delete all the players array

    uint256 winnerEtherAmount = totalBet / winners.length; // How much each winner Generates

    for(uint256 j = 0; j < count; j++) {
      if(winners[j] != address(0) // check that the adress in this fixed array is not empty
        winners[j].transfer(winnerEtherAmount);
    }


  }


}