import React, { useReducer } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from '../components/Home';
import Login from '../components/Login';
import Transaction from '../components/Transaction';
import SignUp from '../components/SignUp';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AuthContext from '../context/Auth';
import authReducer from '../reducer/Auth.reducer';

const App = () => {
  const [state, dispatch] = useReducer(authReducer, { auth: null });

  return (
    <AuthContext.Provider value={[state, dispatch]}>
      <BrowserRouter>
        <Header />
        <Switch>
          <Route exact path='/'>
            <Login />
          </Route>
          <Route exact path='/sign-up'>
            <SignUp />
          </Route>
          <Route path='/home'>
            <Home />
          </Route>
          <Route path='/addTrans/:transId?'>
            <Transaction />
          </Route>
          <Route component={() => <div>404</div>} />
        </Switch>
        <Footer />
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

export default App;
