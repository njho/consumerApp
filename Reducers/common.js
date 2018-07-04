const defaultState = {
    octane: null,
    loginState: 0,
    orderHour: 0,
    servicesSelected: [false, false, false],
    feedback: null

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
    }

    return state;
};
