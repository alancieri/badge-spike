import { Routes, Route } from 'react-router-dom';
import { BadgeList } from './components/BadgeList';
import { BadgeRendererPage } from './renderer/BadgeRendererPage';
import { BadgeCreatorPage } from './creator/BadgeCreatorPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<BadgeList />} />
      <Route path="/badge/:id" element={<BadgeRendererPage />} />
      <Route path="/creator" element={<BadgeCreatorPage />} />
      <Route path="/creator/:id" element={<BadgeCreatorPage />} />
    </Routes>
  );
}

export default App;
