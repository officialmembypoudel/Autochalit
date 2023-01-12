import React, { createContext, useEffect, useState } from 'react'
import { account } from '../configs/appwriteConfig';

export const AuthContext = createContext()
const TheAuthContext = ({ children }) => {
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);
    const [isSignedIn, setIsSignedIn] = useState(true);
    const [authCheck, setAuthCheck] = useState(false)
    useEffect(() => {
        const promise = account.get();

        promise.then(
            function (response) {
                setUser(response);
                setLoading(false);
                setIsSignedIn(true);
            },
            function (error) {
                console.log(error);
                setLoading(false);
                setIsSignedIn(false);
            }
        );
        console.log('running')
    }, [authCheck]);

    const logOut = () => {
        const promise = account.deleteSessions()

        promise.then(function (response) {
            setUser({})
            setIsSignedIn(false);
            // navigation.navigate('Login')
        }, function (error) {
            console.log(error)
        })
    }

    return (
        <>
            <AuthContext.Provider value={{ user, loading, setUser, logOut, isSignedIn, setIsSignedIn, setAuthCheck }}>
                {children}
            </AuthContext.Provider>
        </>
    )
}

export default TheAuthContext