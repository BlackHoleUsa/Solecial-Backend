const express = require('express');
const validate = require('../../middlewares/validate');
const collectionController = require('../../controllers/collection.controller');
const {
  createCollectionVS,
  getCollectionVS,
  singleCollectionVS,
  updateCollectionVS,
} = require('../../validations/collection.validation');
const auth = require('../../middlewares/auth');

const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Collections
 *   description: User Collections
 */

/**
 * @swagger
 * /collection/createCollection:
 *   post:
 *     security:
 *      - bearerAuth: []
 *     summary: create a collection
 *     tags: [Collections]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - owner
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               owner:
 *                 type: string
 *               coverImage:
 *                 type: string
 *               profileImage:
 *                 type: string
 *             example:
 *               name: Collection 2
 *               description: This is a very good collection
 *               owner: 613715f7a5e8c80016d054a7
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 collection:
 *                   $ref: '#/components/schemas/Collection'
 *                 tokens:
 *                   $ref: '#/components/schemas/AuthTokens'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post(
  '/createCollection',
  [auth('consumedByArtistOnly'), validate(createCollectionVS)],
  collectionController.createCollection
);
/**
 * @swagger
 * /collection/getUserCollections?page={page}&perPage={perPage}&userId={userId}&:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     summary: Get all User Collections
 *     tags: [Collections]
 *     parameters:
 *      - in: path
 *        name: page
 *        schema:
 *          type: string
 *        required: true
 *        description: Page Number
 *      - in: path
 *        name: perPage
 *        schema:
 *          type: string
 *        required: true
 *        description: Number of Collections Per Page
 *      - in: path
 *        name: userId
 *        schema:
 *          type: string
 *        required: true
 *        description: User Id
 *     responses:
 *       "201":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 collection:
 *                   $ref: '#/components/schemas/Collection'
 *                 tokens:
 *                   $ref: '#/components/schemas/AuthTokens'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get(
  '/getUserCollections',
  [auth('consumedByArtistOnly'), validate(getCollectionVS)],
  collectionController.getUserCollections
);
/**
 * @swagger
 * /collection/getCollectionDetails?collectionId={collectionId}&:
 *   get:
 *     security:
 *      - bearerAuth: []
 *     summary: Get Collection Details
 *     tags: [Collections]
 *     parameters:
 *      - in: path
 *        name: collectionId
 *        schema:
 *          type: string
 *        required: true
 *        description: Collection Id
 *     responses:
 *       "201":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 collection:
 *                   $ref: '#/components/schemas/Collection'
 *                 tokens:
 *                   $ref: '#/components/schemas/AuthTokens'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get(
  '/getCollectionDetails',
  [auth('consumedByArtistOnly'), validate(singleCollectionVS)],
  collectionController.getCollectionDetails
);

router.post(
  '/updateCollection',
  [auth('consumedByArtistOnly'), validate(updateCollectionVS)],
  collectionController.updateCollection
);

module.exports = router;
