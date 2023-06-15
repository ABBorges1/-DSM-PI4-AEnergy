import { createServer } from 'net'
export async function findOpenPort() {
  const server = createServer()

  return new Promise((resolve, reject) => {
    server.listen(0, () => {
      const port = server.address().port

      server.close(err => {
        if (err) {
          return reject(err)
        }

        resolve(port)
      })
    })
  })
}
