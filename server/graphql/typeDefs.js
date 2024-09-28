const { gql } = require('apollo-server-express')//или можно использовать комментарий /* GraphQL */ после module.exports = 
// const { GraphQLUpload } = require('graphql-upload')
// const { Upload } = require('graphql-upload')

//создать запрос на определение типов (types definitions)
module.exports = gql`

   scalar Upload

   type File{
       filename: String!
       mimetype: String!
       encoding: String! 
      url: String!   
   }
   type User{
      # id: ID!
      # email: String!
      # token: String!
      userName: String
      # createdAt: String!
      imageUrl: String
   }
   # Тип для ввода данных
   # input RegisterInput{
      # userName: String!
      # password: String!
      # confirmPassword: String!
      # email: String!
      # avatarUrl: String
   # }
   # Тип - запрос
   type Query{
      # getUsers: [User]
      getUser: [User]
      # получение зегруженных файлов
      # uploads: File!
      test: String! 
      # hello: String!
      # hello: String
      files: [String]
   }
   # мутации(аналог post/delete/update-запросов в REST)
   type Mutation {
      # Зарегестрировать(создать)создать пользователя. мутация register
      # register(registerInput: RegisterInput): User!
      #  мутация для подгрузки файла: переменная file с типом(скаляром) Upload. Данная мутация вернёт тип File(с параметрами: url, )
      # uploadFile(file: Upload!): File!
      # uploadFile(file: Upload!): String
      createUser(username: String!, image: Upload): User
      deleteUser: Boolean!
   }
`