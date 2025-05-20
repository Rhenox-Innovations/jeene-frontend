import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePageOne from "./pages/HomePageOne";
import HomePageTwo from "./pages/HomePageTwo";
import HomePageThree from "./pages/HomePageThree";
import HomePageFour from "./pages/HomePageFour";
import HomePageFive from "./pages/HomePageFive";
import HomePageSix from "./pages/HomePageSix";
import HomePageSeven from "./pages/HomePageSeven";
import EmailPage from "./pages/EmailPage";
import AddUserPage from "./pages/AddUserPage";
import AlertPage from "./pages/AlertPage";
import AssignRolePage from "./pages/AssignRolePage";
import AvatarPage from "./pages/AvatarPage";
import BadgesPage from "./pages/BadgesPage";
import ButtonPage from "./pages/ButtonPage";
import CalendarMainPage from "./pages/CalendarMainPage";
import CardPage from "./pages/CardPage";
import CarouselPage from "./pages/CarouselPage";
import ChatEmptyPage from "./pages/ChatEmptyPage";
import ChatMessagePage from "./pages/ChatMessagePage";
import ChatProfilePage from "./pages/ChatProfilePage";
import CodeGeneratorNewPage from "./pages/CodeGeneratorNewPage";
import CodeGeneratorPage from "./pages/CodeGeneratorPage";
import ColorsPage from "./pages/ColorsPage";
import ColumnChartPage from "./pages/ColumnChartPage";
import CompanyPage from "./pages/CompanyPage";
import CurrenciesPage from "./pages/CurrenciesPage";
import DropdownPage from "./pages/DropdownPage";
import ErrorPage from "./pages/ErrorPage";
import FaqPage from "./pages/FaqPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import FormLayoutPage from "./pages/FormLayoutPage";
import FormValidationPage from "./pages/FormValidationPage";
import FormPage from "./pages/FormPage";
import GalleryPage from "./pages/GalleryPage";
import ImageGeneratorPage from "./pages/ImageGeneratorPage";
import ImageUploadPage from "./pages/ImageUploadPage";
import InvoiceAddPage from "./pages/InvoiceAddPage";
import InvoiceEditPage from "./pages/InvoiceEditPage";
import InvoiceListPage from "./pages/InvoiceListPage";
import InvoicePreviewPage from "./pages/InvoicePreviewPage";
import KanbanPage from "./pages/KanbanPage";
import LanguagePage from "./pages/LanguagePage";
import LineChartPage from "./pages/LineChartPage";
import ListPage from "./pages/ListPage";
import MarketplaceDetailsPage from "./pages/MarketplaceDetailsPage";
import MarketplacePage from "./pages/MarketplacePage";
import NotificationAlertPage from "./pages/NotificationAlertPage";
import NotificationPage from "./pages/NotificationPage";
import PaginationPage from "./pages/PaginationPage";
import PaymentGatewayPage from "./pages/PaymentGatewayPage";
import PieChartPage from "./pages/PieChartPage";
import PortfolioPage from "./pages/PortfolioPage";
import PricingPage from "./pages/PricingPage";
import ProgressPage from "./pages/ProgressPage";
import RadioPage from "./pages/RadioPage";
import RoleAccessPage from "./pages/RoleAccessPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import StarRatingPage from "./pages/StarRatingPage";
import StarredPage from "./pages/StarredPage";
import SwitchPage from "./pages/SwitchPage";
import TableBasicPage from "./pages/TableBasicPage";
import TableDataPage from "./pages/TableDataPage";
import TabsPage from "./pages/TabsPage";
import TagsPage from "./pages/TagsPage";
import TermsConditionPage from "./pages/TermsConditionPage";
import TextGeneratorPage from "./pages/TextGeneratorPage";
import ThemePage from "./pages/ThemePage";
import TooltipPage from "./pages/TooltipPage";
import TypographyPage from "./pages/TypographyPage";
import UsersGridPage from "./pages/UsersGridPage";
import UsersListPage from "./pages/UsersListPage";
import ViewDetailsPage from "./pages/ViewDetailsPage";
import VideoGeneratorPage from "./pages/VideoGeneratorPage";
import VideosPage from "./pages/VideosPage";
import ViewProfilePage from "./pages/ViewProfilePage";
import VoiceGeneratorPage from "./pages/VoiceGeneratorPage";
import WalletPage from "./pages/WalletPage";
import WidgetsPage from "./pages/WidgetsPage";
import WizardPage from "./pages/WizardPage";
import RouteScrollToTop from "./helper/RouteScrollToTop";
import TextGeneratorNewPage from "./pages/TextGeneratorNewPage";
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
import ReviewsListLayer from "./components/ReviewsListLayer";
import ReviewsListPage from "./pages/ReviewsListPage";

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
          <Route exact path="/add-user" element={ <ProtectedRoute><AddUserPage /></ProtectedRoute>} />
          <Route exact path="/assign-role" element={<ProtectedRoute><AssignRolePage /></ProtectedRoute> } />
          <Route exact path="/role-access" element={<ProtectedRoute><RoleAccessPage /></ProtectedRoute>} />
          <Route exact path="/users-list" element={<ProtectedRoute><UsersListPage /></ProtectedRoute>} />
          <Route exact path="/view-details" element={<ViewDetailsPage />} />
          <Route exact path="/view-profile" element={<ProtectedRoute><ViewProfilePage /></ProtectedRoute>} />
          <Route exact path="/view-profile-admin" element={<ProtectedRoute><ViewProfilePageAdmin /></ProtectedRoute>} />

          
          <Route exact path="/add-category" element={ <ProtectedRoute><AddCategoryPage /></ProtectedRoute>} />
          <Route exact path="/edit-category" element={ <ProtectedRoute><EditCategoryPage /></ProtectedRoute>} />
          <Route exact path="/categories-list" element={<ProtectedRoute><CategoriesListPage /></ProtectedRoute>} />
         
          <Route exact path="/add-sub-category" element={ <ProtectedRoute><AddSubCategoryPage /></ProtectedRoute>} />
          <Route exact path="/edit-sub-category" element={ <ProtectedRoute><EditSubCategoryPage /></ProtectedRoute>} />
          <Route exact path="/sub-categories-list" element={<ProtectedRoute><SubCategoriesListPage /></ProtectedRoute>} />

          <Route exact path="/reviews-list" element={<ProtectedRoute><ReviewsListPage /></ProtectedRoute>} />

          <Route
            exact
            path="/terms-condition"
            element={<TermsConditionPage />}
          />
          
          <Route exact path="*" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
