import { View, Text } from 'react-native'
import React, { Children, createContext, useContext, useEffect, useState } from 'react'
import { axiosInstance } from '../configs/axiosConfig'
import { client, database } from '../configs/appwriteConfig'
import { Query } from 'appwrite'
import { AuthContext } from './authContext'

export const LightsContext = createContext()
const AllLights = ({ children }) => {
    const { refreshing, setRefreshing, setError } = useContext(AuthContext)
    const [allLightsOn, setAllLightsOn] = useState(null)
    const [allLights, setAllLights] = useState([])
    const [allLightsFromCloud, setAllLightsFromCloud] = useState()
    const [reloader, setReloader] = useState()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const promise = database.listDocuments('autochalid', 'appliances', [
            Query.search('type', 'light')
        ])

        promise.then(function (response) {
            setAllLightsOn(response.documents.every(light => light.state === true))

            // console.log('running from light context', response.documents.every(light => light.state === true))
        }, function (error) {
            setError(error)

        })

    }, [reloader, refreshing])

    useEffect(() => {
        if (allLightsOn !== null) {
            const promise = database.updateDocument('autochalid', 'appliances', 'allLights', { state: allLightsOn })

            promise.then(function (response) {
                // setAllLightsOn(response.documents.every(light=> light.state===true))
            }, function (error) {
                setError(error)

            })
        }
    }, [reloader, allLightsOn])

    useEffect(() => {
        const promise = database.getDocument('autochalid', 'appliances', 'allLights')
        promise.then(function (response) {
            setAllLightsOn(response.state)
        }, function (error) {
            setError(error)

        })

    }, [refreshing])

    useEffect(() => {
        if (allLightsOn !== null) {
            const alllightsMqtt = () => {
                setLoading(true)
                axiosInstance.get('/mqtt', {
                    params: {
                        topic: 'allLights',
                        message: allLightsOn ? 'on' : 'off'
                    }
                }).then(function (response) {
                    // console.log(response)
                    setLoading(false)
                }).catch(function (error) {
                    setError(error)

                })
            }
            alllightsMqtt()
        }
    }, [allLightsOn, refreshing])


    return (
        <LightsContext.Provider value={{ allLightsOn, setAllLightsOn, setReloader, allLightsFromCloud, reloader, setAllLights, setLoading, loading }}>
            {children}
        </LightsContext.Provider>
    )
}

export default AllLights