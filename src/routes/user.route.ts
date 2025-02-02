import express from 'express';
import RegistrationController from '../controllers/user.controller';
import { UserService } from '../services/user.service';
import multerMiddlewares from '../middlewares/multer.middlewares';
import OfferLetterGenerator from '../utils/offer-letter';
import generateIdentifier from '../utils/generate-regno';
import OfferEmail from '../emails/offer-letter.email';

const router = express.Router();

// Create instances
const userService = new UserService();
const offerLetter = new OfferLetterGenerator();
const offerEmail = new OfferEmail(offerLetter);
const registrationController = new RegistrationController(userService, offerEmail);

// Registration route
router.post('/register', multerMiddlewares.upload.single('file'), (req, res) => registrationController.registerUser(req, res));
router.delete('/delete', registrationController.deleteUsers);
router.get('/get-users', registrationController.getUsers);
router.get('/get-user', registrationController.getUserEmail);
router.get('/generate-regno', (req, res) => console.log(generateIdentifier('Cyber Security')));

export default router;
