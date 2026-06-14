import { useState } from 'react';
import PackersMovers from './pages/PackersMovers';
import ThankYou from './pages/ThankYou';

type Page = 'home' | 'thank-you';

function App() {
  const [page, setPage] = useState<Page>('home');

  if (page === 'thank-you') {
    return <ThankYou onBack={() => setPage('home')} />;
  }

  return <PackersMovers onSuccess={() => setPage('thank-you')} />;
}

export default App;
