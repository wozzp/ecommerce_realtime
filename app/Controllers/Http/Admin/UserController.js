'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const User = use('App/Models/User')

/**
* Resourceful controller for interacting with users
*/
class UserController {


    async index ({ request, response, pagination }) {

        const search = request.input('search')

        const userQuery = User.query()

        if (search) {
            userQuery.where('name', 'LIKE', `%${search}%`)
            .orWhere('email', 'LIKE', `%${search}%`)
        }

        try {
            const users = await userQuery.paginate(pagination.page, pagination.limit)
            return response.send({
                users
            })
        } catch (error) {
            return response.status(400).send({
                message: "Não foi possível encontrar usuários"
            })
        }

    }


    async store ({ request, response }) {

        const userData = request.only([ 'name', 'email', 'password', 'image_id' ])

        try {
            const user = await User.create(userData)
            return response.send({
                user
            })
        } catch (error) {
            return response.status(400).send({
                message: "Não foi possivel criar este usuário"
            })
        }

    }


    async show ({ params: { id }, request, response, view }) {

        const user = await User.findOrFail(id)

        return response.send(user)

    }


    async update ({ params: { id }, request, response }) {

        const user = await User.findOrFail(id)
        // atualizar o email facil assim?
        const userData = request.only([ 'name', 'email', 'password', 'image_id' ])

        user.merge(userData)

        try {
            await user.save()
            return response.send({ user })
        } catch (error) {
            return response.status(400).send({
                message: "Não foi possível atualizar o usuário"
            })
        }

    }


    async destroy ({ params: { id }, request, response }) {
        const user = await User.findOrFail(id)

        try {
            await user.delete()
            return response.status(204)
        } catch (error) {
            return response.status(500).send({
                message: "Não foi possível atualizar o usuário"
            })
        }
    }


}

module.exports = UserController
