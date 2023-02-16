// Packages
import dotEnv from 'dotenv'
// Loads .env file contents into `process.env`. Example: 'KEY=value' becomes { parsed: { KEY: 'value' } }
dotEnv.config()

import express from 'express' // Good introduction: https://www.youtube.com/watch?v=SccSCuHhOw0
import { buildSchema } from 'type-graphql' // https://typegraphql.com/

// Takes config/default.ts to fill default environment-variables. Overwrites and adds from file named as value in NODE_ENV (in .env)
// If no NODE_ENV set, 'development', is default environment
import config from 'config' // https://www.npmjs.com/package/config
import { ApolloServer } from 'apollo-server-express' // integration library for Apollo and express.js
import { graphqlUploadExpress } from 'graphql-upload-minimal' // express.js-middleware to upload files with graphQL
import { ApolloServerPluginLandingPageGraphQLPlayground, ApolloServerPluginLandingPageProductionDefault } from 'apollo-server-core'

// Modules
import { resolvers } from './resolvers'
import { connectToDatabase } from './utils/database'
import { verifyJwt } from './utils/jwt'
import { User } from './schema/user.schema'
import UserService from './service/user.service'
import Context from './types/context'
import authChecker from './utils/authChecker'

// bootstrap is the main-function that starts our API and will be called when a client makes a request
async function bootstrap() {
  // Build the schema with type-graphql (we need it in the apollo-server)
  const schema = await buildSchema({
    resolvers,
    dateScalarMode: 'timestamp', // "timestamp" or "isoDate"
    authChecker,
  })

  // Initialise express as middleware
  // We are applying middleware (express) to the server.
  // If all you need is a GraphQL endpoint, then using the standalone library (apollo-server) is generally preferred because
  // there will be less boilerplate to write (features like subscriptions, file uploads, etc. just work without additional configuration).
  // However, many applications require additional functionality beyond just exposing a single API endpoint.
  // Examples include: Webhooks, OAuth callbacks, Session management, Cookie parsing, CSRF protection, Monitoring or logging requests,
  // Rate limiting, Geofencing, Serving static content, Server-side rendering
  // If you need this sort of functionality for your application, then you'll want to utilize an HTTP framework like Express and then use the
  // appropriate integration library (i.e. apollo-server-express).
  const app = express()

  app.get('/confirmation/:token', async (req, res) => {
    await new UserService().confirmUser(req.params.token)

    return res.redirect(config.get('clientDomain'))
  })

  // graphqlUploadExpress is express.js middleware. You must put it before the main GraphQL sever middleware.
  // Also, make sure there is no other Express.js middleware which parses multipart/form-data HTTP requests before the graphqlUploadExpress middleware!
  app.use(graphqlUploadExpress())

  // Create the apollo server.
  // The GraphQLSchema should be named 'schema'
  const server = new ApolloServer({
    schema,
    context: (ctx: Context) => {
      const context = ctx

      const authHeader = ctx.req.get('Authorization')
      if (authHeader) {
        const token = authHeader.split(' ')[1]

        if (token) {
          // console.log('verifyJWT')
          const user = verifyJwt<User>(token)

          context.user = user // As soon as user is put in the context, @Authorised will validate in resolver
        }
      }
      // console.log(context)
      return context
    },
    // Use the PlayGround in DEV mode (at serverport)
    // The ApolloServerPluginLandingPageProductionDefault shows a minimalist landing page (at serverport): https://www.apollographql.com/docs/apollo-server/api/plugin/landing-pages/#default-production-landing-page
    plugins: [process.env.NODE_ENV === 'production' ? ApolloServerPluginLandingPageProductionDefault() : ApolloServerPluginLandingPageGraphQLPlayground()],
  })

  // Start the apollo-server and wait till it has started
  await server.start()

  // applyMiddleware applies Apollo Server as middleware to the HTTP framework of a Node.js middleware library, such as hapi or express.
  // You call this method instead of listen if you're using a middleware integration, such as apollo-server-express. You should call await server.start() before calling this method.
  // What applyMiddleware actually does is only add middleware to the path (default /graphql router), so it’s not applied to the whole app
  server.applyMiddleware({ app })

  // The app.listen() method binds itself with the specified host and port to bind and listen for any connections.
  // The app object returned by express() is in fact a JavaScript function, designed to be passed to Node’s HTTP servers as a callback to handle requests.
  // This makes it easy to provide both HTTP and HTTPS versions of your app with the same code base, as the app does not inherit from these (it is simply a callback).
  app.listen({ port: config.get('serverPort') }, () => {
    console.log(`MyinT-graphQL-API is listening on http://${config.get('domain')}:${config.get('serverPort')}`)
  })

  // When server has started we can connect to the database we need
  connectToDatabase()
}

bootstrap()
