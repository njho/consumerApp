const defaultState = {
    octane: 0,
    loginState: 0,
    orderHour: 0,
    orderFill: 0,
    servicesSelected: [false, false, false],
    feedback: null,
    zones: [],
    regular: 0,
    premium: 0,
    windshield: 0,
    topUp: 0,
    tire: 0,
    lat: 0,
    lng: 0,
    initialNavigation: null
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case 'OCTANE_SELECTED':
            return {
                ...state,
                octane: action.octane
            };
        case 'ORDER_HOUR_SELECTED':
            return {
                ...state,
                orderHour: action.value
            };
        case 'FILL_SELECTED':
            return {
                ...state,
                orderFill: action.value
            };
        case 'SET_LOGIN_STATE':
            return {
                ...state,
                loginState: action.value
            };

        case 'UPDATE_SERVICES_SELECTED':
            console.log(action.value);
            return {
                ...state,
                servicesSelected: action.value
            };
        case 'SET_FEEDBACK':
            return {
                ...state,
                feedback: action.value
            };
        case 'RESET_ALL_ORDER_INFO':
            return {
                ...state,
                loginState: 0,
                orderHour: 0,
                orderFill: 0,
                servicesSelected: [false, false, false],
            };
        case 'SET_AVAILABLE_ZONES':
            return {
                ...state,
                zones: action.value
            };
        case 'SET_RATES':
            console.log(action.value);
            return {
                ...state,
                regular: action.value.regular,
                premium: action.value.premium,
                windshield: action.value.windshield,
                topUp: action.value.topUp,
                tire: action.value.tire,

            };
        case 'SET_COORDINATES':
            console.log(action.value);
            return {
                ...state,
                lat: action.lat,
                lng: action.lng,

            };
        case 'SET_USER_META':
            console.log(action.value);
            return {
                ...state,
                firstNavigation: action.firstNavigation

            };

    }

    return state;
};
