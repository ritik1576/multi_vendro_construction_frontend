import { ReviewCard } from './ReviewCard';

export const ReviewList = ({ reviews, role, onApprove, onHide, onDelete, currentUserId }) => {
  return (
    <div className="flex flex-col">
      {reviews.map((review) => (
        <ReviewCard 
          key={review.id} 
          review={review} 
          role={role}
          onApprove={onApprove}
          onHide={onHide}
          onDelete={onDelete}
          currentUserId={currentUserId}
        />
      ))}
    </div>
  );
};
