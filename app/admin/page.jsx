"use client";
import React from 'react'

const Admin = () => {

    const addBalance = async (event) => {
        event.preventDefault(); // Prevent the default form submission behavior
        const formData = new FormData(event.target);
        const data = {
            asset: formData.get('currency'),
            email: formData.get('email'),
            amount: formData.get('amount')
        };

        const res = await fetch('http://localhost:8080/api/admin/topup', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        });

        const resData = await res.json();

        if (res.status === 200) {
            alert('Balance added successfully');
        } else {
            alert(resData.message);
        }


    }

    return (
        <div className='h-full w-full flex justify-center items-center'>
            <form onSubmit={addBalance} className='flex flex-col gap-5 px-4 py-3 border border-slate-400 rounded-lg'>
                <h1>Add Balance</h1>
                <select name="currency">
                    <option value='BTC'>BTC</option>
                    <option value='USDT'>USDT</option>
                    <option value='ETH'>ETH</option>
                </select>
                <input type="email" name="email" placeholder='Enter email' />
                <input type='number' name="amount" placeholder='Enter amount' />
                <button type='submit' className='bg-blue-400'>Add Balance</button>
            </form>
        </div>
    );
}

export default Admin;