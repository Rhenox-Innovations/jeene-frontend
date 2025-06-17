import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePageSix from "./pages/HomePageSix";
import AddUserPage from "./pages/AddUserPage";
import AssignRolePage from "./pages/AssignRolePage";
import ErrorPage from "./pages/ErrorPage";
import ImageGeneratorPage from "./pages/ImageGeneratorPage";
import RoleAccessPage from "./pages/RoleAccessPage";
import SignInPage from "./pages/SignInPage";
import TermsConditionPage from "./pages/TermsConditionPage";
import UsersListPage from "./pages/UsersListPage";
import ViewDetailsPage from "./pages/ViewDetailsPage";
import ViewProfilePage from "./pages/ViewProfilePage";
import RouteScrollToTop from "./helper/RouteScrollToTop";
import { Provider } from "react-redux";
import store from "./redux/store/store";
import ProtectedRoute from "./components/ProtectedRoute";
import ViewProfilePageAdmin from "./pages/ViewProfilePageAdmin";
import AddCategoryPage from "./pages/AddCategoryPage";
import AddSubCategoryPage from "./pages/AddSubCategoryPage";
import CategoriesListPage from "./pages/CategoriesListPage";
import SubCategoriesListPage from "./pages/SubCategoriesListPage";
import EditCategoryPage from "./pages/EditCategoryPage";
import EditSubCategoryPage from "./pages/EditSubCategoryPage";
import ReviewsListPage from "./pages/ReviewsListPage";
import ReviewDetailsPage from "./pages/ReviewDetailsPage";
import RatingParameterListPage from "./pages/RatingParameterListPage";
import AddRatingParameterPage from "./pages/AddRatingParameterPage";
import EditRatingParameterPage from "./pages/EditRatingParameterPage";
import AddRolePage from "./pages/AddRolePage";
import RoleListPage from "./pages/RoleListPage";
import EditRolePage from "./pages/EditRolePage";
import { PrivateRoutes } from "./components/PrivateRoute";
import CalendarMainPage from "./pages/CalendarMainPage";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <RouteScrollToTop />
        <Routes>
          <Route exact path="/" element={<SignInPage />} />
          <Route exact path="/sign-in" element={<SignInPage />} />

          <Route element={<PrivateRoutes />}>
            <Route excat path="/calendar" element={<CalendarMainPage/>}/>
            <Route exact path="/dashboard" element={<HomePageSix />} />
            <Route exact path="/add-user" element={<AddUserPage />} />
            <Route exact path="/assign-role" element={<AssignRolePage />} />
            <Route exact path="/role-access" element={<RoleAccessPage />} />
            <Route exact path="/add-role" element={<AddRolePage />} />
            <Route exact path="/edit-role" element={<EditRolePage />} />
            <Route exact path="/roles-list" element={<RoleListPage />} />
            <Route exact path="/users-list" element={<UsersListPage />} />

            <Route exact path="/view-details" element={<ViewDetailsPage />} />
            <Route exact path="/view-profile" element={<ViewProfilePage />} />
            <Route
              exact
              path="/view-profile-admin"
              element={<ViewProfilePageAdmin />}
            />

            <Route exact path="/add-category" element={<AddCategoryPage />} />
            <Route exact path="/edit-category" element={<EditCategoryPage />} />
            <Route
              exact
              path="/categories-list"
              element={<CategoriesListPage />}
            />

            <Route
              exact
              path="/add-sub-category"
              element={<AddSubCategoryPage />}
            />
            <Route
              exact
              path="/edit-sub-category"
              element={<EditSubCategoryPage />}
            />
            <Route
              exact
              path="/sub-categories-list"
              element={<SubCategoriesListPage />}
            />

            <Route
              exact
              path="/rating-parameter-list"
              element={<RatingParameterListPage />}
            />

            <Route
              exact
              path="/add-rating-parameter"
              element={<AddRatingParameterPage />}
            />

            <Route
              exact
              path="/edit-rating-parameter"
              element={<EditRatingParameterPage />}
            />

            <Route exact path="/reviews-list" element={<ReviewsListPage />} />

            <Route
              exact
              path="/review-details"
              element={<ReviewDetailsPage />}
            />
          </Route>

          <Route exact path="*" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
