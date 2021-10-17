import React, { useEffect } from 'react'
import '/css/alertas.css'
import { usePage } from '@inertiajs/inertia-react'


export default function Alertas() {
    const {flash}=usePage().props
    
    function closeAlert(type){
        var divsToHide = document.getElementsByClassName(type); //divsToHide is an array
        for(var i = 0; i < divsToHide.length; i++){
            divsToHide[i].style.visibility = "hidden"; // or
            divsToHide[i].style.display = "none"; // depending on what you're doing
        }
    }

    function openAlert(type){
        var divsToHide = document.getElementsByClassName(type); //divsToHide is an array
        for(var i = 0; i < divsToHide.length; i++){
            divsToHide[i].style.visibility = "visible"; // or
            divsToHide[i].style.display = "flex"; // depending on what you're doing
        }
    }

    useEffect(() => {
        openAlert('alert_error');
        openAlert('alert_success');
        openAlert('alert_message');
    }, [flash])

    return (
        <div className="errores">
        <ul>
            {flash.error &&  
               
                <li className="alert_error">
                    <div className="col s11">{flash.error}</div>
                    <div onClick={() => {closeAlert('alert_error')}} style={{"cursor":"pointer"}}><i className="col s1 tiny material-icons">clear</i></div>
                </li>
            }
            {flash.success &&  
               
               <li className="alert_success">
                    <div className="col s11">{flash.success}</div>
                    <div onClick={() => {closeAlert('alert_success')}} style={{"cursor":"pointer"}}><i className="col s1 tiny material-icons">clear</i></div>
                </li>
           }
           {flash.message &&  
               
               <li className="alert_message">
                    <div className="col s11">{flash.message}</div>
                    <div onClick={() => {closeAlert('alert_message')}} style={{"cursor":"pointer"}}><i className="col s1 tiny material-icons">clear</i></div>
                </li>
           }
        </ul>  
        </div>
    )
}