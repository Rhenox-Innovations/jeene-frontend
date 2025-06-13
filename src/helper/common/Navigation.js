import { setCurrentPath } from "../../redux/actions/authSlice"

export const navigatePage = (navigate, dispatch, pathname, state = null) => {
    dispatch(setCurrentPath({pathname, state: state?.state}))
    if(state){
        navigate(pathname, state)
    }
    else{
        navigate(pathname)
    }
}