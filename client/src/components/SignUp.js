import React, { Fragment, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert';
import { useHistory } from 'react-router-dom';
import AuthContext from '../context/Auth';

const SignUp = () => {
  const history = useHistory();
  // eslint-disable-next-line
  const [state, dispatch] = useContext(AuthContext);

  const intialState = {
    name: '',
    email: '',
    password: '',
    errors: {
      email: '',
      password: '',
    },
  };
  const [loginDetState, setLoginDetState] = useState(intialState);
  const { name, email, password, errors } = loginDetState;

  const validate = () => {
    let count = 0;

    Object.keys(loginDetState).forEach((e) => {
      if (!loginDetState[e]) {
        let name = e.replace(/([A-Z])/g, ' $1').trim();
        name = name.charAt(0).toUpperCase() + name.slice(1);
        errors[e] = `${name} is required`;
        ++count;
      } else {
        errors[e] = '';
      }
    });

    if (count > 0) {
      swal('Alert', 'Check for Errors');
      return false;
    }
    return true;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    let obj = { ...loginDetState };

    if (validate()) {
      delete obj['errors'];

      axios
        .post(`api/auth/signup`, loginDetState)
        .then((response) => {
          const { data, status, message } = response.data;
          dispatch({ type: 'auth', payload: data });
          if (response.status === 201) {
            swal({
              title: status,
              text: message,
              closeOnClickOutside: false,
              closeOnEsc: false,
            }).then((willDelete) => {
              if (willDelete) {
                history.replace('/home');
              }
            });
          }
        })
        .catch((error) => {
          const { response } = error;

          const { data, status, message } = response.data;

          swal(status, message);
          if (response.status === 422) {
            data.forEach((e) => {
              errors[e.param] = e.msg;
            });

            setLoginDetState({ ...loginDetState });
          } else {
          }
        });
    }

    setLoginDetState({ ...loginDetState });
  };

  const handleChange = (event) => {
    let { value, name } = event.target;
    errors[name] = '';

    setLoginDetState({ ...loginDetState, [name]: value });
  };

  return (
    <Fragment>
      <main>
        <div className='row'>
          <div className='col s12 m4 offset-m4'>
            <div className='card'>
              <div className='card-content'>
                <span className='card-title center-align indigo-text'>
                  SIGN UP
                </span>
                <form onSubmit={handleSubmit} method='post'>
                  <div className='row'>
                    <div className='input-field col s12'>
                      <input
                        className='validate'
                        type='text'
                        name='name'
                        id='name'
                        value={name}
                        onChange={handleChange}
                      />
                      <label htmlFor='name'>Enter your name</label>
                      <span className='error'>{errors.name}</span>
                    </div>
                  </div>

                  <div className='row'>
                    <div className='input-field col s12'>
                      <input
                        className='validate'
                        type='email'
                        name='email'
                        id='email'
                        value={email}
                        onChange={handleChange}
                      />
                      <label htmlFor='email'>Enter your email</label>
                      <span className='error'>{errors.email}</span>
                    </div>
                  </div>

                  <div className='row'>
                    <div className='input-field col s12'>
                      <input
                        className='validate'
                        type='password'
                        name='password'
                        id='password'
                        value={password}
                        onChange={handleChange}
                      />
                      <label htmlFor='password'>Enter your password</label>
                      <span className='error'>{errors.password}</span>
                    </div>
                  </div>

                  <br />
                  <center>
                    <div className='row'>
                      <button
                        type='submit'
                        name='btn_login'
                        className='col s12 btn btn-large waves-effect indigo'
                      >
                        Sign up
                      </button>
                    </div>
                    <Link className='indigo-text center-allign' to='/'>
                      Have Account Sign in
                    </Link>
                  </center>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Fragment>
  );
};

export default SignUp;
