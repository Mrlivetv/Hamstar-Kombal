import React, { useContext, useState } from 'react';
import './App.css';
import Hamster from './icons/Hamster';
import { binanceLogo, dollarCoin, hamsterCoin } from './images';
import Info from './icons/Info';
import Settings from './icons/Settings';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Friends from './components/Friends/Friends';
import Airdrop from './components/Airdrop/Airdrop';
import { AuthContext } from './context/AuthContext';
import ErrorBoundary from './ErrorBoundary';
import AnimatedText from './AnimatedText';
import DepositBox from './DepositBox';

const MainPage: React.FC = () => {
  const { telegramId } = useContext(AuthContext);
  const [points, setPoints] = useState(0);
  const [clicks, setClicks] = useState<{ id: number; x: number; y: number }[]>([]);
  const pointsToAdd = 10;
  const pointsForNextLevel = 100;

  const navigate = useNavigate();

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    card.style.transform = `perspective(1000px) rotateX(${Math.min(Math.max(-15, -y / 10), 15)}deg) rotateY(${Math.min(Math.max(-15, x / 10), 15)}deg)`;
    setTimeout(() => {
      card.style.transform = '';
    }, 100);

    setPoints(points + pointsToAdd);
    setClicks([...clicks, { id: Date.now(), x: e.pageX, y: e.pageY }]);
  };

  const handleAnimationEnd = (id: number) => {
    setClicks((prevClicks) => prevClicks.filter((click) => click.id !== id));
  };

  return (
    <div className="bg-black flex justify-center">
      <div className="w-full bg-black text-white h-screen font-bold flex flex-col max-w-xl">
        <div className="px-4 z-10">
          <div className="flex items-center space-x-2 pt-4">
            <div className="p-1 rounded-lg bg-[#1d2025]">
              <Hamster size={24} className="text-[#d4d4d4]" />
            </div>
          </div>
          <div className="flex items-center justify-between space-x-4 mt-1">
            <div className="flex items-center w-1/3">
              <div className="w-full">
                <div className="flex justify-between">
                  <AnimatedText />
                </div>
                <div className="w-full bg-[#16181c] rounded-full h-2">
                  <div className="bg-gradient-to-r h-2 rounded-full" style={{ width: `${(points / pointsForNextLevel) * 100}%` }}></div>
                </div>
              </div>
            </div>
            <div className="w-1/6">
              <img src={binanceLogo} alt="Binance Logo" className="h-auto max-w-full" />
            </div>
            <div className="w-1/3 flex justify-end">
              <div className="text-sm flex items-center">
                <p>+10</p>
                <img src={dollarCoin} alt="Dollar Coin" className="ml-1 h-5 w-auto" />
              </div>
            </div>
          </div>
        </div>
        <div className="relative h-screen bg-[#1d2025] text-white flex flex-col items-center justify-center">
          <div className="text-center mb-4 z-20">
            <DepositBox telegramId={telegramId} />
          </div>
        </div>
        <div className="relative bg-[#1d2025] p-4 rounded-t-2xl mt-4 z-10 max-w-full">
          <div className="text-sm mt-4 flex items-center justify-between">
            <button onClick={() => navigate('/friends')} className="p-2 bg-[#1d2025] rounded-lg">
              <Info size={24} className="text-[#d4d4d4]" />
            </button>
            <button onClick={() => navigate('/airdrop')} className="p-2 bg-[#1d2025] rounded-lg">
              <Settings size={24} className="text-[#d4d4d4]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Footer: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-[calc(100%-2rem)] max-w-xl bg-[#272a2f] flex justify-around items-center z-50 rounded-3xl text-xs">
      <div className="text-center text-[#85827d] w-1/4 cursor-pointer" onClick={() => navigate('/')}>
        <img src={binanceLogo} alt="Exchange" className="w-8 h-8 mx-auto" />
        <p className="mt-1">Exchange</p>
      </div>
      <div className="text-center text-[#85827d] w-1/4 cursor-pointer" onClick={() => navigate('/friends')}>
        <img src={hamsterCoin} alt="Friends" className="w-8 h-8 mx-auto" />
        <p className="mt-1">Friends</p>
      </div>
      <div className="text-center text-[#85827d] w-1/4 cursor-pointer" onClick={() => navigate('/airdrop')}>
        <img src={hamsterCoin} alt="Airdrop" className="w-8 h-8 mx-auto" />
        <p className="mt-1">Airdrop</p>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const { telegramId } = useContext(AuthContext);

  console.log('App Component - Telegram ID:', telegramId);

  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route
          path="/friends"
          element={
            telegramId ? (
              <Friends telegramId={telegramId} />
            ) : (
              <div>Error: Telegram ID is missing. Please log in.</div>
            )
          }
        />
        <Route path="/airdrop" element={<Airdrop />} />
      </Routes>
      <Footer />
    </ErrorBoundary>
  );
};

export default App;
