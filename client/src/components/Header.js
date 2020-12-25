import React, { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/Auth';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const Header = () => {
  const history = useHistory();
  // eslint-disable-next-line
  const [state, dispatch] = useContext(AuthContext);

  useEffect(() => {
    axios
      .get('api/auth/isLoggedIn')
      .then(({ data }) => {
        if (data) {
          dispatch({ type: 'auth', payload: data });
          history.replace('/home');
        }
        // eslint-disable-next-line
      })
      .catch((err) => {
        dispatch({ type: 'auth', payload: null });
      });
  }, [dispatch, history]);

  return (
    <header>
      <nav className='indigo'>
        <div className='nav-wrapper container'>
          <Link to='#' className='brand-logo'>
            Assignment
          </Link>
          {state.auth ? (
            <ul id='nav-mobile' className='right hide-on-med-and-down'>
              <li>
                <Link
                  to='#'
                  onClick={() => {
                    axios.get('/api/auth/logout').then((e) => {
                      dispatch({ type: 'auth', payload: null });
                      history.replace('/');
                    });
                  }}
                >
                  Logout
                </Link>
              </li>
            </ul>
          ) : (
            ''
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
