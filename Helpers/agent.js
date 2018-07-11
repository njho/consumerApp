import React from 'react';
import firebase from 'react-native-firebase';
import NavigationService from '../Helpers/NavigationService';

const authService = firebase.auth();
const firestore = firebase.firestore();

const database = firebase.database();
const storage = firebase.storage();

const Auth = {
    current: () => {
        return new Promise(function (resolve, reject) {
            authService.onAuthStateChanged(function (user) {
                if (user) {
                    resolve(user);
                } else {

                }
            })
        })
    },
    login: (email, password) => {
        return dispatch => {
            authService.signInWithEmailAndPassword(email, password)
                .then((user) => {
                    // Success
                    console.log('success');
                    console.log(user)
                    console.log(user.additionalUserInfo.isNewUser)

                })
                .catch((error) => {
                    console.log('error');
                    console.log('Do I still access ' + email + password);
                    return authService.createUserWithEmailAndPassword(email, password)
                })
                .then((user) => {
                    console.log(user);

                }).catch((error) => {
                console.log(error.code);
                console.log(error.message);
            });
        };

    },
    register: (email, password) => {
        return authService.createUserWithEmailAndPassword(email, password);
    },
    logout: () => {
        authService.signOut();
    }
};


const getters = {
    getUser: (uid) => {
        return dispatch => {
            console.log(uid);

            firestore.collection('users').doc(uid).onSnapshot(doc => {
                if (!doc.exists) {
                    return null
                } else {

                    console.log('Document data:', doc.data());
                }
            })
        }
    },
    getUserVehicles: (uid) => {
        return dispatch => {
            firestore.collection('users').doc(uid).collection('vehicles').onSnapshot(querySnapshot => {
                let array = [];
                querySnapshot.forEach(function (doc) {
                    console.log(doc.id);
                    array.push({
                        ...doc.data(),
                        id: doc.id,
                        title: `${doc.data().make + ' ' + doc.data().model}`,
                        subtitle: `${doc.data().year + ' ' + doc.data().color + ' ' + doc.data().license}`,
                    });
                });
                console.log(array);
                dispatch({
                    type: 'SET_USER_VEHICLES',
                    value: array
                });
            })
        }
    },
    getUserMeta: (uid) => {
        return dispatch => {
            firestore.collection('users').doc(uid).get().then(doc => {

                if (!doc.exists) {
                    return null
                } else {

                    let firstNavigation;
                    console.log('Document data:', doc.data());
                    if (typeof (doc.data().walkthroughCompleted) === 'undefined') {
                        firstNavigation = 'WalkThrough';
                    } else if (typeof doc.data().firstName === 'undefined' && typeof doc.data().lastName === 'undefined' && typeof doc.data().phone === 'undefined' && typeof doc.data().email === 'undefined' && typeof doc.data().walkthroughCompleted !== 'undefined') {
                        firstNavigation = 'InitialDetails';
                    } else {
                        firstNavigation = 'Home'
                    }
                    dispatch({
                        type: 'SET_USER_META',
                        value: doc.data(),
                        firstNavigation: firstNavigation
                    });
                }
            })
        }
    },
    getUserJobs: (uid) => {
        return dispatch => {
            firestore.collection('users').doc(uid).collection('jobs').onSnapshot(querySnapshot => {
                let array = [];
                querySnapshot.forEach(function (doc) {
                    console.log(doc.id);
                    array.push({
                        ...doc.data(),
                        jobId: doc.id,
                        timestamp: doc.data().timestamp
                    });
                });
                console.log(array);
                dispatch({
                    type: 'SET_USER_JOBS',
                    value: array
                });
            })
        }
    },
    getJobInformation: (jobId) => {
        return firestore.collection('jobs').doc('calgary').collection('jobs').doc(jobId)
    },
    getUserCreditCards: (uid) => {
        return dispatch => {
            firestore.collection('users').doc(uid).collection('creditCards').onSnapshot(querySnapshot => {
                let array = [];
                querySnapshot.forEach(function (doc) {
                    console.log(doc.id);
                    array.push({
                        ...doc.data(),
                        id: doc.id,
                    });
                });
                console.log(array);
                dispatch({
                    type: 'SET_USER_CREDIT_CARDS',
                    value: array
                });


            })
        }
    },
    getZones: (city) => {
        return dispatch => {
            firestore.collection('zones').doc(city).collection('zones').onSnapshot(querySnapshot => {
                let array = [];
                querySnapshot.forEach(function (doc) {
                    console.log(doc.id);
                    array.push({
                        ...doc.data(),
                        id: doc.id,
                    });
                });
                dispatch({
                    type: 'SET_AVAILABLE_ZONES',
                    value: array
                });


            })
        }
    },
};


const setters = {
    setInitialUser: (uid, email, timestamp) => {
        //CHECK IF THE USER EXISTS
        let user = firestore.collection('users').doc(uid).get().then(doc => {
                if (!doc.exists) {
                    firestore.collection('users').doc(uid).set({
                        uid: uid,
                        email: email,
                        initialCreation: timestamp
                    });
                } else {
                    console.log('Document data:', doc.data());
                }
            })
            .catch(err => {
                console.log('Error getting document', err);
            });
    },
    setInitialUserDetails: (uid, firstName, lastName, email, phoneNumber) => {
        return dispatch => {
            firestore.collection('users').doc(uid).set({
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    phoneNumber: phoneNumber,
                    walkthroughCompleted: true
                }, {merge: true})
                .then((docRef) => {
                    dispatch({
                        type: 'USER_INFO_UPDATED',
                        value: true
                    });
                });
        }
    },
};


