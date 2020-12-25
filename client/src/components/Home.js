import React, { useEffect, useRef, useState } from 'react';
import M from 'materialize-css';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert';

// const Home = ({ auth, signIn }) => {

const Home = () => {
  const history = useHistory();
  const [tableData, setTableData] = useState([]);
  const [dateState, setDateState] = useState({
    fromDate: '',
    toDate: '',
    errors: {
      fromDate: '',
      toDate: '',
    },
  });

  const { fromDate, toDate, errors } = dateState;

  const fromDateRef = useRef();
  const toDateRef = useRef();

  useEffect(() => {
    const handleDate = () => {
      setDateState((prev) => {
        return {
          ...prev,
          fromDate: fromDateRef.current.value,
          toDate: toDateRef.current.value,
        };
      });
    };
    M.Datepicker.init(fromDateRef.current, {
      format: 'dd-mm-yyyy',
      autoClose: true,
      onClose: handleDate,
    });
    M.Datepicker.init(toDateRef.current, {
      format: 'dd-mm-yyyy',
      autoClose: true,
      onClose: handleDate,
    });

    fetchData();
  }, []);

  const fetchData = (url = '/api/transaction') => {
    axios.get(url).then(({ data }) => {
      setTableData(data);
    });
  };

  const handleChange = (event) => {
    let { value, name } = event.target;

    setDateState({ ...dateState, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const deleteUser = (transId) => {
    swal({
      title: 'Alert',
      text: 'Are you sure you want to delete this record',
      closeOnClickOutside: false,
      closeOnEsc: false,
      dangerMode: true,
      buttons: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios({
          method: 'delete',
          url: '/api/transaction',
          data: { transId },
        }).then((e) => {
          fetchData();
        });
      }
    });
  };

  return (
    <main className='container'>
      <form onSubmit={handleSubmit} className='row'>
        <div className='input-field col s4'>
          <input
            id='fromDate'
            value={fromDate}
            type='text'
            className='validate'
            ref={fromDateRef}
            onChange={handleChange}
          />
          <label className='active' htmlFor='fromDate'>
            From Date
          </label>
          <span className='error'>{errors.fromDate}</span>
        </div>
        <div className='input-field col s4'>
          <input
            id='toData'
            type='text'
            className='validate'
            value={toDate}
            ref={toDateRef}
            onChange={handleChange}
          />
          <label className='active' htmlFor='toData'>
            To Date
          </label>
          <span className='error'>{errors.toDate}</span>
        </div>
        <div className='input-field col s2'>
          <button
            className='indigo btn'
            onClick={() => {
              if (toDateRef.current.value && fromDateRef.current.value) {
                fetchData(
                  `/api/transaction?fromDate=${fromDateRef.current.value}&toDate=${toDateRef.current.value}`
                );
              } else swal('Invalid Date');
            }}
            type='button'
          >
            Search
          </button>
        </div>
        <div className='input-field col s2'>
          <Link to='/addTrans' className='indigo-text right'>
            <i className='small material-icons'>add_circle</i>
          </Link>
        </div>
      </form>
      <table className='centered'>
        <thead>
          <tr>
            <th>Customer Name</th>
            <th>Amount</th>
            <th>Description</th>
            <th>Type</th>
            <th>Settings</th>
          </tr>
        </thead>

        <tbody>
          {tableData > 0 ? (
            <tr>
              <td colSpan='5'>No Data</td>
            </tr>
          ) : (
            tableData.map((ev) => (
              <tr key={ev._id}>
                <td>{ev.customerName}</td>
                <td>{ev.amount}</td>
                <td>{ev.description}</td>
                <td>{ev.type}</td>
                <td>
                  <Link to='#' onClick={() => deleteUser(ev._id)}>
                    <i className='small indigo-text material-icons'>delete</i>
                  </Link>
                  <Link
                    to='#'
                    onClick={() => history.replace(`/addTrans/${ev._id}`)}
                  >
                    <i className='small indigo-text material-icons'>edit</i>
                  </Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </main>
  );
};

export default Home;
