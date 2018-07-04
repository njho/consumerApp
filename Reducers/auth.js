const defaultState = {
    user: null,
    email: null,
    password: null,
    firstName: null,
    lastName: null,
    phoneNumber: null,

    userInfoUpdated: false
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
        case 'USER_INFO_UPDATED':
            return {
                ...state,
                userInfoUpdated: action.value
            };

    }

    return state;
};
