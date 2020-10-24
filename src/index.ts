import { ApolloServer } from 'apollo-server-express'
import { useContainer } from 'class-validator'
import dotenv from 'dotenv'
import express from 'express'
import 'module-alias/register'
import 'reflect-metadata'
import * as TypeGraphQL from 'type-graphql'
import { Container, ContainerInstance } from 'typedi'
import * as TypeORM from 'typeorm'
// import * as RoutingControllers from 'routing-controllers'
dotenv.config()

import { AppDatabase } from '@config/Database'
import { AppLogger } from '@config/Logger'
import { Context } from '@internalTypes/Context'
import { authChecker } from './auth-checker'
import { Resolvers } from './domains'
import { AuthMiddleware } from './middlewares/auth'

// register 3rd party IOC container
useContainer(Container)
TypeORM.useContainer(Container)
// RoutingControllers.useContainer(Container)

async function bootstrap() {
  try {
    const app = express()
    const path = '/graphql'

    // create Logger
    AppLogger.create('Mono')

    // create TypeORM connection
    await AppDatabase.init()

    // build TypeGraphQL executable schema
    ;(global as any).schema =
      (global as any).schema ||
      (await TypeGraphQL.buildSchema({
        authChecker,
        resolvers: Resolvers,
        container: ({ context }) => context.container,
      }))
    const schema = (global as any).schema

    const server = new ApolloServer({
      schema,
      formatError: error => {
        AppLogger.error(error)
        return error
      },
      context: async ({ req }: any) => {
        AppLogger.debug(`[SERVER][context] Setup`)
        const requestId = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
        AppLogger.debug(`[SERVER][context] Request ID - ${requestId}`)
        const container = Container.of(requestId)
        const context: Context = {
          req,
          requestId,
          container,
          account: req.account,
        }

        if (req.account) {
          AppLogger.debug(
            `[SERVER][context] Logged Account - ${req.account.username} <${req.account.email}>`,
          )
          container.set('account', req.account)
        } else {
          container.set('account', null)
        }
        AppLogger.debug(`[SERVER][context] Setup Finish`)
        container.set('context', context)
        return context
      },
      formatResponse: (response: any, { context }) => {
        // remember to dispose the scoped container to prevent memory leaks
        const account = (context as Context).account
        AppLogger.debug(`[SERVER][formatResponse] Request ID - ${(context as Context).requestId}`)
        if (account) {
          AppLogger.debug(`[SERVER][formatResponse] Account - ${account?.username}`)
        }
        Container.reset((context as Context).requestId)

        // for developers curiosity purpose, here is the logging of current scoped container instances
        // you can make multiple parallel requests to see in console how this works
        if (process.env.NODE_ENV !== 'development') {
          const instancesIds = ((Container as any).instances as ContainerInstance[]).map(
            instance => instance.id,
          )
          AppLogger.debug(`[SERVER][formatResponse] Instances left - ${instancesIds}`)
        }

        if (response.errors) {
          response.errors.forEach((err: any) => {
            if (err.message.includes('Access denied!')) return
          })
        }

        return response
      },
      // tracing: true,

      introspection: true,
      playground: process.env.NODE_ENV !== 'production',
    })
    app.use(path, AuthMiddleware)
    // RoutingControllers.useExpressServer(app, {
    //   controllers: [],
    // })

    // Apply the GraphQL server middleware
    server.applyMiddleware({ app, path })

    // Start the server
    // Launch the express server
    app.listen({ port: process.env.PORT }, () => {
      console.log(`🚀 Server ready at http://localhost:${process.env.PORT}${server.graphqlPath}`)
    })
  } catch (err) {
    console.error(err)
  }
}

bootstrap()
