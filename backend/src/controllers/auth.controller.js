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

async function login(req, res) {

    res.status(200).send({
        message: "this is login"
    });
    return;
}

async function forgot(req, res) {

    res.status(200).send({
        message: "this is login"
    });
    return;
}

async function reset(req, res) {

    res.status(200).send({
        message: "this is login"
    });
    return;
}


module.exports = {
    login,
    forgot,
    reset
}