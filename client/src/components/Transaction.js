import React, { Fragment, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert';
import { Link } from 'react-router-dom';
import M from 'materialize-css';

const Transaction = () => {
  const history = useHistory();
  let { transId } = useParams();

  const intialState = {
    customerName: '',
    amount: '',
    description: '',
    type: '',
    errors: {
      customerName: '',
      amount: '',
      description: '',
      type: '',
    },
  };
  const [loginDetState, setLoginDetState] = useState(intialState);
  const { customerName, amount, description, type, errors } = loginDetState;

  useEffect(() => {
    if (transId) {
      axios.get(`/api/transaction/${transId}`).then(({ data }) =>
        setLoginDetState((prev) => {
          return {
            ...prev,
            customerName: data.customerName,
            amount: data.amount,
            description: data.description,
            type: data.type,
          };
        })
      );
    }
  }, [transId]);

  useEffect(() => {
    M.updateTextFields();
  });

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
      swal('Validation Error');
      return false;
    }
    return true;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    let obj = { ...loginDetState };

    if (validate()) {
      delete obj['errors'];

      let bodyArray = { ...loginDetState };
      let method = 'post';

      if (transId) {
        method = 'put';
        bodyArray['transId'] = transId;
      }

      axios({
        method: method,
        url: '/api/transaction',
        data: bodyArray,
      })
        .then((response) => {
          const { status, message } = response.data;
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
        })
        .catch((error) => {
          const { response } = error;

          const { data, message } = response.data;

          swal('Alert', message);
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
                  Enter Transaction
                </span>
                <form onSubmit={handleSubmit} method='post'>
                  <div className='row'>
                    <div className='input-field col s12'>
                      <input
                        className='validate'
                        type='text'
                        name='customerName'
                        id='customerName'
                        value={customerName}
                        onChange={handleChange}
                      />
                      <label htmlFor='customerName'>Enter your Name</label>
                      <span className='error'>{errors.customerName}</span>
                    </div>
                  </div>

                  <div className='row'>
                    <div className='input-field col s12'>
                      <input
                        className='validate'
                        type='number'
                        name='amount'
                        id='amount'
                        value={amount}
                        onChange={handleChange}
                      />
                      <label htmlFor='amount'>Enter Amount</label>
                      <span className='error'>{errors.amount}</span>
                    </div>
                  </div>

                  <div className='row'>
                    <div className='input-field col s12'>
                      <textarea
                        className='validate materialize-textarea'
                        type='text'
                        name='description'
                        id='description'
                        value={description}
                        onChange={handleChange}
                      ></textarea>
                      <label htmlFor='description'>Enter Description</label>
                      <span className='error'>{errors.description}</span>
                    </div>
                  </div>

                  <div className='row'>
                    <div className='input-field col s12'>
                      <select
                        className='browser-default'
                        value={type}
                        name='type'
                        id='type'
                        onChange={handleChange}
                      >
                        <option value=''>Choose your Card</option>
                        <option value='debit'>Debit</option>
                        <option value='credit'>Credit</option>
                      </select>
                      <span className='error'>{errors.type}</span>
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
                        Create Transaction
                      </button>
                    </div>
                    <Link className='indigo-text center-allign' to='/home'>
                      Back
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

export default Transaction;
