// This first because we need it 
import dotEnv from 'dotenv'
dotEnv.config()

import "reflect-metadata"
import express from "express"
import { buildSchema } from "type-graphql"
import cookieParser from "cookie-parser"
import { ApolloServer } from "apollo-server-express"
import {
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginLandingPageProductionDefault,
} from "apollo-server-core"
import { resolvers } from "./resolvers"
import { connectToMongo } from "./utils/mongo"
// import { verifyJwt } from "./utils/jwt";
// import { User } from "./schema/user.schema";
import Context from "./types/context"
import authChecker from "./utils/authChecker"

// Loads .env file contents into `process.env`. Example: 'KEY=value' becomes { parsed: { KEY: 'value' } }

/**
 * myintAPI is the main-function that starts our API
 */
async function bootstrap() {

  // Build the schema
  const schema = await buildSchema({
    resolvers,
    dateScalarMode: "timestamp", // "timestamp" or "isoDate"
    authChecker,
  })

  // Init express
  const app = express();

  // Parse Cookie header and populate req.cookies with an object keyed by the cookie names.
  app.use(cookieParser());

  // Create the apollo server. 
  // The GraphQLSchema should be named 'schema'
  const server = new ApolloServer({
    schema,
    context: (ctx: Context) => {
 
      // const context = ctx;

      // if (ctx.req.cookies.accessToken) {
      //   const user = verifyJwt<User>(ctx.req.cookies.accessToken)
      //   context.user = user
      // }
      // return context
      return ctx
    },
    // Use the PlayGround in DEV mode
    plugins: [
      
      process.env.NODE_ENV === "production"
        ? ApolloServerPluginLandingPageProductionDefault()
        : ApolloServerPluginLandingPageGraphQLPlayground(),
    ],
  })

  // Start the apollo-server and wait till it has started
  await server.start()
  
  // We are applying middleware (express) to the server.
  // Why?
  // If all you need is a GraphQL endpoint, then using the standalone library (apollo-server) is generally preferred because 
  // there will be less boilerplate to write (features like subscriptions, file uploads, etc. just work without additional configuration). 
  // However, many applications require additional functionality beyond just exposing a single API endpoint. 
  // Examples include: Webhooks, OAuth callbacks, Session management, Cookie parsing, CSRF protection, Monitoring or logging requests, 
  // Rate limiting, Geofencing, Serving static content, Server-side rendering
  // If you need this sort of functionality for your application, then you'll want to utilize an HTTP framework like Express and then use the 
  // appropriate integration library (i.e. apollo-server-express).
  // 
  // What applyMiddleware actually does is only add middleware to the path (default /graphql router), so it’s not applied to the whole app
  server.applyMiddleware({ app })

  // app.listen on express server
  app.listen({ port: 4000 }, () => {
    console.log("App is listening on http://localhost:4000");
  })
  connectToMongo()
}

bootstrap()