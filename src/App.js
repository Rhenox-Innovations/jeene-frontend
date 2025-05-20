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

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <RouteScrollToTop />
        <Routes>
          <Route exact path="/" element={<SignInPage />} />
          <Route
            exact
            path="/dashboard"
            element={
              <ProtectedRoute>
                <HomePageSix />
              </ProtectedRoute>
            }
          />
          <Route exact path="/sign-in" element={<SignInPage />} />
          <Route
            exact
            path="/add-user"
            element={
              <ProtectedRoute>
                <AddUserPage />
              </ProtectedRoute>
            }
          />
          <Route
            exact
            path="/assign-role"
            element={
              <ProtectedRoute>
                <AssignRolePage />
              </ProtectedRoute>
            }
          />
          <Route
            exact
            path="/role-access"
            element={
              <ProtectedRoute>
                <RoleAccessPage />
              </ProtectedRoute>
            }
          />
          <Route
            exact
            path="/users-list"
            element={
              <ProtectedRoute>
                <UsersListPage />
              </ProtectedRoute>
            }
          />
          <Route exact path="/view-details" element={<ViewDetailsPage />} />
          <Route
            exact
            path="/view-profile"
            element={
              <ProtectedRoute>
                <ViewProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            exact
            path="/view-profile-admin"
            element={
              <ProtectedRoute>
                <ViewProfilePageAdmin />
              </ProtectedRoute>
            }
          />

          <Route
            exact
            path="/add-category"
            element={
              <ProtectedRoute>
                <AddCategoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            exact
            path="/edit-category"
            element={
              <ProtectedRoute>
                <EditCategoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            exact
            path="/categories-list"
            element={
              <ProtectedRoute>
                <CategoriesListPage />
              </ProtectedRoute>
            }
          />

          <Route
            exact
            path="/add-sub-category"
            element={
              <ProtectedRoute>
                <AddSubCategoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            exact
            path="/edit-sub-category"
            element={
              <ProtectedRoute>
                <EditSubCategoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            exact
            path="/sub-categories-list"
            element={
              <ProtectedRoute>
                <SubCategoriesListPage />
              </ProtectedRoute>
            }
          />

          <Route
            exact
            path="/reviews-list"
            element={
              <ProtectedRoute>
                <ReviewsListPage />
              </ProtectedRoute>
            }
          />

          <Route
            exact
            path="/review-details"
            element={
              <ProtectedRoute>
                <ReviewDetailsPage />
              </ProtectedRoute>
            }
          />

          <Route
            exact
            path="/terms-condition"
            element={<TermsConditionPage />}
          />

          <Route
            exact
            path="/image-generator"
            element={<ImageGeneratorPage />}
          />

          <Route exact path="*" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
