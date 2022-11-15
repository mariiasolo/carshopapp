import React, {useState, useEffect} from 'react';
import { API_URL, APi_URL} from '../constants';
import { AgGridReact } from 'ag-grid-react';
import Button from '@mui/material/Button';
import AddCar from './AddCar';
import EditCar from './EditCar';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';

function Carlist() {
    const [cars, setCars] = useState([]);

    const [columnDefs] = useState([
        { field: 'brand', sortable: true, filter: true },
        { field: 'model', sortable: true, filter: true },
        { field: 'color', sortable: true, filter: true },
        { field: 'fuel', sortable: true, filter: true, width: 110 },
        { field: 'year', sortable: true, filter: true, width: 110 },
        { field: 'price', sortable: true, filter: true, width: 130 },
        {
            width: 120,
            cellRenderer: params => <EditCar data ={params.data} updateCar={updateCar} />
        },
        {
            cellRenderer: params => 
            <Button color="error" size="small" onClick={() => deleteCar(params.data)}>
                Delete
            </Button>, 
            width: 120
        }
    ])

    useEffect(() =>{
        getCars();
    }, []);

    const getCars =() =>{
        //fetch cars
        fetch (API_URL + '/cars' )
        .then (response => {
            if (response.ok)
                return response.json();
            else 
                alert ('Something went wrong in fetch');
        })
        .then(data => setCars(data._embedded.cars))
        .catch(err => console.error (err))
    }

    const deleteCar = (data) =>{
        if (window.confirm('Are you sure?')){
            fetch(data._links.car.href, {method: 'DELETE'})
            .then (response => {
            if (response.ok)
                getCars();
            else
                alert ('Something went wrong in deletion');
        })
    }
    }

    const addCar =(car) =>{
        fetch(API_URL + "/cars", {
            method: 'POST',
            headers: {'Content-type':'application/json'},
            body: JSON.stringify(car)
        })
        .then(response => {
            if(response.ok)
                getCars();
            else
                alert('Something went wrong in addition');
        })
        .catch (err=> console.error(err))
    }

    const updateCar = (car, url) =>{
        fetch(url, {
            method: 'PUT', 
            headers: {'Content-type':'application/json'},
            body: JSON.stringify(car)
        })
        .then.apply(response => {
            if (response.ok)
                getCars();
            else 
                alert ('Something went wrong in edit')
 
        })
        .catch(err => console.error (err))
    }
    return(
        <>
        <AddCar addCar={addCar}/>
        <div className='ag-theme-material' style={{height: 600, width: '95%', margin: 'auto'}}>
        <AgGridReact
            rowData={cars}
            columnDefs={columnDefs}
            pagination = {true}
            paginationPageSize={10}>
        </AgGridReact>
        </div>
        </>
    );
};

export default Carlist;