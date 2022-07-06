import { configureStore } from "@reduxjs/toolkit"
import levelReducer from './level'

export default configureStore ({
    reducer: {
        level: levelReducer
    },
})