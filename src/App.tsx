import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout';
import { BadgeList } from './components/BadgeList';
import { BadgeRendererPage } from './renderer/BadgeRendererPage';
import { BadgeCreatorPage } from './creator/BadgeCreatorPage';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<BadgeList />} />
        <Route path="/badge/:id" element={<BadgeRendererPage />} />
        <Route path="/creator" element={<BadgeCreatorPage />} />
        <Route path="/creator/:id" element={<BadgeCreatorPage />} />
      </Route>
    </Routes>
  );
}

export default App;
