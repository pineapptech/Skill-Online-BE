import { Router } from 'express';

import AttachmentEmailController from '../controllers/attached-email.controller';
import OfferEmail from '../emails/offer-letter.email';
import OfferLetterGenerator from '../utils/offer-letter';

const offerLetter = new OfferLetterGenerator();
const offerEmail = new OfferEmail(offerLetter);
const attachedEmail = new AttachmentEmailController(offerEmail);
const attachedRouter = Router();

attachedRouter.post('/offer-letter', attachedEmail.sendAttachmentEmail);

export default attachedRouter;
