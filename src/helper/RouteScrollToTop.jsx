
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCurrentPath } from '../redux/actions/authSlice';
const RouteScrollToTop = () => {
  const location = useLocation()
  const dispatch = useDispatch();

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(setCurrentPath({ pathname: location.pathname, state: location.state }));
  }, [dispatch, location]);

  return null;
};

export default RouteScrollToTop;
