import { setCurrentPath } from "../../redux/actions/authSlice"

export const navigatePage = (navigate, dispatch, pathname, state = null) => {
    // Keep centralized path state in sync without causing double history entries
    dispatch(setCurrentPath({pathname, state: state?.state}))
    navigate(pathname, state || undefined)
}