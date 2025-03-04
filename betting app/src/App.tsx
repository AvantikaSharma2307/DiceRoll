import React, { useState } from 'react';
import { Dice1 as Dice, DollarSign } from 'lucide-react';
import axios from 'axios';

function App() {
  const [balance, setBalance] = useState(1000);
  const [betAmount, setBetAmount] = useState(10);
  const [isRolling, setIsRolling] = useState(false);
  const [diceValue, setDiceValue] = useState<number | null>(null);
  const [mode, setMode] = useState('manual');

  
  const multiplier = 2;
  
  
  const winChance = 50;

  const handleBetAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setBetAmount(value);
    }
  };

  const handleHalfBet = () => {
    setBetAmount(Math.max(betAmount / 2, 1));
  };

  const handleDoubleBet = () => {
    setBetAmount(Math.min(betAmount * 2, balance));
  };
  const rollDice = async () => {
    if (betAmount <= 0 || betAmount > balance || isRolling) return;
  
    setIsRolling(true);
    setBalance((prev) => prev - betAmount);
  
    try {
      interface RollResponse {
        roll: number;
      }
      const response = await axios.post<RollResponse>("http://localhost:8000/roll-dice", { betAmount });
  
      const { roll } = response.data;
      setDiceValue(roll);
    
      const isWin = roll >= 4;
      if (isWin) {
        const winAmount = betAmount * multiplier;
        setBalance((prev) => prev + winAmount);
      }
    } catch (error) {
      console.error("Error rolling dice:", error);
    }
  
    setIsRolling(false);
  };

  const calculatePotentialProfit = () => {
    return (betAmount * multiplier - betAmount).toFixed(2);
  };

  
  const diceValueToPercent = (value: number | null) => {
    if (value === null) return null;
  
    return (value - 1) * (100 / 6) + (100 / 12);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-6">
      
        <div className="bg-gray-800 rounded-xl p-6 w-full lg:w-1/3 shadow-lg">
      
          <div className="bg-gray-900 rounded-full p-1 flex mb-6">
            <button 
              className={`flex-1 py-2 rounded-full text-center transition ${mode === 'manual' ? 'bg-gray-800 text-white' : 'text-gray-400'}`}
              onClick={() => setMode('manual')}
            >
              Manual
            </button>
            <button 
              className={`flex-1 py-2 rounded-full text-center transition ${mode === 'auto' ? 'bg-gray-800 text-white' : 'text-gray-400'}`}
              onClick={() => setMode('auto')}
            >
              Auto
            </button>
          </div>
          
        
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <label className="text-gray-400">Bet Amount</label>
              <span className="text-gray-400">₹{betAmount.toFixed(2)}</span>
            </div>
            <div className="flex">
              <div className="relative flex-1">
                <input
                  type="number"
                  value={betAmount}
                  onChange={handleBetAmountChange}
                  className="w-full bg-gray-900 border border-gray-700 rounded-l-md p-3 text-white"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <DollarSign size={18} className="text-yellow-500" />
                </div>
              </div>
              <button 
                onClick={handleHalfBet}
                className="bg-gray-700 px-3 border-r border-gray-600"
              >
                ½
              </button>
              <button 
                onClick={handleDoubleBet}
                className="bg-gray-700 px-3 rounded-r-md"
              >
                2×
              </button>
            </div>
          </div>
          
        
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <label className="text-gray-400">Profit on Win</label>
              <span className="text-gray-400">₹{calculatePotentialProfit()}</span>
            </div>
            <div className="relative">
              <input
                type="text"
                value={calculatePotentialProfit()}
                readOnly
                className="w-full bg-gray-900 border border-gray-700 rounded-md p-3 text-white"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <DollarSign size={18} className="text-yellow-500" />
              </div>
            </div>
          </div>
          
          
          <button
            onClick={rollDice}
            disabled={isRolling || betAmount <= 0 || betAmount > balance}
            className={`w-full py-4 rounded-md text-center text-lg font-bold transition ${
              isRolling || betAmount <= 0 || betAmount > balance
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {isRolling ? 'Rolling...' : 'Roll Dice'}
          </button>
        </div>
        
        
        <div className="bg-gray-800 rounded-xl p-6 w-full lg:w-2/3 shadow-lg flex flex-col">
        
          <div className="flex justify-end mb-6 gap-3">
            {[4, 5, 6].map((value, index) => (
              <div key={index} className="bg-green-500 text-black font-bold px-4 py-2 rounded-full">
                {value}
              </div>
            ))}
          </div>
          
          
          <div className="flex-1 flex flex-col items-center justify-center">
            {diceValue !== null && (
              <div className="text-7xl font-bold mb-8 flex items-center justify-center bg-gray-700 w-24 h-24 rounded-xl">
                {diceValue}
              </div>
            )}
            
        
            <div className="w-full mb-8">
              <div className="flex justify-between mb-2">
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
                <span>6</span>
              </div>
              
              <div className="relative h-12">
              
                <div className="absolute inset-0 bg-gray-700 rounded-full"></div>
                
              
                <div 
                  className="absolute inset-y-0 left-0 bg-red-500 rounded-l-full"
                  style={{ width: '50%' }}
                ></div>
                
              
                <div 
                  className="absolute inset-y-0 right-0 bg-green-500 rounded-r-full"
                  style={{ width: '50%' }}
                ></div>
                
              
                <div 
                  className="absolute inset-y-0 left-1/2 w-1 bg-gray-900"
                ></div>
                
              
                {diceValue !== null && (
                  <div 
                    className="absolute top-0 transform -translate-x-1/2 w-16 h-16 flex items-center justify-center"
                    style={{ 
                      left: `${diceValueToPercent(diceValue)}%`,
                      top: '-40px'
                    }}
                  >
                    <div className={`${diceValue >= 4 ? 'bg-green-500' : 'bg-red-500'} text-white font-bold p-2 rounded-md`}>
                      {diceValue}
                    </div>
                    <div className={`w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent ${diceValue >= 4 ? 'border-t-green-500' : 'border-t-red-500'} absolute -bottom-2`}></div>
                  </div>
                )}
              </div>
            </div>
            
            
            <div className="w-full grid gap-4 mt-auto grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:grid-rows-2 md:grid-rows-3">
              <div>
                <label className="block text-gray-400 mb-2">Multiplier</label>
                <div className="relative">
                  <input
                    type="text"
                    value={multiplier.toFixed(1)}
                    readOnly
                    className="w-full bg-gray-900 border border-gray-700 rounded-md p-3 text-white"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <span className="text-gray-400">×</span>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-gray-400 mb-2">Win Numbers</label>
                <div className="relative">
                  <input
                    type="text"
                    value="4, 5, 6"
                    readOnly
                    className="w-full bg-gray-900 border border-gray-700 rounded-md p-3 text-white"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Dice size={18} className="text-gray-400" />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-gray-400 mb-2">Win Chance</label>
                <div className="relative">
                  <input
                    type="text"
                    value={`${winChance.toFixed(0)}`}
                    readOnly
                    className="w-full bg-gray-900 border border-gray-700 rounded-md p-3 text-white"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <span className="text-gray-400">%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      
      <div className="fixed top-4 right-4 bg-gray-800 px-4 py-2 rounded-md flex items-center">
        <DollarSign size={18} className="text-yellow-500 mr-2" />
        <span className="font-bold">{balance.toFixed(2)}</span>
      </div>
    </div>
  );
}

export default App;