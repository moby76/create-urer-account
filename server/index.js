const express = require('express')
const { graphqlUploadExpress } = require('graphql-upload');
const { ApolloServer, gql } = require('apollo-server-express')
const mongoose = require('mongoose')

const typeDefs = require('./graphql/typeDefs')
const resolvers = require('./graphql/resolvers')

const PORT = process.env.PORT || 5000
const { MONGODB } = require('./config/default');

//создать функцию запуска сервера
async function startServer() {

   //создать алиас фреймворка express
   const app = express()

   //создать экземпляр ApolloServer
   const server = new ApolloServer({
      typeDefs,
      resolvers
   })

   //константа для подключения базы данных
   const dbPromise = new Promise((resolve, reject) => {
      let dbConnect = mongoose.connect(MONGODB)

      if (dbConnect) {
         resolve(`Your database is connected on: ${MONGODB}`)
      } else {
         reject(new Error())
      }

   })

   //константа для привязки и прослушки порта
   const bindPromise = new Promise((resolve, reject) => {
      let binding = app.listen({ port: PORT })

      if (binding) {
         resolve(` 🚀  Server is running on port: ${PORT}` + '\n' +
            ` 🚀  Query endpoint ready at http://localhost:${PORT}${server.graphqlPath}`
         )
      }
      reject(new Error())
   })

   //активировать сервер
   // Всегда вызывайте await server.start() перед вызовом server.applyMiddleware и запуском вашего HTTP-сервера.
   // Это позволяет вам реагировать на сбои запуска Apollo Server, вызывая сбой вашего процесса вместо того, чтобы начинать обслуживать трафик.
   await server.start()

   // Additional middleware can be mounted at this point to run before Apollo.
   app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }))

   // Mount Apollo middleware here.
   // Экземпляр промежуточного программного обеспечения сервера для интеграции с сервером Apollo.
   server.applyMiddleware({ app })//app = express

   //активировать подключение к БД
   await dbPromise
      .then(message => { console.log(message) })
      .catch(err => { console.log('Ошибка подключения к базе данных', err) })

   //активировать прослушку порта
   await bindPromise
      .then(message => { console.log(message) })
      .catch(err => { console.log('Ошибка сервера', err) })

   // await new Promise(resolve => app.listen({ port: PORT}, resolve ))
   // console.log(` 🚀  Server is running on port: ${PORT}`)
   // console.log(` 🚀  Query endpoint ready at http://localhost:${PORT}${server.graphqlPath}`)
}

startServer()