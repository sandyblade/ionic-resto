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

async function save(req, res) {

    res.status(200).send({ message: "ok" });
    return;
}

async function checkout(req, res) {

    res.status(200).send({ message: "ok" });
    return;
}

async function cancel(req, res) {

    res.status(200).send({ message: "ok" });
    return;
}

module.exports = {
    save,
    checkout,
    cancel
}