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
import UserService from './service/user.service'
import DatabaseService from './service/database.service'
import AuthService from './service/auth.service'
import Context from './types/context'
// import { authChecker } from './service/auth.service'

// bootstrap is the main-function that starts our API and will be called when a client makes a request
async function bootstrap() {
  const auth = new AuthService()

  /** Build data-model
   * Build the schema with type-graphql (we need it in the apollo-server)
   */
  // We need a
  const authChecker = auth.authChecker
  const schema = await buildSchema({
    resolvers,
    dateScalarMode: 'timestamp', // "timestamp" or "isoDate"
    authChecker,
  })

  /** Initialise http-server
   * We are applying middleware (express) to the server 'app'.
   */
  const app = express()

  // Initialise express as middleware
  app.get('/confirmation/:token', async (req, res) => {
    await new UserService().confirmUser(req.params.token)

    return res.redirect(config.get('clientDomain'))
  })

  /** Apply middleware to http-server */
  app.use(graphqlUploadExpress())

  /** Create the graphQL server.
   * We use Apollo server as graphQL server
   */
  // The GraphQLSchema should be named 'schema'
  const server = new ApolloServer({
    schema,
    context: (ctx: Context) => {
      return auth.verifyUser(ctx)
    },
    // Use the PlayGround in DEV mode (at serverport)
    // The ApolloServerPluginLandingPageProductionDefault shows a minimalist landing page (at serverport): https://www.apollographql.com/docs/apollo-server/api/plugin/landing-pages/#default-production-landing-page
    plugins: [process.env.NODE_ENV === 'production' ? ApolloServerPluginLandingPageProductionDefault() : ApolloServerPluginLandingPageGraphQLPlayground()],
  })

  // Start the apollo-server and wait till it has started
  await server.start()

  /** Apply middleware to graphQL-server */
  server.applyMiddleware({ app })

  /** Start http-server
   * The app.listen() method binds itself with the specified host and port to bind and listen for any connections.
   *  The app object returned by express() is in fact a JavaScript function, designed to be passed to Node’s HTTP servers as a callback to handle requests.
   * This makes it easy to provide both HTTP and HTTPS versions of your app with the same code base, as the app does not inherit from these (it is simply a callback).
   */
  app.listen({ port: config.get('serverPort') }, () => {
    console.log(`MyinT-graphQL-API is listening on http://${config.get('domain')}:${config.get('serverPort')}`)
  })

  /** Connect to database
   *  When server has started we can connect to the database we need
   */
  new DatabaseService().connect()
}

bootstrap()
