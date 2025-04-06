import { createReview, getAllReviews } from '../Controllers/reviewController.js';
import { authenticate, restrict } from '../auth/verifyToken.js';
import { router } from './review.js';

router.route("/").get(getAllReviews).post(authenticate, restrict(['customer']), createReview);
