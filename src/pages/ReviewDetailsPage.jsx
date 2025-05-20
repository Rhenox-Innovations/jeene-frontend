
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import ReviewDetailsLayer from "../components/ReviewDetailsLayer";
const ReviewDetailsPage = () => {
  

  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Reviews Details" />

        {/* ReviewsListLayer */}
        <ReviewDetailsLayer />

      </MasterLayout>

    </>
  );
};

export default ReviewDetailsPage; 
