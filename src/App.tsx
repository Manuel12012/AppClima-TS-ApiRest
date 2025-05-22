import styles from "./App.module.css";
import Alert from "./components/Alert/Alert";
import Form from "./components/Form/Form";
import Spinner from "./components/Spinner/Spinner";
import WeatherDetail from "./components/WeatherDetail/WeatherDetail";
import useWeather from "./hooks/useWeather";
function App() {

    const{weather,fetchWeather,notFound,hasWeatherData,loading} = useWeather()
  return (
    <>
    <h1 className={styles.tittle}>Buscador de Clima</h1>
    
    <div className={styles.container}>
      <Form
      fetchWeather={fetchWeather}
      />

      {loading && <p>{<Spinner/>}</p>}
      {hasWeatherData && 
      <WeatherDetail
      weather={weather}/>
      }
      {notFound && <Alert>Ciudad No encontrada</Alert>}
    </div>
    </>
  )
}

export default App
 