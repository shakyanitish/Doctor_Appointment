import React, { useContext, useEffect, useState } from 'react';
import { AppContex } from '../Context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const MyAppointments = () => {
  const { backendUrl, token } = useContext(AppContex);
  const [appointment, setAppointments] = useState([])
  const getuserAppointment =async ()=>{
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/appointments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if(data.success){
        setAppointments(data.appointments.reverse())
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
      
    }
  }
  const  cancelAppointment=  async(appointmentId)=>{
    try {
          const {data} = await axios.post(backendUrl+'/api/user/cancel-appointment', {appointmentId}, {
            headers: { Authorization: `Bearer ${token}` }
          })
          if(data.success){
            toast.success(data.message)
            getuserAppointment()
          }
          else{
            toast.error(data.message)
          }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
      
    }
  }
  useEffect(()=>{
    if(token){
      getuserAppointment()
    }
  },[token])

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-center">My Appointments</h2>
      <div className="space-y-6">
        {appointment.map((item, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-lg flex flex-col md:flex-row items-center md:items-start gap-4">
            <div className="w-24 h-24 flex-shrink-0">
              <img src={item.docData.image} alt={item.name} className="w-full h-full object-cover rounded-full border border-gray-300" />
            </div>
            <div className="flex-1">
              <p className="text-lg font-semibold">{item.docData.name}</p>
              <p className="text-sm text-gray-600">{item.docData.speciality}</p>
              <p className="mt-2 font-medium">Address:</p>
              <p className="text-sm text-gray-600">{item.docData.address.line1}</p>
              <p className="text-sm text-gray-600">{item.docData.address.line2}</p>
              <p className="mt-2 text-sm font-medium"><span className="font-semibold">Date & Time:</span> {item.slotDate} {item.slotTime}</p>
            </div>
            <div className="flex flex-col gap-2 md:flex-row md:gap-4">
             {!item.cancelled &&  <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-400 transition">Pay Online</button>}
              {!item.cancelled &&<button onClick={()=>{cancelAppointment(item._id)}}  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">Cancel Appointment</button>}
              {item.cancelled && <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">Appointment Cancelled</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAppointments;
