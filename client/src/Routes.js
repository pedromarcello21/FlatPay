import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Transactions from './components/Transaction/Transactions';
import StatsPage from './pages/StatsPage';
import FriendshipPage from './pages/FriendshipPage';
import TransactionHistoryPage from './pages/TransactionHistoryPage'; 

function Routes({ currentUser }) {
  if (!currentUser) return <Redirect to="/" />;

  return (
    <Switch>
      <Route exact path="/">
        <Transactions currentUser={currentUser} />
      </Route>
      <Route path="/transaction-history">
        <TransactionHistoryPage currentUser={currentUser} />
      </Route>
      <Route path="/stats">
        <StatsPage currentUser={currentUser} />
      </Route>
      <Route path="/friendship">
        <FriendshipPage currentUser={currentUser} />
      </Route>
    </Switch>
  );
}

export default Routes;
