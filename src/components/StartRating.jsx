import { starEmpty, starFilled } from "@wordpress/icons";

const StartRating = ({ rating, setRating, isEditable = true }) => {
	return (
		<div className="review-rating-stars">
		<>
			{[1, 2, 3, 4, 5].map((index) => (
				<span
					key={index}
					onClick={() => isEditable && setRating(index)}
					className={isEditable ? "editable" : ""}
					role="button"
					tabIndex={isEditable ? 0 : -1}
				>
					{rating >= index ? starFilled : starEmpty}
				</span>
			))}
		</>
		</div>
	);
};

export default StartRating;
