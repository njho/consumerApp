const defaultState = {
    octane: null,
    make: null,
    model: null,
    year: null,
    license: null

};

export default (state = defaultState, action) => {
    switch (action.type) {
        case 'SET_MAKE':
            console.log(action.value);
            return {
                ...state,
                make: action.value
            };
        case 'SET_MODEL':
            return {
                ...state,
                model: action.value
            };
        case 'SET_YEAR':
            return {
                ...state,
                year: action.value
            };
        case 'SET_COLOR':
            return {
                ...state,
                color: action.value
            };
        case 'SET_OCTANE':
            console.log('set_octane + ' + action.value)
            console.log(action.value);
            return {
                ...state,
                octane: action.value.itemValue
            };
        case 'SET_LICENSE_PLATE':
            return {
                ...state,
                license: action.value
            };
        case 'SET_EDIT_VEHICLE':
            return {
                ...state,
                make: action.value.make,
                model: action.value.model,
                year: action.value.year,
                color: action.value.color,
                octane: action.value.octane,
                license: action.value.license
            }
    }

    return state;
};