const actions = {
    sendFeedback: (uid, feedback) => {
        return dispatch => {
            firestore.collection('feedback').add({
                    uid: uid,
                    feedback: feedback,
                    timestamp: Date.now()
                })
                .then((docRef) => {
                    console.log(docRef);
                    NavigationService.navigate('Home');

                });
        }
    },
    sendVehicleInformation: (uid, vehicleObject, isNew, docId) => {
        return dispatch => {
            console.log(isNew);
            console.log(vehicleObject);
            console.log(uid);
            console.log(docId);
            if (isNew) {
                firestore.collection('users').doc(uid).collection('vehicles').add(vehicleObject)
                    .then((docRef) => {
                        console.log(docRef.id)
                        NavigationService.navigate('Settings');
                    });
            } else {
                firestore.collection('users').doc(uid).collection('vehicles').doc(docId).set(vehicleObject)
                    .then((docRef) => {
                        console.log('set successfully');
                        NavigationService.navigate('Settings');
                    });
            }
        }
    },
    deleteVehicle: (uid, docId) => {
        return dispatch => {
            console.log('delete teh vehicle');
            console.log(uid);
            console.log(docId);

            firestore.collection('users').doc(uid).collection('vehicles').doc(docId).delete()
                .then((docRef) => {
                    console.log('deletion complete');
                    NavigationService.navigate('Settings');
                });

        }
    },
    deleteCreditCard: (uid, docId) => {
        console.log('Delete Credit Card');
        console.log(docId);
        return dispatch => {
            firestore.collection('users').doc(uid).collection('creditCards').doc(docId).delete()
                .then((docRef) => {
                    console.log('deletion complete');
                    NavigationService.navigate('Settings');
                });

        }
    },
    createStripeCustomer: (body) => {
        console.log(body);

        return fetch('https://us-central1-surefuelapp.cloudfunctions.net/createCustomerAccount', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        }).then((response => console.log(response)))
    },
    updateStripeCustomer: (body) => {
        console.log(body);
        return fetch('https://us-central1-surefuelapp.cloudfunctions.net/updateCustomerAccount', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        }).then((response => console.log(response)))
    },
    createCharge: (uid, chargeSource) => {
        return dispatch => {
            console.log('This is the charge');
            firestore.collection('charges').add({
                    uid: 'HajsTFokAmh7KJq8bnXdrHPqo9G2',
                    chargeSource: 'card_1ClJpVBynFeLvZKLI9XP39eq',
                    chargeDescription: 'Sure Fuel App Order',
                    chargeAmount: 500000,
                    isChargeAuth: false,
                    chargeServiceFee: 2000
                })
                .then((docRef) => {
                    console.log(docRef);
                    NavigationService.navigate('Home');
                });
        }
    },
    cancelOrder: (jobId) => {
        return dispatch => {
            console.log('cancel the order')

            const ref = firestore.collection('jobs').doc('calgary').collection('jobs').doc(jobId).set({cancelled: true}, {merge: true})
                .then((docRef) => {
                    console.log(docRef);
                    NavigationService.navigate('Orders');
                });
        }
    },
    createOrder: (fillAmount, octane, octanePrice, approximateLoad, start, end, orderHour, servicesSelected, windshieldCost, tireCost, topUpCost, lat, lng, uid, total) => {
        return dispatch => {
            console.log('This is the charge');

            console.log({
                uid: uid,
                servicesSelected: servicesSelected,
                fillAmount: fillAmount,
                servicesCosts: {
                    windshield: windshieldCost * 100,
                    tireCost: tireCost * 100,
                    topUpCost: topUpCost * 100,
                    total: total * 100
                },
                charge: {
                    chargeSource: 'card_1ClJpVBynFeLvZKLI9XP39eq',
                    chargeDescription: 'Sure Fuel App Order',
                    chargeAmount: 500000,
                    isChargeAuth: false,
                    chargeServiceFee: 2000
                },
                octane: octane,
                octanePrice: octanePrice,
                route: {
                    coordinates: {
                        name: uid,
                        lat: lat,
                        lng: lng,
                    },
                    start: start,
                    end: end,
                    duration: 15,
                    load: approximateLoad
                },
                driver: null,
            });

            const ref = firestore.collection('jobs').doc('calgary').collection('jobs').doc();
            console.log(ref.id)  // prints the unique id
            ref.set({
                    customerUid: uid,
                    timestamp: Date.now(),
                    servicesSelected: servicesSelected,
                    fillAmount: fillAmount,
                    servicesCosts: {
                        windshield: windshieldCost * 100,
                        tireCost: tireCost * 100,
                        topUpCost: topUpCost * 100,
                        total: total * 100
                    },
                    charge: {
                        chargeSource: 'card_1ClJpVBynFeLvZKLI9XP39eq',
                        chargeDescription: 'Sure Fuel App Order',
                        chargeAmount: total * 100,
                        isChargeAuth: false,
                        chargeServiceFee: 2000
                    },
                    octane: octane,
                    octanePrice: octanePrice,
                    routing: {
                        location: {
                            name: ref.id,
                            lat: lat,
                            lng: lng,
                        },
                        start: start,
                        end: end,
                        duration: 15,
                        load: approximateLoad
                    },
                    driverId: null,
                    cancelled: false,
                    chargeCaptured: false,
                    authorized: false,
                })
                .then((docRef) => {
                    console.log(docRef);
                    NavigationService.navigate('Home');
                });
        }
    },
    createDriver: (object) => {
        console.log('create driver');
        firestore.collection('drivers').doc('calgary').collection('activeDrivers').add(object)
            .then((docRef) => {
                console.log(docRef);
                NavigationService.navigate('Home');
            });

    },

}


export default {
    Auth,
    getters,
    setters,
    actions
};
