/**
 * This file is part of the Sandy Andryanto Blog Application.
 *
 * @author     Sandy Andryanto <sandy.andryanto.blade@gmail.com>
 * @copyright  2025
 *
 * For the full copyright and license information,
 * please view the LICENSE.md file that was distributed
 * with this source code.
 */

const router = require('express').Router();
const auth = require("../controllers/auth.controller.js");

router.post('/auth/login', auth.login);
router.post('/auth/email/forgot', auth.forgot);
router.post('/auth/email/reset/:token', auth.reset);

module.exports = app => {
    app.use('/api', [router]);
};