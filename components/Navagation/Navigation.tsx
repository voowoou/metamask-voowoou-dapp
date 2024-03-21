import Button from '@mui/material/Button';
import { FC } from 'react';

interface NavigationProps {
  // Чтобы типизировать получаемые пропсы
  connect: () => Promise<void>;
  connected: boolean;
}

const Navigation: FC<NavigationProps> = ({ connect, connected }) => {
  return (
    <nav>
      <h2>Chain</h2>
      <Button variant="contained" onClick={connect}>
        Connect MetaMask
      </Button>
      <div></div>
    </nav>
  );
};

export default Navigation;
