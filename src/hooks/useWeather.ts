import axios from "axios";
import {z} from "zod"
import { SearchType } from "../types";
import { useMemo, useState } from "react";

// function isWeatherResponses(weather: unknown):weather is Weather{
//     return(
//         Boolean(weather) &&
//         typeof weather === "object" &&
//         typeof (weather as Weather).name === "string" &&
//         typeof (weather as Weather).main.temp === "number" &&
//         typeof (weather as Weather).main.temp_max === "number" &&
//         typeof (weather as Weather).main.temp_min === "number" 
//     )
// }


// Zod

const Weather = z.object({
    name : z.string(),
    main : z.object({
        temp: z.number(),
        temp_max: z.number(),
        temp_min: z.number()
    })
})

export type Weather = z.infer<typeof Weather>

const initialState = {
    name : "",
        main:{
            temp: 0,
            temp_max: 0,
            temp_min: 0
        }
}

export default function useWeather(){
    const [weather, setWeather] = useState<Weather>(initialState)
    const [notFound, setNotFound] = useState(false)
    const [loading, setLoading] = useState(false)
    const fetchWeather = async(search: SearchType)=>{
        setLoading(true)
        setWeather(initialState)
        try {
            const appId = import.meta.env.VITE_API_KEY
            const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${search.city},${search.country}&appid=${appId}`

            const {data}  = await axios(geoUrl)
              // comprobar si existe la ciudad
              
              if(!data[0]){
                setNotFound(true)
                return
              }
            const lat = data[0].lat
            const lon = data[0].lon
            
            const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${appId}`
            
            //const {data: weatherResult} = await axios(weatherUrl)
            //console.log(weatherResult.temp)
            //console.log(weatherResult.name)

            // //Type Guards
            // const {data: weatherResult} = await axios(weatherUrl)
            // const result = isWeatherResponses(weatherResult)

            // if(result){
            //     console.log(weatherResult.name)
            // }else{
            //     console.log("Respuesta mal formada")
            // }

            // Zod 
         const {data: weatherResult} = await axios(weatherUrl)
         const result = Weather.safeParse(weatherResult)

         if(result.success){
            setWeather(result.data)
         }

        } catch (error) {
            console.log(error)
        } finally{
            setLoading(false)
        }

    }

    const hasWeatherData = useMemo(()=>weather.name,[weather])

    return{
        weather,
        loading,
        fetchWeather,
        hasWeatherData,
        notFound
        
    }
}