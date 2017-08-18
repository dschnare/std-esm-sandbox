import * as http from 'http'
import * as fs from 'fs'
import print from './print'
import getMessage from './get-message'

print(getMessage())

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end('Hello World!')
})

// Write the process ID to a file so the server can be stopped and restarted
// via npm restart.
fs.writeFileSync('pid', process.pid.toString(), 'utf8')

server.listen(5000)
