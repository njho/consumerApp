const defaultState = {
    user: null,
    email: null,
    password: null,
    firstName: null,
    lastName: null,
    phoneNumber: null,
    referral: null,
    userMeta : {},
    userPayment: {},
    userJobs: [],

    userInfoUpdated: false,
    vehicles: [],
    creditCards: [],
    promotions: [],
    availableSentPromos: 0,
    receivedPromos: 0

};

export default (state = defaultState, action) => {
    switch (action.type) {
        case 'SET_EMAIL':
            return {
                ...state,
                email: action.value
            };
        case 'SET_PASSWORD':
            return {
                ...state,
                password: action.value
            };
        case 'SET_FIRST_NAME':
            return {
                ...state,
                firstName: action.value
            };
        case 'SET_LAST_NAME':
            return {
                ...state,
                lastName: action.value
            };
        case 'SET_PHONE_NUMBER':
            return {
                ...state,
                phoneNumber: action.value
            };
        case 'SET_USER':
            return {
                ...state,
                user: action.value
            };
        case 'SET_INITIAL_REFERRAL':
            return {
                ...state,
                referral: action.value
            };

        case 'USER_INFO_UPDATED':
            return {
                ...state,
                userInfoUpdated: action.value
            };
        case 'SET_USER_VEHICLES':
            return {
                ...state,
                vehicles: action.value
            };
        case 'SET_USER_CREDIT_CARDS':
            return {
                ...state,
                creditCards: action.value
            };
        case 'SET_USER_PROMOTIONS':
            return {
                ...state,
                promotions: action.value,
                availableSentPromos: action.availableSentPromos,
                receivedPromos: action.receivedPromos
            };
        case 'SET_USER_META':
            return {
                ...state,
                userMeta: action.value
            };
        case 'SET_USER_JOBS':
            return {
                ...state,
                userJobs: action.value
            };
        case 'SET_USER_PAYMENT':
            return {
                ...state,
                userPayment: action.value
            };
    }

    return state;
};
