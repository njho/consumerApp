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
                    if (typeof (doc.data().walkthroughCompleted) === 'undefined' || doc.data().walkthroughCompleted === false) {
                        firstNavigation = 'WalkThrough';
                    } else if (typeof doc.data().firstName === 'undefined' && typeof doc.data().lastName === 'undefined' && typeof doc.data().phone === 'undefined' && typeof doc.data().email === 'undefined' && typeof doc.data().walkthroughCompleted !== 'undefined') {
                        firstNavigation = 'InitialDetails';
                    } else {
                        firstNavigation = 'Home'; //Home
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
    getPaymentInfo: (uid) => {
        return dispatch => {
            firestore.collection('users').doc(uid).collection('paymentInfo').doc('stripeInformation').get().then(doc => {
                if (!doc.exists) {
                    return null
                } else {
                    dispatch({
                        type: 'SET_USER_PAYMENT',
                        value: doc.data(),
                    });
                }
            })
        }
    },
    getUserJobs: (uid) => {
        return dispatch => {
            firestore.collection('users').doc(uid).collection('jobs').orderBy('timestamp', 'desc').onSnapshot(querySnapshot => {
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
    getCodeInformation: (id) => {
        return firestore.collection('codes').doc(id)
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
    getUserPromotions: (uid) => {
        return dispatch => {
            firestore.collection('users').doc(uid).collection('codes').onSnapshot(querySnapshot => {
                let array = [];

                let availablePromos = 0;
                var itemsProcessed = 0;
                console.log(querySnapshot.size)

                querySnapshot.forEach(function (doc) {
                    firestore.collection('codes').doc(doc.id).get().then(codeData => {
                        console.log('user promo');
                        itemsProcessed++;

                        if (!codeData.exists) {
                            return null
                        } else {
                            array.push({
                                ...codeData.data(),
                                id: codeData.id,
                            });
                            if (codeData.data().status === 'activated' && ((codeData.data().issuer === uid && codeData.data().issuerRedeemed === false) || (codeData.data().receiver === uid && codeData.data().receiverRedeemed === false))) {
                                availablePromos++;
                            }

                            if (itemsProcessed === querySnapshot.size) {
                                dispatch({
                                    type: 'SET_USER_PROMOTIONS',
                                    value: array,
                                    availablePromos: availablePromos
                                });
                            }
                        }
                    });
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
                    //                        id: doc.id,

                    array.push({
                        ...doc.data(),
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
    setInitialUserDetails: (uid, firstName, lastName, email, phoneNumber, referral) => {
        return dispatch => {
            firestore.collection('users').doc(uid).set({
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    phoneNumber: phoneNumber,
                    walkthroughCompleted: true,
                    referral: referral
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
    sendVehicleInformation: (uid, vehicleObject, isNew, docId, redirect) => {
        return dispatch => {
            console.log(isNew);
            console.log(vehicleObject);
            console.log(uid);
            console.log(docId);
            if (isNew) {
                firestore.collection('users').doc(uid).collection('vehicles').add(vehicleObject)
                    .then((docRef) => {

                        console.log('This is the value of redirect => ' + redirect);
                        console.log(docRef.id)
                        if (redirect) {
                            NavigationService.navigate('OrderSummary');

                        } else if (redirect === null || typeof redirect === 'undefined' || redirect === 'undefined') {
                            NavigationService.navigate('Settings');

                        }
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
    createStripeCustomer: (body, redirect) => {
        console.log(body);
        console.log(redirect);
        return fetch('https://us-central1-surefuelapp.cloudfunctions.net/createCustomerAccount', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        }).then((response => {
                console.log(response);

                if (redirect) {
                    NavigationService.navigate('OrderSummary');

                } else {
                    NavigationService.navigate('Settings');

                }
            }

        ))
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
    createOrder: (fillAmount, octane, octanePrice, approximateLoad, start, end, orderHour, servicesSelected, windshieldCost, tireCost, topUpCost, lat, lng, uid, total, stripeInformation, vehicleInfo) => {
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
                vehicle: vehicleInfo,
                paymentInfo: stripeInformation

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
                    vehicle: vehicleInfo,
                    paymentInfo: stripeInformation,
                    driverStatus: null
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
    generateCode: (uid) => {
        return dispatch => {
            console.log('This is the Uid from generateCode' + uid);
            return fetch('https://us-central1-surefuelapp.cloudfunctions.net/generateCode\n', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    issuer: uid,
                    receiver: null,
                    timestamp: Date.now(),
                    type: '7for7',
                    status: 'new'
                })
            }).then((response => {
                    console.log(response);
                    dispatch({
                        type: 'SET_SHARE_CODE',
                        value: response
                    });
                }
            ));
        }

    },
    generateCodeAsync: async function (uid) {
        return fetch('https://us-central1-surefuelapp.cloudfunctions.net/generateCode\n', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                issuer: uid,
                receiver: null,
                timestamp: Date.now(),
                type: '7for7',
                status: 'new'
            })
        });
    },

}


export default {
    Auth,
    getters,
    setters,
    actions
};
