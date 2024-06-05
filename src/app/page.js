'use client';

import "./style.css";
import "bootstrap/dist/css/bootstrap.min.css"; // Import bootstrap CSS
import { useState } from "react";
import Image from "next/image";
import dark from '../../public/dark.png'
import light from '../../public/light.png'
export default function Home() {

  const [query, setQuery] = useState({
    text: ""
  });
  const [data, setData] = useState([]);
  const [display, setDisplay] = useState(false);
  const [theme,setTheme] = useState(false)

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setQuery({ [name]: value });
  }

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'  // Specify content type as JSON
        },
        body: JSON.stringify(query)
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setData(data);
        setDisplay(true);

        if (data.prediction[0] === 0) {
          document.querySelector('.resultLabel').style.color = 'green';
        } else {
          document.querySelector('.resultLabel').style.color = 'red';
        }
      } else {
        console.error('Failed to get prediction:', response.status);
      }
    } catch (error) {
      console.error('Error getting prediction:', error);
    }
  }

  const switchTheme = () => {
    if(theme){
      setTheme(false)
    }
    else{
      setTheme(true)
    }
    document.body.classList.toggle("light-theme");
  }

  return (
    <main className="main">
         <div className="line">
<Image
      src={theme?light:dark}
      alt=""
      className='icon'
      width={40}
      onClick={switchTheme}
      />
    </div>
      <h1>SQLI Detection</h1>
      <div className="description">
        <p>This platform is used for testing the model's ability to detect SQL injection attacks.</p>
        <p>Please enter the SQL query in the text box below to detect if this query is a SQLi attack.</p>
      </div>
      <h1>Enter SQL query</h1>
      <form onSubmit={onSubmit}>
        <label htmlFor="text">Enter SQL query here</label>
        <input type={"text"} className="query" onChange={handleOnChange} name="text" />
        <input type={"submit"}></input>
        {
          display ? <div className="result">
            <h3>Your query is: {query.text}</h3>
            <h3 className="resultLabel">{data.prediction[0] == 0 ?
              "This is not a SQLi attack"
              :
              "This is a SQLi attack"
            }</h3>
          </div> : <></>
        }

      </form>

    </main>
  );
}