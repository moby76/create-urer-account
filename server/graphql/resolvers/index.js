const { GraphQLUpload } = require('graphql-upload')
const createAccountNoneDB = require('./createAccountNoneDB')

const uploadResolver = {
   Upload: GraphQLUpload
}

module.exports = [
   uploadResolver,
   createAccountNoneDB
]