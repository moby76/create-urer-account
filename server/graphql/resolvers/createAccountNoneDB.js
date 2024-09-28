const { Storage } = require('@google-cloud/storage');
const { resolve } = require('path');
const path = require('path')
// const {} = require('../../storage-files-325709-e0de8537644e.json')

let Data = []

// функцию для удаления пробелов, где параметром будет имя файла
const removeWhiteSpaces = (name) => {
   return name.replace(/\s+/g, "-");//вместо пробелов ставим "-"" 
};

module.exports = {

   Mutation: {
      createUser: async (_, { username, image }) => {
         const { filename, createReadStream } = await image

         let sanitizedName = removeWhiteSpaces(filename)

         const bucketName = "uploaded-files-theory"// название корзины

         const storage = new Storage({
            keyFilename: path.join(__dirname, '../../storage-files-325709-e0de8537644e.json'),
            projectId: 'storage-files-325709',//взять из файла --^
            // credentials: {
            //   client_email: 'asdasdasd@storage-files-325709.iam.gserviceaccount.com',
            //   private_key: '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDZ9GLyr57da9ig\n/hyNq7zEvOKT3xG5l3bmFcZq/ziX/t22KLR0jYtwsfcKjaRZEjMrSFRQPRzxzrIr\nNPa4R+yMXKc39p4LEsYTMG9JimTKw2K9eT0YOVdTidBy9pVV93JyAy2/pavi5uRG\nS269xc5ixz10+tC9teFcFbTS8OAwOSbTQAAHM/ONabqB0Qt/5sH9dMcV1eru2uS+\n78FslauLtMycYSjcxXfbopT1Vpt3UBmNUU69jZBU0iyXYKGpwcsD+1LQvxnAaEuz\nMmHcNv6L8FzqlPFaXQx4oXG2jDV2c6zI2ywdziVMuiqq7FiNp/LYyyzEjfhbP8sF\nSeXWdPYpAgMBAAECggEAB9N96xNxy6cX9f3x5gdk5ZaXtzITF5wv9YaSI5zq+hA5\ng1U2V5oOh/sn8P3RiS49XqBAAMqU+7zNin4iHs9cV9Tq3zhQh/rCWIWMdXJN+Lbn\n2IBeOHy0nUgNT1d52MakGiJxldhb0e+zAjAqt48/AC6Bzy3DaZB6mV0hK1LhZfHS\naZcaH0m5hc0Suvx+EhFPik5MJggi31P73/olFPxKOfFZcc2A8CgR9r7mm8sOBL5m\niG8oFoFm890X3ylyNoubOzUQrYcnXWUyjse5S+4UZafGxHzonwsTbra1yhqcJtzg\nW22wMxnVZHhnMx1xO5a/jK30pUWXxjor6ZgLCpuh4QKBgQD80FEf+5S+azqenDWT\n6hEYC6ZVbLFGU4YC+EzT7k+0KldEP4/snBFuoiRAzOOSw8ctGfAzPAMXbMxJr7En\nKPE+0j7T+2Ilox02CgF/TX349DM+GmLX1PsXN8bbpCTQGLY2u9OMdh4vwgq7v3WY\nSWaQemjoQmdwl1vqvcG3QrPDEQKBgQDcs5l7gxzLSD+kFxSe/IOZuQm1wIBHN9Xh\nNYOeQYDS1Ii0piUAWUm2S6XxThlAedU064M1mNJ3PuIm3kuZgg7hA1WK0SOGwJLq\nXdp5PHeNOROIJLrwtFRV0tQq4j/82m7CCCElrL4FOmx1CXkpL+MpJ77j9qlJJsFL\nUqj+SX1RmQKBgQDQUgv3McSgoBU+q3OOvdp2GOtoCteNHrgX7GjKXd45lIYyS7oZ\n+4R1yI/dAbgosMCITo5aeYIGpHU15tswbJFV9cMlxEhcwSsJ43bWYpGCOh+bdfyq\n4upAeIqZZImdHC/RrDYm0RIQwnE7wglxglJMjUGy2T0JTv/Dz7c3fnRIMQKBgBrD\n/T0pbXiJzo4L7ohJf3xJIJBWRDhe4SVq5AdxUjo/ZETkUWB1c6cUDY/yNMXJAL5m\nQYdifUPQ8IReOTTovP009k7bhj91Y1vg/fnuB2GtJl1AdxtyAzhVVT3OKoxzwTLu\n4XY8ON9Rco3PFE6WbCo1k8T5yRYCCTclUzFjoDshAoGBAN3z9dbwhHvBQV44qPuT\nzKrhEyeDiBVi0Z6xl2/v6qe7dqhRHhqTAzCkgyMi3G1QMrluSfG6yR3ZBwq+StAx\nXrHgxLCUKEDDy+fmCLPNPIMI388RcCG2fcF2hgCVsaxrQK7ZYeOgImYgIk/OzBn3\nc/e8mLNZk8OZMg+J/G4X9x4q\n-----END PRIVATE KEY-----\n'
            // }
         })

         await new Promise((resolve, reject) => {
            createReadStream().pipe(
               storage
                  .bucket(bucketName)
                  .file(sanitizedName)
                  .createWriteStream({// uploadedFiles - ссылка на корзину Cloud Storage из контекста сервера-context. 
                     resumable: false,//возобновляемый - нет
                     gzip: true,
                     metadata: {
                        //   // Enable long-lived HTTP caching headers
                        //   // Use only if the contents of the file will never change
                        //   // (If the contents will change, use cacheControl: 'no-cache')
                        cacheControl: 'no-cache'
                     }
                  })
                  .on("finish", () => {
                     storage.bucket(bucketName).file(sanitizedName).makePublic()
                        .then(() => {
                           Data = []

                           Data.push({
                              userName: username,
                              imageUrl: `https://storage.googleapis.com/${bucketName}/${sanitizedName}`
                           })
                           resolve()
                        })
                        .catch((e) => {
                           reject((e) => console.log(`exec error : ${e}`));
                        });
                  })
            )
         })
      },

      //мутация на удаление пользователя
      //Цель состоит в том, чтобы очистить массив данных и, проверив длину, вернуть логическое значение; - true, если элементов меньше 1, что означает, что массив пуст, и false, если нет.
      //Примечание. Если бы у нас было реальное соединение с базой данных, эта функция преобразователя приняла бы аргумент ID, который использовался бы при выборе пользователя, чья запись должна быть удалена.
      deleteUser: async (_) => {
         Data = []

         if (Data.length < 1) {
            return true
         } else {
            return false
         }
      }
   },

   Query: {
      getUser: () => {
         return Data
      }
   }

}