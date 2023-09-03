import logo from './logo.svg';
import './App.css';
import {useState , useRef, useEffect} from 'react'
import * as mqtt from 'mqtt/dist/mqtt.min' // import everything inside the mqtt module and give it the namespace "mqtt"
// import GaugeChart from 'react-advanced-gauge-chart'
import GaugeChart from 'react-gauge-chart'



function App() {
  
let broker = "ws://broker.emqx.io:8083/mqtt"
let topic1 = "python/led"
let topic2 = "python/sensor"
const clientId = "emqx_react_" + Math.random().toString(16).substring(2, 8);
let username = 'dev'
let password = 'dev@123'
const client = mqtt.connect(broker, {
  clientId,
  username,
  password,
});

const [sensorData, setsensorData] = useState({})

useEffect(()=>{
  console.log("UseEffect")
  
  client.subscribe(topic2,()=>{
    console.log("subscribed topic 2")
    client.on('message',(topic2,message) =>{
      console.log("topic>>>message",topic2 , message.toString());
      setsensorData(message.toString().split(','))
  })    
  })

},[])

console.log("topic>>>message",topic2 , sensorData);

const on_connect = () =>{
  client.on('connect',()=>{
    console.log("connected.....")
    client.subscribe(topic1,()=>{
      console.log("subscribed")
    })
  })
}

on_connect()

  const toggle_light = () =>{
    settoggleLight(!toggleLight)
    console.log("toggle",toggleLight)
    
    if (client) {
      if(!toggleLight)
      {
        client.publish(topic1,"on", (error) => {
          if (error) {
            console.log("Publish error: ", error);
          }
        });
      }
      else{
        client.publish(topic1,"off", (error) => {
          if (error) {
            console.log("Publish error: ", error);
          }
        });        
      }
    }
  }

  // general purpose Variables
  const [toggleLight, settoggleLight] = useState(false)
  const temperature = require("./assets/temperature.png")
  const humidity = require("./assets/humidity.png")

  return (
    <div className="App">
      <div className="main">
        <div className="light-section">
          <div className="bulb-button" onClick={()=>toggle_light()} style={{backgroundColor : !toggleLight ? 'red': 'green' ,boxShadow : !toggleLight ? '-2px 1px 25px 4px red': '-2px 1px 25px 4px green' }}>
            {!toggleLight ? 'OFF' : 'ON'}
          </div>
        </div>

      <div className="sensor-section">
        <div className='charts'>
            <div>
              
            <GaugeChart id="gauge-chart1" 
              nrOfLevels={30} 
              colors={["#077504", "#ff8800"]} 
              arcWidth={0.3} 
              textColor='#313035'
              percent={Number(sensorData[0])/100} 
              />
              <h2 style={{color:"#313035"}}>Temperature</h2>
            </div>
          
          <div style={{display:"block"}}>
                <GaugeChart id="gauge-chart5"
                  nrOfLevels={420}
                  arcsLength={[0.3, 0.5, 0.2]}
                  colors={['#5BE12C', '#F5CD19', '#EA4228']}
                  percent={Number(sensorData[1])/100}
                  textColor='#313035'
                  arcPadding={0.02}
                />
                <h2 style={{color:"#313035"}}>Humidity</h2>
            </div>
          </div>
        {/* <div className='sensor-details'>   


          <h2 style={{color:"#FFFF"}}>Sensor Data</h2>
          <div className='sensor-item'>
            <img className='icons' src={temperature}></img>
            <span>50 Celcius</span>
          </div>
          <div className='sensor-item'>
            <img className='icons' src={humidity}></img>
            <span>50 Celcius</span>
          </div>
          <div className='sensor-item'>
            <img className='icons' src={temperature}></img>
            <span>50 Celcius</span>
          </div>

        </div> */}
      </div>
      </div>
    </div>
  );
}

export default App;
