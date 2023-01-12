import { View, Text } from 'react-native'
import React, { Children, createContext, useContext, useEffect, useState } from 'react'
import { axiosInstance } from '../configs/axiosConfig'
import { client, database } from '../configs/appwriteConfig'
import { Query } from 'appwrite'

export const LightsContext = createContext()
const AllLights = ({ children }) => {
    const [allLightsOn, setAllLightsOn] = useState(false)
    const [allLights, setAllLights] = useState([])
    const [allLightsFromCloud, setAllLightsFromCloud] = useState()
    const [reloader, setReloader] = useState()
    const [singleLight, setSingleLight] = useState()

    useEffect(() => {
        const promise = database.listDocuments('autochalid', 'appliances', [
            Query.search('type', 'light')
        ])

        promise.then(function (response) {
            setAllLightsOn(response.documents.every(light => light.state === true))
            console.log('running from light context', response.documents.every(light => light.state === true))
        }, function (error) {
            console.log(error)
        })

    }, [reloader])

    useEffect(() => {
        const promise = database.updateDocument('autochalid', 'appliances', 'allLights', { state: allLightsOn })

        promise.then(function (response) {
            // setAllLightsOn(response.documents.every(light=> light.state===true))
        }, function (error) {
            console.log(error)
        })
    }, [reloader, allLightsOn])

    useEffect(() => {
        const promise = database.getDocument('autochalid', 'appliances', 'allLights')
        promise.then(function (response) {
            setAllLights(response.state)
        }, function (error) {
            console.log(error)
        })

    }, [])

    useEffect(() => {
        const alllightsMqtt = () => {
            axiosInstance.get('/mqtt', {
                params: {
                    topic: 'allLights',
                    message: allLightsOn ? 'on' : 'off'
                }
            }).then(function (response) {
                // console.log(response)
            }).catch(function (error) {
                // console.log(error)
            })
        }
        alllightsMqtt()
    }, [allLightsOn])

    return (
        <LightsContext.Provider value={{ allLightsOn, setAllLightsOn, setReloader, allLightsFromCloud, reloader, setAllLights }}>
            {children}
        </LightsContext.Provider>
    )
}

export default AllLights