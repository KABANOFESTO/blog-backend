/**
 * @swagger
 * /PostgreSQL/API/posts/add:
 *   post:
 *     summary: Add a new post
 *     tags:
 *       - Posts
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               postImage:
 *                 type: string
 *                 format: binary
 *                 description: The image file for the post
 *               postTitle:
 *                 type: string
 *                 description: The title of the post
 *               postContent:
 *                 type: string
 *                 description: The content of the post
 *     responses:
 *       '201':
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: '201'
 *                 message:
 *                   type: string
 *                   example: 'Post created successfully'
 *       '400':
 *         description: Bad request, some fields are empty or post title already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: '400'
 *                 message:
 *                   type: string
 *                   example: 'Some fields are empty or Post title exists in the database'
 *       '500':
 *         description: Internal Server Error, failed to create a post
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: '500'
 *                 message:
 *                   type: string
 *                   example: 'Failed to create a post'
 *                 error:
 *                   type: string
 *                   example: 'Error message details'
 */

/**
 * @swagger
 * /PostgreSQL/API/posts/upload:
 *   post:
 *     summary: Add a new post with video
 *     tags:
 *       - Posts
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               video:
 *                 type: string
 *                 format: binary
 *                 description: The image file for the post
 *               postTitle:
 *                 type: string
 *                 description: The title of the post
 *               postContent:
 *                 type: string
 *                 description: The content of the post
 *     responses:
 *       '201':
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: '201'
 *                 message:
 *                   type: string
 *                   example: 'Post created successfully'
 *       '400':
 *         description: Bad request, some fields are empty or post title already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: '400'
 *                 message:
 *                   type: string
 *                   example: 'Some fields are empty or Post title exists in the database'
 *       '500':
 *         description: Internal Server Error, failed to create a post
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: '500'
 *                 message:
 *                   type: string
 *                   example: 'Failed to create a post'
 *                 error:
 *                   type: string
 *                   example: 'Error message details'
 */


/**
 * @swagger
 * /PostgreSQL/API/posts/get/all:
 *   get:
 *     summary: Get all posts
 *     tags:
 *       - Posts
 *     responses:
 *       '201':
 *         description: Posts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: '201'
 *                 message:
 *                   type: string
 *                   example: 'Posts retrieved successfully'
 *       '500':
 *         description: Failed to retrieve posts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: '500'
 *                 message:
 *                   type: string
 *                   example: 'Failed to retrieve posts'
 *                 error:
 *                   type: string
 *                   example: 'Error message details'
 */


/**
 * @swagger
 * /PostgreSQL/API/posts/single/post/{id}:
 *   get:
 *     summary: Get a specific post by ID
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the post to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Post retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: '200'
 *                 message:
 *                   type: string
 *                   example: 'Post retrieved successfully'
 *       '404':
 *         description: Post not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: '404'
 *                 message:
 *                   type: string
 *                   example: 'Post not found'
 *       '500':
 *         description: Failed to retrieve post
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: '500'
 *                 message:
 *                   type: string
 *                   example: 'Failed to retrieve post'
 *                 error:
 *                   type: string
 *                   example: 'Error message details'
 */


/**
 * @swagger
 * /PostgreSQL/API/posts/update/{id}:
 *   put:
 *     summary: Update a post by ID
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the post to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               postImage:
 *                 type: string
 *                 format: binary
 *                 description: The updated image file for the post
 *               postTitle:
 *                 type: string
 *                 description: The updated title of the post
 *               postContent:
 *                 type: string
 *                 description: The updated content of the post
 *     responses:
 *       '201':
 *         description: Post update success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: '201'
 *                 message:
 *                   type: string
 *                   example: 'Post update success'
 *       '400':
 *         description: Bad request, post not found or post title exists in the database
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: '400'
 *                 message:
 *                   type: string
 *                   example: 'Post not found or This post title exists in the database'
 *       '500':
 *         description: Internal Server Error, failed to update a post
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: '500'
 *                 message:
 *                   type: string
 *                   example: 'Failed to update a post'
 *                 error:
 *                   type: string
 *                   example: 'Error message details'
 */

/**
 * @swagger
 * /PostgreSQL/API/posts/delete/{id}:
 *   delete:
 *     summary: Delete a post by ID
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the post to delete
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Post deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: '200'
 *                 message:
 *                   type: string
 *                   example: 'Post with this ID {id} deleted successfully'
 *       '404':
 *         description: Post not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: '404'
 *                 message:
 *                   type: string
 *                   example: 'Post not found'
 *       '500':
 *         description: Internal Server Error, failed to delete a post
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: '500'
 *                 message:
 *                   type: string
 *                   example: 'Failed to delete a post'
 *                 error:
 *                   type: string
 *                   example: 'Error message details'
 */


/**
 * @swagger
 * /PostgreSQL/API/posts/add:
 *   post:
 *     summary: Add a new post
 *     tags:
 *       - Posts
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               postImage:
 *                 type: string
 *                 format: binary
 *                 description: The image file for the post
 *               postTitle:
 *                 type: string
 *                 description: The title of the post
 *               postContent:
 *                 type: string
 *                 description: The content of the post
 *     responses:
 *       '201':
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: '201'
 *                 message:
 *                   type: string
 *                   example: 'Post created successfully'
 *       '400':
 *         description: Bad request, some fields are empty or post title already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: '400'
 *                 message:
 *                   type: string
 *                   example: 'Some fields are empty or Post title exists in the database'
 *       '500':
 *         description: Internal Server Error, failed to create a post
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: '500'
 *                 message:
 *                   type: string
 *                   example: 'Failed to create a post'
 *                 error:
 *                   type: string
 *                   example: 'Error message details'
 */


