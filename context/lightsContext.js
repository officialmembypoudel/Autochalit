import { View, Text } from 'react-native'
import React, { Children, createContext, useContext, useState } from 'react'

export const LightsContext = createContext()
const AllLights = ({ children }) => {
    const [allLightsOn, setAllLightsOn] = useState(false)

    return (
        <LightsContext.Provider value={{ allLightsOn, setAllLightsOn }}>
            {children}
        </LightsContext.Provider>
    )
}

export default AllLights